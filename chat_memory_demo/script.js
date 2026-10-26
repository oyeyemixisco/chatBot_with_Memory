const BACKEND_URL = 'https://imperial-seventy-deplored.ngrok-free.dev';

const chat = document.getElementById('chat');
const form = document.getElementById('chatForm');
const messageInput = document.getElementById('message');
const statusText = document.getElementById('status');
const typing = document.getElementById('typing');
const sendBtn = document.getElementById('sendBtn');
const connectionStatus = document.getElementById('connectionStatus');
const connectionDot = document.getElementById('connectionDot');


let allMessages = [];
let memory = [];
let busy = false;
let connected = false;

function showMessages() {
  chat.innerHTML = '';
  if (allMessages.length === 0) {
    chat.innerHTML = '<div class="welcome"><div class="welcome-icon">💬</div><h2>How can I help you?</h2><p>Ask any question, I will do my best to assist you.</p></div>';
    return;
  }
  allMessages.forEach(item => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + item.role;
    const label = document.createElement('small');
    label.textContent = item.role === 'user' ? 'YOU' : 'CHATBOT';
    bubble.appendChild(label);
    bubble.appendChild(document.createTextNode(item.content));
    chat.appendChild(bubble);
  });
  chat.scrollTop = chat.scrollHeight;
}

function showMemory() {
  document.getElementById('memoryCount').textContent = memory.length + '/10';
  document.getElementById('memoryFill').style.width = (memory.length / 10 * 100) + '%';
  const list = document.getElementById('memoryList');
  list.innerHTML = '';
  if (memory.length === 0) {
    list.textContent = 'No messages yet.';
    return;
  }
  let u = 0;
  let a = 0;
  memory.forEach(item => {
    const row = document.createElement('div');
    row.className = 'memory-item';
    const tag = document.createElement('b');
    tag.textContent = item.role === 'user' ? 'U' + (++u) : 'A' + (++a);
    const snippet = document.createElement('span');
    snippet.textContent = item.content;
    row.append(tag, snippet);
    list.appendChild(row);
  });
}

function setBusy(value) {
  busy = value;
  typing.hidden = !value;
  sendBtn.disabled = value || !connected;
  messageInput.disabled = value;
}

function setConnection(online) {
  connected = online;
  connectionStatus.textContent = online ? 'Conversation Memory Enabled' : 'Backend not connected';
  connectionDot.className = online ? 'dot online' : 'dot offline';
  sendBtn.disabled = !online || busy;
}

async function loadHistory() {
  try {
    const response = await fetch(BACKEND_URL + '/history', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    memory = data.history || [];
    allMessages = [...memory];
    showMessages();
    showMemory();
    setConnection(true);
    statusText.textContent = 'Connected • ChatBot Ready';
  } catch (error) {
    setConnection(false);
    statusText.textContent = 'Cannot connect. Check BACKEND_URL in script.js and your Kaggle server.';
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message || busy || !connected) return;

  allMessages.push({ role: 'user', content: message });
  messageInput.value = '';
  showMessages();
  setBusy(true);
  statusText.textContent = 'Waiting for Qwen...';

  try {
    const response = await fetch(BACKEND_URL + '/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'HTTP ' + response.status);
    allMessages.push({ role: 'assistant', content: data.reply });
    memory = data.history || [];
    showMessages();
    showMemory();
    statusText.textContent = 'Connected • Memory updated';
  } catch (error) {
    statusText.textContent = 'Message failed: ' + error.message;
  } finally {
    setBusy(false);
    messageInput.focus();
  }
});

// Enter sends the message; Shift+Enter inserts a new line.
messageInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    form.requestSubmit();
  }
});

document.getElementById('memoryToggle').addEventListener('click', () => {
  const details = document.getElementById('memoryDetails');
  details.hidden = !details.hidden;
  document.getElementById('memoryToggle').setAttribute('aria-expanded', String(!details.hidden));
  document.getElementById('arrow').textContent = details.hidden ? '⌄' : '⌃';
});

document.getElementById('clearBtn').addEventListener('click', async () => {
  if (busy || !connected) return;
  try {
    const response = await fetch(BACKEND_URL + '/clear', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    allMessages = [];
    memory = [];
    showMessages();
    showMemory();
    statusText.textContent = 'Conversation cleared';
  } catch (error) {
    statusText.textContent = 'Could not clear chat: ' + error.message;
  }
});

showMemory();
loadHistory();
