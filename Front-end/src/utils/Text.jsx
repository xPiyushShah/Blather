import React, { useState } from 'react';

function Text({ msg }) {
    const [expanded, setExpanded] = useState(false);

    const charLimit = 50;

    const isLong = msg.length > charLimit;

    const displayText = expanded || !isLong
        ? msg
        : msg.slice(0, charLimit) + '...';

    return (
        <>
            {msg && <p className={`w`}>{displayText}</p>}
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-blue-400 underline self-end flex  align-end cursor-pointer absolute top-6 right-2"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </>
    );
}

export default Text;
