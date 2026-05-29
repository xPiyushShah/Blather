import React from 'react'

function EngineLoading({ callType }) {
    return (
        <div className='absolute inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center'>
            <div className='px-8 py-4 bg-transparent text-white text-xl font-semibold shadow-2xl'>
                Starting local engines for {callType ? "video" : "audio"} call connection, please wait...
            </div>
        </div>
    )
}

export default EngineLoading