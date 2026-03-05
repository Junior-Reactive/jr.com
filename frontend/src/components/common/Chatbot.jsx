import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Chatbot.css';

// ── KNOWLEDGE BASE ──────────────────────────────────────────────────────────
const KB = [
  {
    patterns: ['hello','hi','hey','good morning','good afternoon','good evening','start','help'],
    response: `Hello! 👋 I'm **JR Assistant** — Junior Reactive's AI guide.\n\nI can help you explore our services, learn about our team, or get in touch. What would you like to know?`,
    quick: ['Our Services','Meet the Team','Get a Quote','Contact Us'],
  },
  {
    patterns: ['service','what do you do','offer','provide','help with','solutions'],
    response: `We offer **9 core services** covering the full AI and IT spectrum:\n\n• 🧠 AI Consulting\n• 💻 Custom Software Development\n• ⚡ N8N Workflow Automation\n• 📊 Data Analytics & Insights\n• 🔮 Predictive Modeling\n• ☁️ Cloud Solutions\n• 🎓 AI Awareness Sessions\n• 📚 AI Courses & Training\n• 📈 Business Intelligence Dashboards`,
    quick: ['Tell me about N8N','AI Awareness Sessions','Get Started','Contact Us'],
  },
  {
    patterns: ['n8n','automation','workflow','automate','zapier','integrate'],
    response: `⚡ **N8N Workflow Automation** is one of our most popular services!\n\nN8N connects your apps and automates repetitive tasks — like syncing CRM data, sending automated reports, or processing form submissions — all running 24/7.\n\nUnlike Zapier, N8N can be **self-hosted** so your data stays in your control. We build, host, and maintain N8N workflows for clients across East Africa.`,
    quick: ['How much does it cost?','Apply for N8N','See Portfolio','Contact Us'],
  },
  {
    patterns: ['ai consulting','consult','strategy','roadmap','plan'],
    response: `🧠 **AI Consulting** is where most client journeys begin.\n\nWe audit your operations, identify your highest-value AI opportunities, and build a phased implementation roadmap — from vendor selection to change management.\n\nOur initial strategy consultation is **free**.`,
    quick: ['Book a Free Consultation','What does it cost?','Apply Now','Contact Us'],
  },
  {
    patterns: ['course','training','learn','education','workshop','awareness','session'],
    response: `🎓 We run two training programmes:\n\n**AI Awareness Sessions** — Half-day or full-day workshops for non-technical teams. No jargon, just practical understanding.\n\n**AI Courses & Training** — Structured programmes covering ML fundamentals, Prompt Engineering, Power BI, N8N, and more.\n\nAll include hands-on exercises and a certificate of completion.`,
    quick: ['Book a Session','Corporate Package','Pricing','Contact Us'],
  },
  {
    patterns: ['price','cost','how much','fee','budget','charge','rate'],
    response: `💰 We tailor pricing to each engagement because every project is different.\n\nAs a guide:\n• AI Awareness Session — from **UGX 800,000**\n• N8N Automation Build — from **UGX 2,000,000**\n• BI Dashboard — from **UGX 3,500,000**\n• Custom Software — scoped after discovery\n\nOur initial discovery call is always **free**.`,
    quick: ['Book Free Discovery Call','Apply for a Service','Contact Us'],
  },
  {
    patterns: ['team','who','staff','people','founder','pharrell'],
    response: `👥 Our team of 6 specialists covers every dimension of AI and IT:\n\n• **Pharrell Aaron Mugumya** — Founder & CEO\n• **David Ochieng** — Head of Engineering\n• **Amara Nkosi** — Lead Data Scientist\n• **Brian Ssekandi** — Cloud & DevOps\n• **Grace Auma** — AI Trainer\n• **Kevin Mutiso** — N8N Automation Specialist`,
    quick: ['Meet the Team','About Junior Reactive','Contact Us'],
  },
  {
    patterns: ['portfolio','project','case study','work','example','client','built'],
    response: `🗂️ We've delivered projects including:\n\n• Logistics dispatch automation (saves 90 mins/day)\n• Retail BI dashboard (replaced 12 spreadsheets)\n• Churn prediction model (23% churn reduction)\n• Agricultural market price platform\n• HR onboarding automation\n• Corporate AI Awareness Programme\n\nAll rated 5/5 by clients.`,
    quick: ['View Full Portfolio','Apply for a Project','Contact Us'],
  },
  {
    patterns: ['contact','reach','email','phone','call','whatsapp','message'],
    response: `📬 You can reach us through several channels:\n\n• **Email:** juniorreactive@gmail.com\n• **Phone/WhatsApp:** +256 764 524 816\n• **Location:** Kampala, Uganda\n• **Contact Form:** Use the form on our Contact page\n\nWe typically respond within **24 hours**.`,
    quick: ['Go to Contact Page','Apply for Services','WhatsApp Us'],
  },
  {
    patterns: ['apply','start','get started','begin','project','quote','hire','engage'],
    response: `🚀 Ready to get started? Here's how:\n\n1. Fill out our **Service Application** form\n2. We review within **24 hours**\n3. We schedule a **free discovery call**\n4. We send a detailed proposal\n5. We get to work!\n\nNo commitment until you're happy with the proposal.`,
    quick: ['Apply Now','Contact Us First','View Services'],
  },
  {
    patterns: ['uganda','kampala','africa','east africa','location','where'],
    response: `📍 We're proudly headquartered in **Kampala, Uganda**.\n\nWe serve clients across East Africa — Uganda, Kenya, Tanzania, Rwanda, South Africa — and deliver all services **fully remotely** when needed.\n\nWe understand the East African business environment deeply, which means solutions that actually work in our context.`,
    quick: ['Contact Us','Apply for Services','Our Services'],
  },
  {
    patterns: ['data','analytics','dashboard','bi','power bi','insight','report'],
    response: `📊 Our **Data Analytics & BI** services include:\n\n• Power BI dashboard design & build\n• Data pipeline architecture\n• Sales & operations reporting\n• Predictive analytics & ML models\n• Executive dashboard suites\n\nWe replace messy spreadsheets with live, interactive dashboards your whole team can use.`,
    quick: ['Apply for Analytics','View Portfolio','Pricing','Contact Us'],
  },
  {
    patterns: ['cloud','aws','azure','google cloud','server','hosting','infrastructure','migrate'],
    response: `☁️ Our **Cloud Solutions** team handles:\n\n• Cloud readiness assessments\n• AWS, Azure & Google Cloud migrations\n• Docker & Kubernetes containerisation\n• Serverless architecture\n• Ongoing cost optimisation\n\nWe start every migration with a detailed discovery phase before touching any production systems.`,
    quick: ['Discuss Cloud Migration','Apply Now','Contact Us'],
  },
  {
    patterns: ['thank','thanks','great','awesome','perfect','good','nice'],
    response: `You're very welcome! 😊 Is there anything else I can help you with?\n\nDon't hesitate to reach out to the team directly at **juniorreactive@gmail.com** or via WhatsApp at **+256 764 524 816**.`,
    quick: ['Apply for Services','View Services','Contact Us'],
  },
  {
    patterns: ['bye','goodbye','see you','later','done','exit','close'],
    response: `Thanks for chatting with us! 👋\n\nWhenever you're ready to take the next step, we're here. Have a great day!`,
    quick: ['Apply for Services','Contact Us'],
  },
];

