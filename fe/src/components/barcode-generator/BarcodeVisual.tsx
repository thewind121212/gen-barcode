import React from 'react';

interface BarcodeVisualProps {
    code: string;
}

export const BarcodeVisual: React.FC<BarcodeVisualProps> = ({ code }) => (
    <div className="flex flex-col items-center bg-white p-4 rounded border border-gray-200 shadow-sm w-full max-w-xs mx-auto">
        <div className="h-16 w-full flex items-end justify-center space-x-[2px] overflow-hidden px-2">
            {code.split('').map((num, i) => (
                <React.Fragment key={i}>
                    <div className={`bg-black ${i === 0 || i === 6 || i === 12 ? 'h-16 w-[2px]' : 'h-14 w-[3px]'}`}></div>
                    <div className={`bg-black ${parseInt(num) % 2 === 0 ? 'w-[1px]' : 'w-[4px]'} h-14`}></div>
                </React.Fragment>
            ))}
        </div>
        <div className="text-2xl font-mono font-bold tracking-[0.3em] mt-1">{code}</div>
    </div>
);
