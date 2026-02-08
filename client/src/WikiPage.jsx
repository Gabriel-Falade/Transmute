import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './WikiPage.css';

const WikiPage = () => {
  const [wikiContent, setWikiContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load wiki content on mount
  useEffect(() => {
    generateWiki();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateWiki = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/wiki/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error('Wiki generation error:', data.error);
        setWikiContent(`# Error\n\n${data.error}\n\n**Troubleshooting:**\n- Make sure you have uploaded documents\n- Check that Gemini API key is configured in backend/.env\n- Ensure documents.json and graph.json exist in the backend folder`);
      } else if (data.content) {
        setWikiContent(data.content);
      } else {
        setWikiContent('# No Content\n\nWiki content is empty. Please upload documents first via the Upload page.');
      }
    } catch (error) {
      console.error('Error generating wiki:', error);
      setWikiContent(`# Error\n\nCould not load wiki content: ${error.message}\n\n**Please ensure:**\n- Documents have been uploaded via the Upload page\n- Backend server is running on http://localhost:5000\n- Gemini API key is configured in backend/.env\n- documents.json and graph.json files exist`);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setChatLoading(true);

    try {
      // Build chat history
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('http://localhost:5000/api/wiki/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inputValue,
          chat_history: chatHistory
        })
      });

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="wiki-container">
      {/* Wiki Content */}
      <div className="wiki-content">
        {/* Refresh Button */}
        {!loading && (
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button
              onClick={generateWiki}
              style={{
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              🔄 Regenerate Wiki
            </button>
          </div>
        )}

        {loading ? (
          <div className="wiki-loading">
            <div className="spinner"></div>
            <p>Generating wiki...</p>
          </div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{wikiContent}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Chat Widget */}
      <div className={`chat-widget ${chatOpen ? 'open' : ''}`}>
        {/* Chat Toggle Button */}
        {!chatOpen && (
          <button
            className="chat-toggle"
            onClick={() => setChatOpen(true)}
          >
            💬 Ask about documents
          </button>
        )}

        {/* Chat Panel */}
        {chatOpen && (
          <div className="chat-panel">
            {/* Header */}
            <div className="chat-header">
              <h3>Document Assistant</h3>
              <button
                className="chat-close"
                onClick={() => setChatOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <p>👋 Ask me anything about the documents!</p>
                  <div className="suggested-questions">
                    <button onClick={() => setInputValue('What database was chosen?')}>
                      What database was chosen?
                    </button>
                    <button onClick={() => setInputValue('What contradictions exist?')}>
                      What contradictions exist?
                    </button>
                    <button onClick={() => setInputValue('Tell me about the budget')}>
                      Tell me about the budget
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-content">
                      {msg.content}
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="message-sources">
                        <small>
                          Sources: {msg.sources.map(s => s.title).join(', ')}
                        </small>
                      </div>
                    )}
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="message assistant">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={chatLoading}
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !inputValue.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WikiPage;
