import React from 'react'

function Loader2() {
    return (
        <div className="flex items-center justify-center h-[100vh] align-center">
            <div className="relative w-24 h-24 items-center justify-center flex">
                <span className="loading loading-spinner loading-xl"></span>
                {/* {[...Array(9)].map((_, i) => (
                    <span
                        key={i}
                        className={`dot absolute transform origin-center text-green`}
                        style={{
                            transform: `rotate(${i * 40}deg) translate(40px) rotate(-${i * 40}deg)`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))} */}
            </div>
        </div>
    )
}

export default Loader2