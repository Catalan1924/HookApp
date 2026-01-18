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
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4 shadow">
        <button onClick={onBack} className="text-blue-500">Back</button>
        <h2 className="text-xl font-bold ml-4">Messages</h2>
      </div>
      <div className="flex flex-1">
        <div className="w-1/3 bg-white border-r">
          <h3 className="p-4 font-bold">Chats</h3>
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer ${selectedChat?.id === chat.id ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              Chat with {chat.withUserId}
            </div>
          ))}
          <h3 className="p-4 font-bold">Message Requests</h3>
          {requests.map(request => (
            <div key={request.id} className="p-4 border-t">
              Request from {request.fromUserId}: {request.message}
              <div className="mt-2">
                <button onClick={() => handleAcceptRequest(request.id)} className="bg-green-500 text-white px-2 py-1 mr-2">Accept</button>
                <button onClick={() => handleRejectRequest(request.id)} className="bg-red-500 text-white px-2 py-1">Reject</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedChat.messages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.from === user.userId ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded ${msg.from === user.userId ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                      {msg.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full p-2 border rounded"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Send</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
