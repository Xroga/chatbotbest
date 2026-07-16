// Theme toggle
const themeSwitch = document.getElementById('theme-switch');
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
themeSwitch.checked = currentTheme === 'dark';

themeSwitch.addEventListener('change', () => {
  const newTheme = themeSwitch.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Chat logic
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');

function renderMessages() {
  messagesContainer.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = `message ${msg.role}`;
    div.textContent = msg.content;
    messagesContainer.appendChild(div);
  });
  scrollToBottom();
}

function scrollToBottom() {
  const container = document.getElementById('chat-container');
  container.scrollTop = container.scrollHeight;
}

function addMessage(role, content) {
  messages.push({ role, content });
  localStorage.setItem('chatMessages', JSON.stringify(messages));
  renderMessages();
}

function showTyping() {
  typingIndicator.classList.remove('hidden');
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.classList.add('hidden');
}

function mockStreamReply(userMessage) {
  const replies = [
    "That's an interesting point! Let me think about it...",
    "Great question! Here's what I can tell you about that.",
    "I'm not entirely sure, but I can try to help.",
    "Based on my knowledge, here's a detailed explanation...",
    "I see what you're saying. Let me break it down for you.",
    "That's a complex topic. Here's a simple overview.",
    "Interesting! Let me share some insights on that.",
    "I understand. Let me provide you with more information."
  ];
  const baseReply = replies[Math.floor(Math.random() * replies.length)];
  const extra = " Also, feel free to ask me anything else!";
  const fullReply = baseReply + extra;

  // simulate streaming by revealing characters in chunks
  let index = 0;
  const assistantDiv = document.createElement('div');
  assistantDiv.className = 'message assistant';
  assistantDiv.textContent = '';
  messagesContainer.appendChild(assistantDiv);
  scrollToBottom();

  function typeChunk() {
    if (index < fullReply.length) {
      const chunkSize = Math.floor(Math.random() * 3) + 1; // 1-3 characters
      const chunk = fullReply.substring(index, index + chunkSize);
      assistantDiv.textContent += chunk;
      index += chunkSize;
      scrollToBottom();
      // random delay between 30-80ms
      const delay = Math.floor(Math.random() * 50) + 30;
      setTimeout(typeChunk, delay);
    } else {
      // done
      hideTyping();
      addMessage('assistant', fullReply);
      // remove the temporary streaming div
      if (messagesContainer.contains(assistantDiv) && messagesContainer.lastChild !== assistantDiv) {
        // we added it temporarily; now remove it because we added the permanent message
        assistantDiv.remove();
      } else {
        // if it's the last, keep but replace content? better: remove and keep full message already added
        // but we already added via addMessage, so remove temp
        assistantDiv.remove();
      }
      // re-render to ensure order
      renderMessages();
    }
  }

  // remove any previous typing indicator after showing
  hideTyping();
  // start streaming directly
  typeChunk();
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage('user', text);
  userInput.value = '';

  showTyping();

  // simulate server delay before starting stream
  setTimeout(() => {
    mockStreamReply(text);
  }, 800);
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// Initialize
renderMessages();

(function () {
  var root = document.documentElement;
  var KEY = 'xroga-theme';
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(KEY, theme); } catch (_) {}
    var btn = document.getElementById('theme-toggle') || document.querySelector('[data-theme-toggle]');
    if (btn) {
      var next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      btn.innerHTML = theme === 'dark'
        ? '<i data-lucide="sun" aria-hidden="true"></i><span>Day</span>'
        : '<i data-lucide="moon" aria-hidden="true"></i><span>Night</span>';
      try { if (window.lucide) lucide.createIcons(); } catch (_) {}
    }
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (_) {}
  var preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved === 'light' || saved === 'dark' ? saved : (preferDark ? 'dark' : 'light'));
  function wire(el) {
    if (!el || el.dataset.xrogaThemeWired) return;
    el.dataset.xrogaThemeWired = '1';
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      apply(cur === 'dark' ? 'light' : 'dark');
    });
  }
  wire(document.getElementById('theme-toggle'));
  document.querySelectorAll('[data-theme-toggle], .theme-toggle, .night-day-toggle, button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="night" i]').forEach(wire);
})();