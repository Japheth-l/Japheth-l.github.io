// ── Footer year ───────────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Terminal typing effect ────────────────────────────────────────────────────
const target = document.getElementById('terminalText');

const lines = [
  { text: '$ curl https://japheth-l-github-io.onrender.com/api/me', pause: 500 },
  { text: '', pause: 150 },
  { text: '{', pause: 80 },
  { text: '  "name": "Japheth Mwinekpieng Lamuo",', pause: 80 },
  { text: '  "role": "Backend Developer",', pause: 80 },
  { text: '  "location": "Accra, Ghana",', pause: 80 },
  { text: '  "stack": ["Node.js", "Express", "MongoDB"],', pause: 80 },
  { text: '  "status": "open_to_work"', pause: 80 },
  { text: '}', pause: 80 },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderInstantly() {
  target.textContent = lines.map(l => l.text).join('\n');
}

async function typeLines() {
  for (const line of lines) {
    await typeLine(line.text);
    target.textContent += '\n';
    await wait(line.pause);
  }
}

function typeLine(text) {
  return new Promise(resolve => {
    let i = 0;
    if (text.length === 0) { resolve(); return; }
    const interval = setInterval(() => {
      target.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, 14);
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (reduceMotion) {
  renderInstantly();
} else {
  typeLines();
}

// ── Contact form → microservice ───────────────────────────────────────────────
const CONTACT_API = 'https://japheth-l-github-io.onrender.com/contact';

const nameInput    = document.getElementById('cf-name');
const emailInput   = document.getElementById('cf-email');
const messageInput = document.getElementById('cf-message');
const submitBtn    = document.getElementById('cf-submit');
const statusEl     = document.getElementById('cf-status');

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className   = 'cf-status ' + type;
}

submitBtn.addEventListener('click', async () => {
  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const message = messageInput.value.trim();

  // Client-side guard (server validates too)
  if (!name || !email || !message) {
    setStatus('Please fill in all fields.', 'error');
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending...';
  setStatus('', '');

  try {
    const res = await fetch(CONTACT_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setStatus('Message sent! I\'ll be in touch soon.', 'success');
      nameInput.value    = '';
      emailInput.value   = '';
      messageInput.value = '';
    } else {
      const msg = data.errors ? data.errors.join(' · ') : (data.message || 'Something went wrong.');
      setStatus(msg, 'error');
    }
  } catch (err) {
    console.error('Contact fetch error:', err);
    setStatus('Network error. Please email me directly at lamuojapheth@gmail.com', 'error');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send message';
  }
});