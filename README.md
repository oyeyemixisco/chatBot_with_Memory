# ExplainableAI Chatbot with Conversation Memory


## Building the Backend

A working chatbot backend with **rolling memory**. The chatbot remember the last 10 messages of the conversation. Older messages get dropped automatically as the conversation grows.

The backend expose three endpoints:

- `POST /chat` - send a message and get a response
- `GET /history` - retrieve the current conversation history
- `GET /clear` - reset the conversation

## Build a UI

Once your backend is running, we build a user interface for it. It is simple a desktop app, a CLI tool. The only requirement is that it connects to `/chat` endpoint and shows the conversation.

## To Run
- Run the notebook 
  
- Activate your environment in the terminal. Type and run this: python -m http.server 8000 

- Access the chatbot interface using the port displayed in the terminal
