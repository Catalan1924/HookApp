import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { userId, phoneNumber, isPaid, isPrivate, chats, messageRequests }

  // Initialize with default values if user is set
  const updateUser = (newUser) => {
    setUser({
      ...newUser,
      isPrivate: newUser.isPrivate !== undefined ? newUser.isPrivate : false, // default to public
      chats: newUser.chats || [], // array of chat objects: { id, withUserId, messages: [] }
      messageRequests: newUser.messageRequests || [] // array of request objects: { id, fromUserId, message, status: 'pending' }
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
