import os
import base64
from llama_index.core.llms import ChatMessage
import base64
from typing import List
from loguru import logger
from pipecat.frames.frames import (
    Frame,
    LLMFullResponseEndFrame,
    LLMFullResponseStartFrame,
    LLMMessagesFrame,
    LLMModelUpdateFrame,
    TextFrame,
    VisionImageRawFrame
)
from pipecat.processors.aggregators.openai_llm_context import (
    OpenAILLMContext,
    OpenAILLMContextFrame
)
from pipecat.processors.frame_processor import FrameDirection
from pipecat.services.ai_services import (
    LLMService,
)
from openai.types.chat import (
        ChatCompletionMessageParam,
    )
from llama_index.llms.openai import OpenAI
from nemoguardrails.actions import action
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')
model_id = 'gpt-4'

class BaseLlamaIndexLLMService(LLMService):
    """This is the base for all services that use the LlamaIndex client with Llama 3."""

    def __init__(self, *, model=model_id, hf_token=api_key, **kwargs):
        super().__init__(**kwargs)
        self._model_name = model
        self._client = self.create_client(hf_token=hf_token, **kwargs)

    def create_client(self, hf_token=api_key, **kwargs):
        return OpenAI(model=self._model_name, api_key=hf_token, temperature=0.7, max_tokens=1024)

    def can_generate_metrics(self) -> bool:
        return True

    @action(is_system_action=True)
    async def get_chat_completions(
            self,
            context: OpenAILLMContext,
            messages: List[ChatCompletionMessageParam]):
        formatted_messages = self.format_messages(messages)
        
        # Send to gpt-4 model
        response = self._client.chat(formatted_messages)
        return response

    def format_messages(self, messages: List[ChatCompletionMessageParam]):
        """Formats the messages for the Llama model."""
        formatted = []
        for msg in messages:
            formatted.append(ChatMessage(role=msg["role"], content=msg["content"]))
        return formatted
    
    @action(is_system_action=True)
    async def _stream_chat_completions(
            self, context: OpenAILLMContext):
        logger.debug(f"Generating chat: {context.get_messages_json()}")

        messages: List[ChatCompletionMessageParam] = context.get_messages()

        # base64 encode any images
        for message in messages:
            if message.get("mime_type") == "image/jpeg":
                encoded_image = base64.b64encode(message["data"].getvalue()).decode("utf-8")
                text = message["content"]
                message["content"] = [
                    {"type": "text", "text": text},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
                ]
                del message["data"]
                del message["mime_type"]

        chunks = await self.get_chat_completions(context, messages)
        return chunks
    
    @action(is_system_action=True)
    async def _process_context(self, context: OpenAILLMContext):
        await self.start_ttfb_metrics()
        chunk_stream = await self._stream_chat_completions(context)
        print(chunk_stream, "------------------------>>>>>>>>> chunk stream")
        try:
            for chunk in chunk_stream:
                await self.stop_ttfb_metrics()
                if chunk[1].content:
                    await self.push_frame(TextFrame(chunk[1].content))
        except Exception as e:
            pass

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        await super().process_frame(frame, direction)

        context = None
        if isinstance(frame, OpenAILLMContextFrame):
            context: OpenAILLMContext = frame.context
        elif isinstance(frame, LLMMessagesFrame):
            context = OpenAILLMContext.from_messages(frame.messages)
        elif isinstance(frame, VisionImageRawFrame):
            context = OpenAILLMContext.from_image_frame(frame)
        elif isinstance(frame, LLMModelUpdateFrame):
            logger.debug(f"Switching LLM model to: [{frame.model}]")
            self._model_name = frame.model
        else:
            await self.push_frame(frame, direction)

        if context:
            await self.push_frame(LLMFullResponseStartFrame())
            await self.start_processing_metrics()
            await self._process_context(context)
            await self.stop_processing_metrics()
            await self.push_frame(LLMFullResponseEndFrame())

class llamaIndexService(BaseLlamaIndexLLMService):

    def __init__(self, *, model: str=model_id, **kwargs):
        super().__init__(model=model, **kwargs)
