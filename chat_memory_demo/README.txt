AI CHAT ASSISTANT - CONVERSATION MEMORY DEMO

FILES:
index.html - interface
style.css - design
script.js - connects to Qwen Flask backend

RUN:
1. Start your Kaggle notebook backend and copy its ngrok base URL.
2. Serve this folder locally using: python -m http.server 8000
3. Open http://127.0.0.1:8000
4. Expand Backend connection settings, enter the ngrok URL and click Connect.
5. Send a message, then ask the model to recall it.
6. Open Conversation Memory to inspect the last 10 stored messages.

IMPORTANT CORS NOTE:
Because this HTML runs on a different origin from Kaggle's ngrok server,
add flask-cors to the notebook and call CORS(app) after app = Flask(__name__).
For example:
  !pip install flask-cors
  from flask_cors import CORS
  app = Flask(__name__)
  CORS(app)

The memory panel shows U1/A1 labels within the CURRENT 10-message window.
These labels are display-only; they are not permanent message IDs.

The backend is shared in-memory chat, not per-user sessions.
