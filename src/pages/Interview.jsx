import { useState } from 'react';
import axios from 'axios';

function Interview() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setChat(prev => [...prev, userMessage]);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/interview', {
        message: input,
      });

      const botMessage = { sender: "bot", text: res.data.reply };
      setChat(prev => [...prev, botMessage]);
    } catch (err) {
      setChat(prev => [...prev, { sender: "bot", text: "Something went wrong!" }]);
    }

    setInput('');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Interview</h1>

      <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 border px-4 py-2 rounded-xl"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
}

export default Interview;

