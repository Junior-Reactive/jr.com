import React, { useState } from 'react';
import './Chatbot.css';

// Simple rule‑based knowledge base
const knowledgeBase = [
  {
    keywords: ['service', 'offer', 'do'],
    answer: 'We offer AI consulting, custom software development, data analytics, cloud solutions, predictive modeling, and AI awareness sessions.'
  },
  {
    keywords: ['ai consulting', 'consulting'],
    answer: 'Our AI consulting service helps businesses identify opportunities for AI adoption and creates a tailored roadmap.'
  },
  {
    keywords: ['custom software', 'development'],
    answer: 'We build robust, scalable software tailored to your unique business requirements.'
  },
  {
    keywords: ['data analytics', 'insights'],
    answer: 'We transform raw data into actionable business intelligence to drive decision‑making.'
  },
  {
    keywords: ['cloud', 'aws', 'azure'],
    answer: 'We provide secure and scalable cloud solutions on AWS, Azure, and Google Cloud.'
  },
  {
    keywords: ['predictive', 'model'],
    answer: 'We create custom predictive models for sales forecasting, churn prediction, and operational optimization.'
  },
  {
    keywords: ['awareness', 'workshop', 'session'],
    answer: 'Our AI awareness sessions demystify AI for non‑technical teams and empower them to identify opportunities.'
  },
  {
    keywords: ['price', 'cost', 'budget'],
    answer: 'Costs vary by project scope. Contact us for a tailored quote.'
  },
  {
    keywords: ['contact', 'reach', 'email', 'phone'],
    answer: 'You can reach us at juniorreactive@gmail.com or +256 764524816.'
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    answer: 'Hello! How can I assist you today?'
  }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I’m your virtual assistant. Ask me about our services!' }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');

    // Find best match
    const lower = userMsg.toLowerCase();
    let matched = knowledgeBase.find(entry =>
      entry.keywords.some(keyword => lower.includes(keyword))
    );
    let reply = matched
      ? matched.answer
      : "I'm sorry, I don't have an answer for that. Please contact us directly at juniorreactive@gmail.com.";

    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Junior Reactive Assistant</span>
            <button onClick={toggleChat}>✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;