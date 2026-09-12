// ============================================================
// Yug Sharma — Portfolio interactions
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Sticky nav background on scroll ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('[data-nav]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

// ---------- Typing effect ----------
const roles = [
  'Backend Engineer',
  'Distributed Systems Builder',
  'Kafka & Microservices',
  'Exploring Generative AI'
];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealing'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Animated stat counters ----------
const statEls = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObserver.observe(el));

// ---------- Learning progress bars ----------
const progressEls = document.querySelectorAll('.progress-fill');
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.width = el.dataset.progress + '%';
    progressObserver.unobserve(el);
  });
}, { threshold: 0.4 });
progressEls.forEach(el => progressObserver.observe(el));

// ---------- Cursor glow (desktop only) ----------
const glow = document.querySelector('.cursor-glow');
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ---------- Work card mouse-follow glow ----------
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// ============================================================
// "Ask My Portfolio" — hybrid live-LLM + static-fallback Q&A.
//
// Set ASK_API_URL to a deployed serverless endpoint (see /ask-api in this
// project) and questions are answered by a real model, grounded on a
// knowledge base of my actual experience. Leave it blank and the widget
// falls back to fast, local keyword matching against ASK_KB below — no
// API, no key, no cost, and it still works the moment you open the page
// or push straight to GitHub Pages. If the live call ever fails (offline,
// cold start, rate limit), it silently falls back to the same static
// matching, so the widget never breaks for a visitor.
const ASK_API_URL = 'https://yug-portfolio-ask-api.vercel.app/api/ask';
const ASK_TIMEOUT_MS = 12000;

