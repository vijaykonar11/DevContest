import uuid
import asyncio
import time
from typing import AsyncGenerator
from pipecat.processors.frame_processor import FrameDirection
from pipecat.frames.frames import (
    Frame,
    AudioRawFrame,
    StartInterruptionFrame,
    StartFrame,
    EndFrame,
    TextFrame,
    LLMFullResponseEndFrame
)
from pipecat.services.ai_services import TTSService
from loguru import logger
import riva.client

class RivaTTSService(TTSService):

    def __init__(
            self,
            *,
            server: str="0.0.0.0:50051",
            language_code: str = "en-US",
            sample_rate: int = 16000,
            voice_name: str = None,
            **kwargs):
        super().__init__(**kwargs)

        self._aggregate_sentences = True
        self._push_text_frames = False

        self._server = server
        self._language_code = language_code
        self._sample_rate = sample_rate
        self._voice_name = voice_name
        self._auth = riva.client.Auth(uri=server)
        self._tts_service = riva.client.SpeechSynthesisService(self._auth)

        self._context_id = None
        self._context_id_start_timestamp = None
        self._timestamped_words_buffer = []
        self._receive_task = None
        self._context_appending_task = None

    def can_generate_metrics(self) -> bool:
        return True

    async def set_voice(self, voice: str):
        logger.debug(f"Switching TTS voice to: [{voice}]")
        self._voice_name = voice

    async def start(self, frame: StartFrame):
        await super().start(frame)

    async def stop(self, frame: EndFrame):
        await super().stop(frame)

    async def _handle_interruption(self, frame: StartInterruptionFrame, direction: FrameDirection):
        await super()._handle_interruption(frame, direction)
        self._context_id = None
        self._context_id_start_timestamp = None
        self._timestamped_words_buffer = []
        await self.stop_all_metrics()
        await self.push_frame(LLMFullResponseEndFrame())

    async def _receive_task_handler(self):
        try:
            while True:
                await asyncio.sleep(0.1)
                if not self._context_id_start_timestamp:
                    continue
                elapsed_seconds = time.time() - self._context_id_start_timestamp
                while self._timestamped_words_buffer and self._timestamped_words_buffer[0][1] <= elapsed_seconds:
                    word, timestamp = self._timestamped_words_buffer.pop(0)
                    if word == "LLMFullResponseEndFrame" and timestamp == 0:
                        await self.push_frame(LLMFullResponseEndFrame())
                        continue
                    await self.push_frame(TextFrame(word))
        except Exception as e:
            logger.exception(f"{self} exception: {e}")

    async def _context_appending_task_handler(self):
        await self._receive_task_handler()

    async def run_tts(self, text: str) -> AsyncGenerator[Frame, None]:
        logger.debug(f"Generating TTS: [{text}]")

        try:
            if not self._context_id:
                await self.start_ttfb_metrics()
                self._context_id = str(uuid.uuid4())

            resp = self._tts_service.synthesize(
                text, 
                voice_name=self._voice_name, 
                language_code=self._language_code, 
                sample_rate_hz=self._sample_rate
            )
            audio = resp.audio
            meta = resp.meta

            if not self._context_id_start_timestamp:
                self._context_id_start_timestamp = time.time()

            frame = AudioRawFrame(
                audio=audio,
                sample_rate=self._sample_rate,
                num_channels=1
            )
            await self.push_frame(frame)

            for word, duration in zip(meta.processed_text.split(), meta.predicted_durations):
                self._timestamped_words_buffer.append((word, duration))

            self._timestamped_words_buffer.append(("LLMFullResponseEndFrame", 0))
            yield None
        except Exception as e:
            logger.exception(f"{self} exception: {e}")
