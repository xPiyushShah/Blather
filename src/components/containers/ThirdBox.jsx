import React from 'react'
import { useFunction } from '../../store/useFunction';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart, faStar, faRightFromBracket, faWifi,faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from '../../store/authStore';
function ThirdBox() {
  //   const { func, setFunction } = useFunction();
  const { logOut } = useAuthStore();

  return (
    <div className='w-full h-full bg-transparent flex items-center justify-center select-none'>
      <div className="flex flex-col gap-6  text-center items-bottom justify-end w-full h-full align-bottom pb-10 p-2 *:cursor-pointer *:opacity-65 *:hover:opacity-80" style={{ padding: "10px" }}>
        <div className='bg-transparent font-12 '> <FontAwesomeIcon icon={faUser} /></div>
        <div className='bg-transparent font-12 '> <FontAwesomeIcon icon={faBell} /></div>
        <div className='bg-transparent font-12 '> <FontAwesomeIcon icon={faStar} /></div>
        <div className='bg-transparent font-12 '> <FontAwesomeIcon icon={faWifi} /></div>
        <div className='bg-transparent font-12 ' onClick={()=> logOut()}> <FontAwesomeIcon icon={faRightFromBracket} /></div>
      </div>
    </div>
  )
}

export default ThirdBox
