# Real Time Patient Intake

This project leverages a client and transport library to enable real-time communication with an AI service, facilitating both event-driven updates and message exchanges. By using a specialized transport layer, the application can establish a robust channel for sending and receiving events, messages, and media in real time.

## Overview

The client connects to a backend AI service, allowing it to interact dynamically. This setup supports a range of features, from simple text exchanges to more complex, event-driven scenarios.

### Key Components

- **Client Initialization**: The client is configured to use a transport layer, which manages the connection to the backend AI. This configuration may include setup parameters specific to the transport provider.
- **Event Handling**: The client listens for various events, enabling real-time responsiveness. Common events include:

  - **Connect**: Triggered when a successful connection is established.
  - **Message**: Fired whenever a new message is received from the AI service.
  - **Disconnect**: Triggered when the client disconnects from the AI service.

- **Messaging**: Messages can be sent to and received from the AI in real time, enabling interactive and conversational experiences. Each message contains a specific type and content, making it easy to structure interactions.

### Workflow

1. **Initialize and Configure Client**: The client is instantiated and configured to use the transport layer. This setup might include parameters like room configurations or authentication tokens.

2. **Establish Connection**: Once the client is initialized, it attempts to connect to the AI service through the transport layer. Successful connection triggers the relevant event.

3. **Interact with AI**:

   - The client listens for real-time events, responding to messages and other signals from the AI service.
   - Outgoing messages are sent as structured data, which the AI processes and responds to in real time.

4. **Handle Disconnection**: When interaction concludes, the client disconnects, freeing up resources.

### Configuration

The transport layer may require specific configuration options, depending on the communication provider. Typical parameters include:

- Room details for establishing the session
- Authentication tokens, if needed for secure access

## Project Setup

Follow these steps to install and configure the project:

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 2. Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vijaykonar11/DevContest
   cd DevContest/patient_intake_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### 3. Configure the Backend URL

In order to connect to the backend AI service, you need to specify the backend URL. Open the configuration file where the transport layer settings are defined, typically found at `.env`.

**Example of configuring the backend URL:**

```javascript

  baseUrl: "http://localhost:8078", // Your backend URL
```

Make sure to replace `"http://localhost:8078"` with your actual backend URL.

### 4. Start the Application

Once the configuration is set, you can start the application:

```bash
npm start
```

This will start the application and open it in your default browser. You should now be able to interact with the AI service in real time.
