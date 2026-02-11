import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';

const Chat = ({ onBack }) => {
  const { user, setUser } = useContext(UserContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  if (!user) return null;

  const chats = user.chats || [];
  const requests = user.messageRequests || [];

  const handleSendMessage = () => {
    if (!selectedChat || !message.trim()) return;

    const updatedChats = chats.map(chat =>
      chat.id === selectedChat.id
        ? { ...chat, messages: [...chat.messages, { text: message, from: user.userId, timestamp: new Date() }] }
        : chat
    );
    setUser({ ...user, chats: updatedChats });
    setMessage('');
  };

  const handleAcceptRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Create a new chat
    const newChat = {
      id: `chat_${user.userId}_${request.fromUserId}`,
      withUserId: request.fromUserId,
      messages: [{ text: request.message, from: request.fromUserId, timestamp: new Date() }]
    };

    // Remove request and add chat
    const updatedRequests = requests.filter(r => r.id !== requestId);
    const updatedChats = [...chats, newChat];

    setUser({ ...user, chats: updatedChats, messageRequests: updatedRequests });
  };

  const handleRejectRequest = (requestId) => {
    const updatedRequests = requests.filter(r => r.id !== requestId);
    setUser({ ...user, messageRequests: updatedRequests });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1A1A2E] to-[#16213E]">
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <div className="flex items-center">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mr-4">←</button>
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="text-sm text-gray-600">Signed in as <span className="font-medium">{user.name || user.userId}</span></div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Chats</h3>
          </div>
          <div>
            {chats.length === 0 && <div className="p-4 text-sm text-gray-400">No chats yet</div>}
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 ${selectedChat?.id === chat.id ? 'bg-gray-800' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">{String(chat.withUserId).slice(0,2).toUpperCase()}</div>
                <div className="flex-1">
                  <div className="font-medium text-white">User {chat.withUserId}</div>
                  <div className="text-sm text-gray-400 truncate">{chat.messages?.length ? chat.messages[chat.messages.length-1].text : 'No messages yet'}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white">Message Requests</h3>
            {requests.length === 0 && <div className="mt-2 text-sm text-gray-400">No requests</div>}
            {requests.map(request => (
              <div key={request.id} className="mt-3 p-3 rounded border border-gray-700 bg-gray-800">
                <div className="text-sm font-medium text-white">From: {request.fromUserId}</div>
                <div className="text-sm text-gray-300 mt-1">{request.message}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleAcceptRequest(request.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Accept</button>
                  <button onClick={() => handleRejectRequest(request.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-gray-950">
          {selectedChat ? (
            <>
              <div id="messages" className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950">
                {selectedChat.messages.map((msg, index) => {
                  const mine = msg.from === user.userId;
                  return (
                    <div key={index} className={`mb-4 flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${mine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}>
                        <div className="text-sm">{msg.text}</div>
                        <div className="text-xs text-gray-300 mt-1 text-right">{new Date(msg.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-700 bg-gray-900">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">Send</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">Select a chat to start messaging</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;
