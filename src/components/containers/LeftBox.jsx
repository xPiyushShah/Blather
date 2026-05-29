import React from 'react'
import { useChatStore } from '../../store/useChatStore.js';
import ChatOpen from '../Loaders/ChatOpen.jsx';
import MessagesBox from '../Messages/MessagesBox.jsx';
function LeftBox() {
  const { selectedUser } = useChatStore();
  return (
    <div className="flex flex-col w-full h-full justify-between items-center">
      {selectedUser == null && <ChatOpen />}
      {selectedUser !== null && <MessagesBox />}
    </div>
  )
}

export default LeftBox