const FALLBACK = {
  response: `I'm not quite sure about that, but our team definitely can help! 🤔\n\nYou can:\n• Use the **Contact page** to send a detailed message\n• **WhatsApp us** at +256 764 524 816\n• Or **apply directly** for the service you need`,
  quick: ['Contact Us','Apply for Services','View All Services'],
};

function matchResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.patterns.some(p => lower.includes(p))) return entry;
  }
  return FALLBACK;
}

// Quick reply routing
const QUICK_ROUTES = {
  'Our Services':          '/services',
  'View Services':         '/services',
  'View All Services':     '/services',
  'Meet the Team':         '/team',
  'View Full Portfolio':   '/portfolio',
  'Apply Now':             '/apply',
  'Apply for Services':    '/apply',
  'Apply for a Service':   '/apply',
  'Apply for Analytics':   '/apply',
  'Apply for N8N':         '/apply?service=N8N+Workflow+Automation',
  'Apply for a Project':   '/apply',
  'Apply for Cloud':       '/apply?service=Cloud+Solutions',
  'Contact Us':            '/contact',
  'Go to Contact Page':    '/contact',
  'Contact Us First':      '/contact',
  'Book a Session':        '/apply?service=AI+Awareness+Sessions',
  'Book Free Discovery Call': '/apply',
  'Book a Free Consultation': '/apply',
  'Corporate Package':     '/apply?service=AI+Courses+%26+Training',
  'About Junior Reactive': '/about',
  'See Portfolio':         '/portfolio',
};

