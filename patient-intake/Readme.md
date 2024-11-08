# Patient Intake

This project is designed to create a virtual assistant bot for real-time AI tasks using the Daily API for video/audio rooms and Riva for text-to-speech (TTS). It leverages FastAPI for the server interface, and RTVI for processing audio and managing AI interactions. This README explains the project flow, components, and setup instructions.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Project Flow](#project-flow)
4. [Environment Setup](#environment-setup)
5. [Running the Project](#running-the-project)
6. [Troubleshooting](#troubleshooting)

## Project Structure

- **bot_runner.py**: Main server script for initializing FastAPI, managing API routes, and configuring Daily video/audio rooms.
- **bot.py**: Handles the bot's logic, initializes the audio transport, processes tasks, and configures responses.
- **llama_index_service.py**: Defines the LlamaIndex service class that integrates with the LLM (GPT-4) for conversational AI responses and handles chat completions.
- **riva_tts.py**: A service for TTS using NVIDIA's Riva, handling audio frame processing and timestamped word buffers.
- **model.py**: Data models and utilities for managing errors and logs.

## Features

- **Real-time video/audio communication** via the Daily API.
- **Conversational AI** integrated with OpenAI’s GPT-4 for conversational interactions.
- **Text-to-Speech** powered by NVIDIA Riva.
- **Error Logging** with custom error logs for easy debugging and tracing.
- **Environment Variable Support** for sensitive data and configuration.

## Project Flow

### Step 1: FastAPI Setup (bot_runner.py)
- Initializes FastAPI with CORS support.
- Defines routes and middleware for checking host access.
- Reads environment variables, including API keys and configurations.

### Step 2: Daily Room Management
- The `DailyRESTHelper` handles Daily room creation or retrieval.
- Configures the room URL and generates a token for session management.
- Uses a subprocess call to start `bot.py` with relevant room details.

### Step 3: Bot Initialization and Processing (bot.py)
- The `main` function initializes `DailyTransport` to manage audio and transcription.
- Configures `RTVIProcessor` to integrate the LLM and TTS APIs for bot responses.
- Manages the event handlers:
  - **on_first_participant_joined**: Captures participant transcription.
  - **on_participant_left**: Queues an end frame and exits.
  - **on_call_state_updated**: Manages call state and exit on disconnect.

### Step 4: AI Processing with LlamaIndex (llama_index_service.py)
- Uses the `LlamaIndex` client to interact with the GPT-4 model.
- Formats and processes chat completions for real-time responses.
- Utilizes OpenAI API and NVIDIA Riva for TTS to generate speech output.

### Step 5: Text-to-Speech with Riva (riva_tts.py)
- The `RivaTTSService` class connects to an NVIDIA Riva TTS server.
- Handles TTS by synthesizing audio from text and queuing the audio frames.
- Uses timestamped word buffers to manage word durations and mark the end of responses.
- Utilizes `AudioRawFrame` for audio playback and `TextFrame` to display processed text in real-time.

### Step 6: Pipeline Execution
- Configures a pipeline using `PipelineRunner` to run tasks for audio input and conversational processing.
- Runs tasks in real-time, queueing frames and responding based on audio and text inputs.

## Environment Setup

1. **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```
2. **Environment Variables**
    Create a `.env` file with the following keys:
    ```
    DAILY_API_KEY=your_daily_api_key
    OPENAI_API_KEY=your_openai_api_key
    
    ```
3. **NVIDIA Riva Server**:
    - Ensure your Riva server is configured and accessible at the specified IP and port (default `0.0.0.0:50051`).

4. **Run Server**
    ```bash
    python bot_runner.py
    ```

## Workflow Project

1. **Start the FastAPI Server**
    - Run `bot_runner.py` to initialize the API and manage room creation.
2. **Run Bot Process**
    - The `bot.py` subprocess automatically starts when a new Daily room is created.
3. **Test the Bot Interaction**
    - Send a POST request to `/` to start a bot session in the created Daily room.

## Troubleshooting

- **Missing Environment Variables**: Make sure all necessary environment variables are defined in `.env`.
- **Room Creation Errors**: Check your Daily API key and room creation settings.
- **Pipeline Errors**: Ensure all LLM models and dependencies are properly configured and accessible.
- **Riva Connection**: Ensure that the Riva TTS server is running and accessible on the specified IP and port.
- **en_core_web_sm**: python -m spacy download en_core_web_sm
