import React, { useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUserPlus } from "@fortawesome/free-solid-svg-icons";

import { useAuthStore } from '../../store/authStore.js';
import { useFunction } from '../../store/useFunction.js';
import { useChatStore } from '../../store/useChatStore.js';

const Lister = React.lazy(() => import('../SidrBar/Lister.jsx'));
const SideBarHeader = React.lazy(() => import('../SidrBar/SideBarHeader.jsx'));
const MessageLoading = React.lazy(() => import('../Loaders/MessageLoading.jsx'));

function SideBox() {
  const { authUser } = useAuthStore();
  const { isSearchBox, setSearchBox, onGlobalSearch, isSeachingVal, searchTerm,SearchVal } = useFunction();
  const { friendList, isUserLoading, getUsers } = useChatStore();

  React.useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>

      <SideBarHeader />

      <div className='relative w-full flex-1 min-h-0 overflow-hidden'>

        {isSearchBox && (
          <>
            <div className='absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[80%] h-12 backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl flex items-center px-4 shadow-lg' style={{
              animation: 'fadeInScale 0.3s ease-out', padding: "2px 12px"
            }}>
              <input
                type="text"
                placeholder='Search...'
                className='bg-transparent w-full h-full outline-none text-white placeholder:text-gray-400'
                value={searchTerm}
                onChange={(e) => onGlobalSearch(e.target.value)}
              />

              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className='text-gray-300 ml-3'
              />
            </div>


            <div className='absolute top-20 left-1/2 -translate-x-1/2 z-40 w-full max-h-[60vh] overflow-y-auto border-t-[#dddddd35] flex items-center flex-row' style={{ padding: "12px" }}>
              {/* text appear of searching */}
              <div className='w-full h-full flex items-center justify-between flex-row'>
                <span className='text-white '>{searchTerm}</span>
                <span className='text-gray-400 ml-2'>
                  {isSeachingVal && (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-transparent border-[1px] border-[#2e2e2e] shadow-lg">
                      <div className="w-4 h-4 border-[2px] border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {!isSeachingVal && searchTerm == "" && "ESC to close"}
                </span>
              </div>

              {/* listting all data */}
              {/* {SearchVal.length > 0 &&(
                        <div
          className={`
        h-full w-full flex flex-col overflow-y-auto scrollbar-hide custom-scroll scroll-smooth transition-all duration-300
        ${isSearchBox ? 'blur-sm scale-[0.98] opacity-60 pointer-events-none' : ''}
      `}
        >
                <Lister friendList={SearchVal} isUserLoading={false} /></div>)  } */}

            </div>
          </>
        )}

        <div
          className={`
        h-full w-full flex flex-col overflow-y-auto scrollbar-hide custom-scroll scroll-smooth transition-all duration-300
        ${isSearchBox ? 'blur-sm scale-[0.98] opacity-60 pointer-events-none' : ''}
      `}
        >
          <Lister friendList={friendList} isUserLoading={isUserLoading} />
        </div>

      </div>
    </div>
  )
}

export default SideBox
