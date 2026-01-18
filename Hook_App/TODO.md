# TODO: Add Messaging Feature with Privacy Settings

## Steps to Complete:
- [x] Update UserContext to include privacy setting (private/public) and message-related state (chats, requests)
- [x] Add Chat button to NavBar component
- [x] Create Chat.jsx component for messaging interface (list of chats, send/receive messages)
- [x] Create MessageRequest.jsx component for handling message requests (accept/reject) - Integrated into Chat.jsx
- [x] Update ProfileCard.jsx to include a "Message" button that initiates chat or request based on privacy
- [x] Modify App.jsx to handle navigation between swiping, chat, and other views
- [x] Implement logic in Chat component for sending messages: if private and no prior chat, send to requests; if public or prior chat, direct message
- [ ] Add privacy toggle in user profile settings (assume a Profile component exists or create one)
- [ ] Test the feature: simulate private/public users, sending messages, accepting requests

## Dependent Files:
- UserContext.jsx
- NavBar.jsx
- ProfileCard.jsx
- App.jsx
- New: Chat.jsx

## Followup Steps:
- [ ] Run the app to test messaging functionality
- [ ] Ensure UI is responsive and integrates well with existing design
- [ ] Add any necessary backend integration (currently assuming frontend-only with mock data)
