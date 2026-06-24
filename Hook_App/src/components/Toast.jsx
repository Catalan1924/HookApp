import React, { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const bgColor = type === 'success' ? 'bg-green-500' 
    : type === 'error' ? 'bg-red-500' 
    : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-lg`}>
        {message}
      </div>
    </div>
  );
}
