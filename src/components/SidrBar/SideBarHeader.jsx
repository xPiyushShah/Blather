import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { formatName } from "../../utils/helper.js"
import { useAuthStore } from '../../store/authStore.js';
import { useFunction } from '../../store/useFunction.js';
const ProfileAvatar = React.lazy(() => import('../Avatar/ProfileAvatar.jsx'));
const Lister = React.lazy(() => import('../SidrBar/Lister.jsx'));

function SideBarHeader() {
    const { authUser } = useAuthStore();
    const { setSearchBox } = useFunction();
    return (
        <div className='text-start mb-4 border-b-[1px] border-b-[#dddddd35] w-full h-[10%] flex items-center justify-between p-12 ' style={{ padding: "12px" }}>
            <div className="flex w-full h-8 text-center items-center justify-start gap-4">
                <div className="flex w-8 h-8 cursor-pointer ">
                    <ProfileAvatar />
                </div>
                <div className="w-32 h-[1px] lg:w-[1px] lg:h-6 bg-gray-400/50"></div>
                <div className='opacity-75' >{formatName(authUser)}</div>
            </div>
            <div className="flex flex-row item-center justify-center gap-8 ">
                <button className='hover:opacity-80 transition-all  ease-in-out cursor-pointer opacity-75'><FontAwesomeIcon icon={faUserPlus} /></button>
                <button className='hover:opacity-80 transition-all  ease-in-out cursor-pointer opacity-75' onClick={() => setSearchBox()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
            </div>
        </div>
    )
}

export default SideBarHeader