// Format **bold** in response text
function formatMessage(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

function renderLines(text) {
  return text.split('\n').map((line, i) => (
    <span key={i}>{formatMessage(line)}{i < text.split('\n').length - 1 && <br />}</span>
  ));
}

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot',
      text: `Hi there! 👋 I'm **JR Assistant**.\n\nHow can I help you today?`,
      quick: ['Our Services', 'Get a Quote', 'Contact Us'],
    },
  ]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const [unread, setUnread]     = useState(0);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  const addBotMessage = useCallback((text, quick) => {
    setTyping(true);
    const delay = 600 + Math.min(text.length * 8, 1200);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(), from: 'bot', text, quick,
      }]);
      if (!open) setUnread(n => n + 1);
    }, delay);
  }, [open]);

  const handleSend = useCallback((text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: trimmed }]);
    const match = matchResponse(trimmed);
    addBotMessage(match.response, match.quick);
  }, [input, addBotMessage]);



  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* ── BUBBLE ─────────────────────────────────────────── */}
      <button
        className={`chatbot-bubble ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
      >
        <span className="bubble-icon">
          {open
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          }
        </span>
        {!open && unread > 0 && (
          <span className="bubble-badge">{unread}</span>
        )}
        {!open && (
          <span className="bubble-label">Chat with us</span>
        )}
      </button>

      {/* ── WINDOW ─────────────────────────────────────────── */}
      <div className={`chatbot-window ${open ? 'open' : ''}`} role="dialog" aria-label="Junior Reactive chat">

        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-avatar">
            <span>JR</span>
            <span className="online-dot" />
          </div>
          <div className="chatbot-header-info">
            <h4>JR Assistant</h4>
            <p>Junior Reactive · Usually replies instantly</p>
          </div>
          <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`msg msg-${msg.from}`}>
              {msg.from === 'bot' && (
                <div className="msg-avatar">JR</div>
              )}
              <div className="msg-content">
                <div className="msg-bubble">{renderLines(msg.text)}</div>
                {msg.quick && msg.from === 'bot' && (
                  <div className="msg-quick">
                    {msg.quick.map(q => (
                      QUICK_ROUTES[q]
                        ? <Link key={q} to={QUICK_ROUTES[q]} className="quick-btn" onClick={() => setOpen(false)}>{q}</Link>
                        : <button key={q} className="quick-btn" onClick={() => handleSend(q)}>{q}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="msg msg-bot">
              <div className="msg-avatar">JR</div>
              <div className="msg-content">
                <div className="msg-bubble typing-bubble">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Type your message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            maxLength={300}
          />
          <button
            className="chatbot-send"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>

        <p className="chatbot-footer-note">
          Powered by Junior Reactive · <a href="/privacy">Privacy</a>
        </p>
      </div>
    </>
  );
}