const ASK_KB = [
  { keywords: ['kafka', 'event', 'streaming', 'stream', 'queue', 'partition'],
    answer: "I've built Kafka-based event-streaming pipelines at Lifemaan — partitioned consumer groups process orders per branch in parallel, which removed a synchronous, tightly-coupled prescription-to-pharmacy flow entirely." },
  { keywords: ['mongo', 'mongodb', 'database', 'transaction', 'aggregation'],
    answer: "Heavy MongoDB user — multi-document ACID transactions across financial controllers, aggregation pipelines for reporting, and compound indexing tuned against real explain() output." },
  { keywords: ['redis', 'cache', 'caching', 'lock'],
    answer: "Redis cache-aside with TTL invalidation for catalog lookups, plus distributed locks so two processes can't confirm the same stock at once." },
  { keywords: ['draft', 'confirm', 'state machine', 'billing', 'discrepan'],
    answer: "DRAFT→CONFIRM is a two-stage billing state machine I built at Lifemaan — a bill stays editable in DRAFT while stock, pricing and insurance checks run, and only locks into CONFIRM once every check clears. It's what cut billing discrepancies 40%." },
  { keywords: ['remote', 'onsite', 'location', 'relocate', 'work from', 'hybrid', 'where', 'based'],
    answer: "Open to both remote and onsite roles. I'm based in India, and happy to talk relocation or hybrid setups." },
  { keywords: ['contact', 'email', 'reach', 'phone', 'call'],
    answer: "Easiest is email — yugsharma4499@gmail.com — or LinkedIn. I usually reply within a day." },
  { keywords: ['genai', 'generative ai', 'generative', 'llm', 'rag', 'prompt', 'agentic'],
    answer: "Currently going deep on LLM fundamentals, RAG pipelines and agentic workflows — applying the same systems-thinking from backend work to AI-native problems. This Q&A box is a small piece of that: a hand-built knowledge base with keyword-based retrieval, running entirely client-side." },
  { keywords: ['dsa', 'data structure', 'algorithm', 'leetcode', 'problem solving'],
    answer: "I keep a standing habit of daily DSA practice — arrays, graphs, DP, system design — alongside full-time delivery work at Lifemaan." },
  { keywords: ['how many years', 'total experience', 'career background', 'professional summary', 'about yourself', 'tell me about you', 'career so far', 'work history'],
    answer: "5 years as a backend engineer: Tata Consultancy Services, then MWB Technologies, and now Senior Software Developer at Lifemaan — mostly Java/Spring and Node.js." },
  { keywords: ['java', 'spring'],
    answer: "Java 8/11+ with Spring Boot, Spring MVC and Spring Security (JWT) is the backbone of my day-to-day work at Lifemaan." },
  { keywords: ['node', 'express', 'javascript'],
    answer: "Node.js and Express.js were my daily drivers at MWB Technologies, powering the subscription and wallet APIs the company's revenue ran on." },
  { keywords: ['resume', 'cv', 'download'],
    answer: "Grab it from the Resume button up in the nav, or the download link down in Contact." },
  { keywords: ['migration', 'drug master', 'opd', 'records'],
    answer: "Led a migration unifying 70,000+ drug records into a clean 200,000-record master list with zero broken references, alongside a 31-flag rollout system for zero-deployment releases." },
  { keywords: ['mentor', 'junior', 'team', 'lead'],
    answer: "I mentor junior engineers on API design and code review at Lifemaan — it's cut PR round-trips by roughly 30%." },
  { keywords: ['microservice', 'architecture', 'design pattern', 'solid', 'cqrs', 'saga'],
    answer: "I lean on microservices, event-driven design, SOLID, CQRS, Saga and state machines — the pharmacy platform at Lifemaan is domain-isolated with its own database and auth boundary, on purpose." },
  { keywords: ['test', 'testing', 'jest', 'junit', 'quality', 'supertest'],
    answer: "Jest and Supertest on the Node side, JUnit on the Java side, plus Swagger/OpenAPI and Postman to keep API contracts honest before they ship." },
  { keywords: ['education', 'degree', 'college', 'university', 'cgpa', 'btech'],
    answer: "B.Tech in Engineering from Birla Vishvakarma Mahavidyalaya, Anand — graduated May 2021 with an 8.8 CGPA." },
  { keywords: ['notice period', 'join', 'available', 'start date', 'when can you'],
    answer: "Depends on the role — happy to talk timelines directly. Email me and we can figure it out." },
  { keywords: ['salary', 'compensation', 'ctc', 'pay'],
    answer: "That's a direct-conversation topic — depends on scope and role. Reach out by email and I'm happy to discuss." },
  { keywords: ['tcs', 'tata consultancy'],
    answer: "At TCS I ran the SAP Portal lifecycle for a banking client end-to-end — specs, coding, integration testing — and coordinated go-live with the AWS team." },
  { keywords: ['mwb', 'master portal', 'tirth', 'easy stock'],
    answer: "At MWB Technologies I owned Node.js backend work across three products — Tirth, Master Portal, Easy Stock — and rebuilt the database schemas behind them for a 35% performance gain." },
  { keywords: ['aws', 'cloud', 'ec2', 's3', 'sqs'],
    answer: "AWS EC2, S3 and SQS for infra, deployed via PM2 cluster + Nginx with GitHub Actions CI/CD catching regressions before they merge." },
  { keywords: ['docker', 'container'],
    answer: "Docker for containerized deployments, alongside Maven builds and GitHub Actions pipelines." },
  { keywords: ['favorite', 'enjoy', 'like most', 'passion'],
    answer: "Owning a system end-to-end — from data model to the CI/CD pipeline that ships it — and the moment a gnarly production bug turns out to be one bad assumption, not a mystery." },
  { keywords: ['looking for', 'career goal', 'next role', 'what do you want'],
    answer: "A backend or platform role with real ownership and scale — ideally somewhere I can also lean into the Generative AI work I'm building toward." },
  { keywords: ['achievement', 'proudest', 'biggest win', 'proud of'],
    answer: "Probably the DRAFT→CONFIRM billing state machine at Lifemaan — a small design decision that cut billing discrepancies 40% because it made bad states structurally impossible, not just less likely." },
  { keywords: ['hire', 'why you', 'why should'],
    answer: "5 years of owning backend systems end-to-end, a track record of measurable fixes (40% fewer billing discrepancies, 45% faster reporting), and I'm already building toward where the field is heading next." },
];
const ASK_FALLBACK = "I don't have a canned answer for that one — this demo only knows what's in the KB above. Email me at yugsharma4499@gmail.com and ask directly.";

function askEscapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Word-boundary matching (not plain substring) so short keywords like "ai"
// don't fire on unrelated words like "explain" or "again".
function askMatchCount(question, entry) {
  const q = question.toLowerCase();
  let count = 0, length = 0;
  entry.keywords.forEach(kw => {
    const re = new RegExp('\\b' + askEscapeRegex(kw.toLowerCase()) + '\\b');
    if (re.test(q)) { count += 1; length += kw.length; }
  });
  return { count, length };
}

function askBestAnswer(question) {
  let best = null, bestCount = 0, bestLength = 0;
  ASK_KB.forEach(entry => {
    const { count, length } = askMatchCount(question, entry);
    if (count > bestCount || (count === bestCount && length > bestLength)) {
      best = entry; bestCount = count; bestLength = length;
    }
  });
  return best && bestCount > 0 ? best.answer : ASK_FALLBACK;
}

const askLog = document.getElementById('askLog');
const askForm = document.getElementById('askForm');
const askInput = document.getElementById('askInput');
const askChips = document.getElementById('askChips');
const askStatus = document.getElementById('askStatus');

function askSetStatus(mode) {
  if (!askStatus) return;
  if (mode === 'live') {
    askStatus.textContent = '⚡ Live model, grounded on my experience';
    askStatus.className = 'ask-status ask-status-live';
  } else if (mode === 'connecting') {
    askStatus.textContent = '⚡ Connecting to live model…';
    askStatus.className = 'ask-status';
  } else {
    askStatus.textContent = '📚 Offline demo — static knowledge base';
    askStatus.className = 'ask-status';
  }
}
askSetStatus(ASK_API_URL ? 'connecting' : 'static');

function askAppend(role, content) {
  const row = document.createElement('div');
  row.className = 'ask-msg ' + (role === 'user' ? 'ask-msg-user' : 'ask-msg-bot');
  const avatar = document.createElement('span');
  avatar.className = 'ask-avatar';
  avatar.textContent = role === 'user' ? 'You' : 'YS';
  const bubble = document.createElement('p');
  if (content instanceof HTMLElement) bubble.appendChild(content);
  else bubble.textContent = content;
  row.appendChild(avatar);
  row.appendChild(bubble);
  askLog.appendChild(row);
  askLog.scrollTop = askLog.scrollHeight;
  return row;
}

async function askFetchLive(question) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ASK_TIMEOUT_MS);
  try {
    const res = await fetch(ASK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.answer ? data.answer : null;
  } catch (err) {
    clearTimeout(timer);
    return null; // offline, cold start, CORS, timeout — fall back silently
  }
}

async function askAsk(question) {
  if (!question || !question.trim()) return;
  askAppend('user', question.trim());

  const typingDots = document.createElement('span');
  typingDots.className = 'ask-typing';
  typingDots.innerHTML = '<span></span><span></span><span></span>';
  const typingRow = askAppend('bot', typingDots);
  const minDelay = new Promise(r => setTimeout(r, 450 + Math.random() * 350));

  let answer = null;
  if (ASK_API_URL) {
    answer = await askFetchLive(question.trim());
  }
  await minDelay; // keep the typing indicator feeling natural even on a fast local match
  typingRow.remove();

  if (answer) {
    askSetStatus('live');
    askAppend('bot', answer);
  } else {
    if (ASK_API_URL) askSetStatus('static'); // live call failed this time — fell back
    askAppend('bot', askBestAnswer(question));
  }
}

if (askForm) {
  askForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = askInput.value;
    askInput.value = '';
    askAsk(q);
  });
}
if (askChips) {
  askChips.querySelectorAll('.ask-chip').forEach(chip => {
    chip.addEventListener('click', () => askAsk(chip.textContent));
  });
}
