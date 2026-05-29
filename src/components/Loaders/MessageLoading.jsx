import React from 'react'

function MessageLoading() {
    return (
        <div className="w-full h-full flex items-center justify-center py-10">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1f1f1f] border border-[#2e2e2e] shadow-lg">
                <div className="w-6 h-6 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}

export default MessageLoading