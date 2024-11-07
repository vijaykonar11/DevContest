import argparse
import asyncio
import datetime
import sys
import os
# from model import *
from fastapi import HTTPException
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.pipeline.runner import PipelineRunner
from rtvi import (
    RTVIConfig,
    RTVIProcessor,
    RTVISetup)
from pipecat.frames.frames import EndFrame
from pipecat.transports.services.daily import DailyParams, DailyTransport
from pipecat.vad.silero import SileroVADAnalyzer
from loguru import logger
from dotenv import load_dotenv
load_dotenv(override=True)

# logger.remove(0)
logger.add(sys.stderr, level="DEBUG")


async def main(room_url, token, bot_config, user_id):
    function_name = "main_bot"
    
    try:

        transport = DailyTransport(
            room_url,
            token,
            "Realtime AI",
            DailyParams(
                audio_out_enabled=True,
                transcription_enabled=True,
                vad_enabled=True,
                vad_analyzer=SileroVADAnalyzer()
            )
        )
    except Exception as e:
        error_msg = f"Failed to initialize DailyTransport: {str(e)}"
        # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        # raise HTTPException(status_code=500, detail=error_msg)

    try:
        rtai = RTVIProcessor(
            transport=transport,
            setup=RTVISetup(config=bot_config),
        )
    except Exception as e:
        error_msg = f"Failed to initialize RTVIProcessor: {str(e)}"
        # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        # raise HTTPException(status_code=500, detail=error_msg)

    try:
        runner = PipelineRunner()
    except Exception as e:
        error_msg = f"Failed to initialize PipelineRunner: {str(e)}"
        # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        # raise HTTPException(status_code=500, detail=error_msg)

    try:
        pipeline = Pipeline([transport.input(), rtai])
    except Exception as e:
        error_msg = f"Failed to initialize Pipeline: {str(e)}"
        # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        # raise HTTPException(status_code=500, detail=error_msg)

    try:
        task = PipelineTask(
            pipeline,
            params=PipelineParams(
                allow_interruptions=True,
                enable_metrics=True,
                send_initial_empty_metrics=False,
            )
        )
    except Exception as e:
        error_msg = f"Failed to create PipelineTask: {str(e)}"
        # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        # raise HTTPException(status_code=500, detail=error_msg)

    try:
        @transport.event_handler("on_first_participant_joined")
        async def on_first_participant_joined(transport, participant):
            try:
                transport.capture_participant_transcription(participant["id"])
                # logger.info("First participant joined")
            except Exception as e:
                error_msg = f"Error in on_first_participant_joined: {str(e)}"
                # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name="on_first_participant_joined", created_at=datetime.now(), updated_at=datetime.now()).save()

        @transport.event_handler("on_participant_left")
        async def on_participant_left(transport, participant, reason):
            try:
                await task.queue_frame(EndFrame())
                # logger.info("Participant left. Exiting.")
            except Exception as e:
                error_msg = f"Error in on_participant_left: {str(e)}"
                # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name="on_participant_left", created_at=datetime.now(), updated_at=datetime.now()).save()

        @transport.event_handler("on_call_state_updated")
        async def on_call_state_updated(transport, state):
            try:
                # logger.info("Call state %s " % state)
                if state == "left":
                    await task.queue_frame(EndFrame())
            except Exception as e:
                error_msg = f"Error in on_call_state_updated: {str(e)}"
                # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name="on_call_state_updated", created_at=datetime.now(), updated_at=datetime.now()).save()
    except Exception as e:
        error_msg = f"Error setting event handlers: {str(e)}"
        # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        raise HTTPException(status_code=500, detail=error_msg)

    try:
        await runner.run(task)
    except Exception as e:
        error_msg = f"Error running PipelineTask: {str(e)}"
        # ErrorLogs(user_id=user_id, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        raise HTTPException(status_code=500, detail=error_msg)


if __name__ == "__main__":
    function_name = "__main__"

    try:
        parser = argparse.ArgumentParser(description="RTVI Bot Example")
        parser.add_argument("-u", type=str, help="Room URL")
        parser.add_argument("-t", type=str, help="Token")
        # parser.add_argument("-userid", type=str, help="User ID")
        config = parser.parse_args()

        config_for_llm = {
            "config": {
                "llm": {
                    "model": "gpt-4",
                    "messages" : [
                    {
                        "role": "system",
                        "content": "You are Jessica, an AI agent for Source Infotech Health Services. Your role is to collect essential information from the user prior to their doctor visit. Be polite, professional, and clear in your communication. Begin by introducing yourself and asking for the user's name. Always address the user by their first name after they provide it. You are not a medical professional, so do not offer medical advice. Your goal is to gather information accurately and pass it to the healthcare provider."
                    },
                    {
                        "role": "system",
                        "content": "After getting the user's name, politely ask them to confirm their identity by providing their full birthdate, including the year. If you are uncertain about the user's response or any information is unclear, ask for clarification before moving forward."
                    },
                    {
                        "role": "system",
                        "content": "Once the birthdate is confirmed, thank the user for verifying their identity. Ask again if birthday is unclear to you and always confirm the birhdate to the user before moving forword. Next, ask the user to list any current prescriptions they are taking. For each prescription, request both the medication name and dosage. If the user is unsure of the dosage, gently ask them to clarify or provide as much detail as possible. Do not proceed until each prescription has a known dosage or the user has confirmed they don't have that information."
                    },
                    {
                        "role": "system",
                        "content": "After gathering prescription details, ask the user if they have any known allergies. If they do, record the allergy information. If not, confirm that they do not have any allergies before moving forward."
                    },
                    {
                        "role": "system",
                        "content": "Finally, ask the user the reason for their doctor visit today. Once they provide their reason, thank them for sharing and confirm their response to ensure accuracy."
                    },
                    {
                        "role": "system",
                        "content": "After collecting all the required information, thank the user once again for their time and end the conversation."
                    },
                    {
                        "role": "system",
                        "content": '''Instructions for the conversation:
                        1. If any information provided by the user is unclear, politely ask for clarification before proceeding.
                        2. Always confirm the user's details (name, birthdate, prescriptions, allergies, and reason for visit) after they provide them.
                        3. Be polite, concise, and maintain a professional tone throughout the interaction. Keep responses short and relevant.'''
                    }
                                ]
                },
                "tts": {
                    "voice": "79a125e8-cd45-4c13-8a67-188112f4dd22"
                }
            }
        }

        try:
            bot_config = RTVIConfig(**config_for_llm["config"])
        except Exception as e:
            error_msg = f"Failed to parse bot configuration: {str(e)}"
            # ErrorLogs(user_id=None, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
            raise HTTPException(status_code=500, detail=error_msg)

        if config.u and config.t:
            # asyncio.run(main(config.u, config.t, bot_config))
            asyncio.run(main(config.u, config.t, bot_config, '12345'))
        else:
            logger.error("Room URL and Token are required")
    except Exception as e:
        error_msg = f"Error in _main_ block: {str(e)}"
        # ErrorLogs(user_id=None, error_msg=error_msg, function_name=function_name, created_at=datetime.now(), updated_at=datetime.now()).save()
        raise HTTPException(status_code=500, detail=error_msg)