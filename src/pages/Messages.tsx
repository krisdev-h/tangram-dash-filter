import { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  client: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
}

export default function Messages() {
  const [selectedClient, setSelectedClient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [receivedMessages] = useState<Message[]>([
    {
      id: '1',
      client: 'TechCorp Industries',
      content: 'Can you provide an update on the manufacturing timeline for our recent submission?',
      timestamp: new Date('2025-11-17T14:30:00').toISOString(),
      type: 'received'
    },
    {
      id: '2',
      client: 'Client A',
      content: 'We need to adjust the dimensions for order #12345. When can we discuss this?',
      timestamp: new Date('2025-11-16T10:15:00').toISOString(),
      type: 'received'
    },
    {
      id: '3',
      client: 'Client B',
      content: 'Thank you for the quote. We would like to proceed with the order.',
      timestamp: new Date('2025-11-15T16:45:00').toISOString(),
      type: 'received'
    }
  ]);

  const clients = [
    'TechCorp Industries',
    'Client A',
    'Client B',
    'Client C'
  ];

  useEffect(() => {
    // Load sent messages from localStorage
    const saved = localStorage.getItem('sentMessages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  const handleSendMessage = () => {
    if (!selectedClient || !messageText.trim()) {
      alert('Please select a client and enter a message');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      client: selectedClient,
      content: messageText,
      timestamp: new Date().toISOString(),
      type: 'sent'
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('sentMessages', JSON.stringify(updatedMessages));

    // Clear form
    setMessageText('');
    setAiPrompt('');
  };

  const handleAIAssist = async () => {
    if (!aiPrompt.trim()) return;

    // Simulate AI response (you can integrate with actual AI API)
    const aiResponse = `Dear ${selectedClient || 'Client'},\n\nThank you for your inquiry. ${aiPrompt}\n\nWe appreciate your business and look forward to working with you.\n\nBest regards,\nTangram Team`;
    
    setMessageText(aiResponse);
    setAiPrompt('');
  };

  const handleRespond = (client: string, originalMessage: string) => {
    setSelectedClient(client);
    setMessageText(`Re: ${originalMessage.substring(0, 50)}...\n\n`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🔧 Tangram Internal Dashboard</h1>
          <p className="text-purple-100">Manage client communications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Column */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Send</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select client / case
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type message to client..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!selectedClient || !messageText.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                Send
              </button>

              {/* AI Assistant */}
              <div className="border-t pt-4 mt-6">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src="/lovable-uploads/fb5f73a8-e732-4453-85a2-7ae0117b99e5.png" 
                    alt="Tangram" 
                    className="w-10 h-10 rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Tangram Assistant</h3>
                    <p className="text-sm text-gray-600">Use AI to help draft messages, then edit and send.</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAIAssist()}
                    placeholder="Ask how report was in a kind way"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAIAssist}
                    disabled={!aiPrompt.trim()}
                    className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sent Column */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Sent</h2>
            
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages sent yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{msg.client}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                    <button
                      onClick={() => handleRespond(msg.client, msg.content)}
                      className="mt-3 w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition-colors"
                    >
                      Follow Up
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Received Column */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Received</h2>
            
            {receivedMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages received yet.</p>
            ) : (
              <div className="space-y-4">
                {receivedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{msg.client}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{msg.content}</p>
                    <button
                      onClick={() => handleRespond(msg.client, msg.content)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <MessageCircle size={16} />
                      Respond
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
