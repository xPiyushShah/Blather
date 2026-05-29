import React from 'react'

function Loader() {
  return (
    // <div className="flex items-center justify-center h-screen w-screen bg-[rgba(0,0,0,0)]">
    //   <div className="flex space-x-12 gap-4">
    //     <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
    //     <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
    //     <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    //   </div>
    // </div>

    <div className="flex items-center justify-center h-screen w-screen bg-[rgba(0,0,0,0.6)]">
      <div className="w-full h-full flex items-center justify-center py-10">
        <div className="flex items-center justify-center w-14 h-14  bg-transparent shadow-lg">
          <div className="w-6 h-6 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>

  )
}

export default Loader