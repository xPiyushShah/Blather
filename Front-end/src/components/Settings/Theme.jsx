import React from 'react';
import { useThemeStore } from "../../store/useThemeStore";
const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey!", isSent: false },
  { id: 2, content: "Who?", isSent: true },
];


function Theme() {
  const { theme, setTheme } = useThemeStore();
  return (
    <>
      <div className="theme-shop w-full h-fit text-white flex gap-6 flex-col" >
        <div className="flex border-b-[1px] border-b-[#dddddd35] flex-col gap-4 p-4" style={{ padding: "12px" }}>
          <div className="text-lg font-semibold opacity-25 text-start">Tools</div>
          <div className="tool-start w-full h-full m-16 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-6">
              Under work....
              {/* <button className="text-sm">Reset Theme</button>
              <button className="text-sm">Save Theme</button>
              <button className="text-sm">Load Theme</button>
              <button className="text-sm">Delete Theme</button> */}
            </div>
          </div>
        </div>
        {/* Combo Theme Start */}
        <div className="flex flex-col gap-4  text-right justify-around relative">
          <span className="text-xl  text-shadow-base-200 text-base-content">Theme</span>
        </div>
        <div className='comboOne flex flex-col gap-8  text-center justify-center items-center  max-h-5xl overflow-ellipsis'>
          <div className='flex self-start text-md text-bold capitilize text-amber-300 gap-2 flex-col hover:scale-100 scale-98 transition-transform duration-150 hover:cursor-pointer'>
            <label htmlFor="name" className='flex self-start'>Combo's From Blather </label>
            <span className='w-60 h-1 bg-amber-700 rounded-r-sm '></span>
          </div>
          <div className='grid grid-cols-5 gap-8 mb-16'>
            {[...Array(10)].map((_, index) => (
              <div className='skeleton w-60 h-40 flex rounded-sm shadow-lg'></div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Theme