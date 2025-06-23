import React, { useState } from 'react';

function Text({ msg }) {
    const [expanded, setExpanded] = useState(false);
    const charLimit = 50;

    const isLong = msg.length > charLimit;
    const visibleText = msg.slice(0, charLimit);
    const hiddenText = msg.slice(charLimit);

    return (
        <div className="relative w-full">
            <p className="text-sm leading-6 whitespace-pre-wrap">
                {visibleText}
                {!expanded && isLong && '...'}
                {expanded && (
                    <span className="block transition-all duration-300 ease-in-out">
                        {hiddenText}
                    </span>
                )}
            </p>

            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-blue-500 underline mt-1"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
}

export default Text;
