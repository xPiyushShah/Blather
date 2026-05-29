import React from 'react'
import MessagesHeder from "./MessagesHeder.jsx"
import InputArear from "./InputArear.jsx"
import Messanger from "./Messanger.jsx"
function MessagesBox() {
  return (
    <>
      <div className="flex flex-col h-screen w-full">
        <div className="h-[9.9%] min-h-[9.9%] max-h-[9.9%] w-full bg-transparent border-b border-b-[#dddddd35] flex items-center px-4">
          <MessagesHeder />
        </div>

        <div className="flex-1 min-h-[80%] max-h-[81%] w-full overflow-y-auto bg-transparent px-4 py-3">
          <Messanger />
        </div>

        <div className="h-[10%] min-h-[10%] max-h-[10%] w-full bg-transparent border-t border-t-[#dddddd35] flex items-center px-4">
          <InputArear />
        </div>
      </div>
    </>
  )
}

export default MessagesBox
