const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Menyimpan riwayat percakapan (multi-turn) sesuai format backend
let conversation = [];

function appendLine(role, text) {
  const line = document.createElement('div');
  line.classList.add('line', role === 'user' ? 'user' : 'bot');

  const who = document.createElement('span');
  who.classList.add('who');
  who.textContent = role === 'user' ? 'kamu' : 'AjilBot';

  const content = document.createElement('span');
  content.classList.add('content');

  const textEl = document.createElement('span');
  textEl.classList.add('text');
  textEl.textContent = text;

  content.appendChild(who);
  content.appendChild(textEl);
  line.appendChild(content);
  chatBox.appendChild(line);
  chatBox.scrollTop = chatBox.scrollHeight;

  return textEl;
}

function typeText(el, text, speed = 18) {
  return new Promise((resolve) => {
    let i = 0;

    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    el.parentElement.appendChild(cursor);

    const tick = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(tick, speed);
      } else {
        cursor.remove();
        resolve();
      }
    };

    tick();
  });
}

function showThinking() {
  const line = document.createElement('div');
  line.classList.add('line', 'bot');

  const who = document.createElement('span');
  who.classList.add('who');
  who.textContent = 'AjilBot';

  const content = document.createElement('span');
  content.classList.add('content');

  const cursor = document.createElement('span');
  cursor.classList.add('cursor');

  content.appendChild(who);
  content.appendChild(cursor);
  line.appendChild(content);
  chatBox.appendChild(line);
  chatBox.scrollTop = chatBox.scrollHeight;

  return { line, content, who };
}

// Pesan sambutan awal, ditampilkan dengan efek ketik
const welcomeEl = appendLine('bot', '');
typeText(welcomeEl, 'Hai! Aku AjilBot. Tanya aja soal AI Engineering, machine learning, atau prompting ya.');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendLine('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });
  input.value = '';

  const thinking = showThinking();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText =
      data && data.result ? data.result : 'Sorry, no response received.';

    // Ganti kursor "sedang mengetik" dengan efek typewriter jawaban asli
    thinking.content.innerHTML = '';
    thinking.content.appendChild(thinking.who);
    const textEl = document.createElement('span');
    textEl.classList.add('text');
    thinking.content.appendChild(textEl);

    await typeText(textEl, resultText);

    if (data && data.result) {
      conversation.push({ role: 'model', text: data.result });
    }
  } catch (error) {
    console.error('Error fetching response:', error);
    thinking.content.innerHTML = '';
    thinking.content.appendChild(thinking.who);
    const textEl = document.createElement('span');
    textEl.classList.add('text');
    textEl.textContent = 'Failed to get response from server.';
    thinking.content.appendChild(textEl);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});
