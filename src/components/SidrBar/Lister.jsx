import React, { Suspense } from 'react';
import ProfileAvatar from '../Avatar/ProfileAvatar';
import { formatName } from "../../utils/helper.js";
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/useChatStore.js';

const ListSkeleton = React.lazy(() => import('../Loaders/ListSkelecton.jsx'));

function Lister({friendList, isUserLoading}) {
  // here i will pass pro due to this compo wil be used in other for two arrys am using it as props
  const { authUser, onlineSocktUser } = useAuthStore();
  const { selectedUser, setSelectedUser, getUsers } = useChatStore();


  return (
    <>
      {isUserLoading && <ListSkeleton />}

      <Suspense fallback={<ListSkeleton />}>
        {!isUserLoading && friendList.map((item, index) => (
          <div
            key={item._id}
            className={`${onlineSocktUser.includes(item._id) ? "avatar-online" : "avatar-offline"} ${selectedUser && selectedUser._id === item._id ? 'bg-[#2d452d]' : 'bg-transparent'} text-white  w-full h-[182px] border-b-[1px] border-b-[#dddddd35] flex items-center justify-between `}
            style={{ padding: "12px" }}
            onClick={() => setSelectedUser(item)}
          >

            <div className="ml-2 avatar w-8 h-8 flex0 items-center justify-center relative">
              <ProfileAvatar user={item} />
               <div
                className={`
                  absolute -bottom-1 -right-1
                  w-2 h-2
                  rounded-full
                  border-2 border-[#1a1a1a]
                  shadow-md
                  ${onlineSocktUser.includes(item._id)
                    ? 'bg-green-500 shadow-green-500/70'
                    : 'bg-gray-400 shadow-gray-500/40'
                  }
                `}
              />
            </div>

            <span className="ml-2">{formatName(item)}</span>
          </div>
        ))}
        {friendList.length === 0 && (<ListSkeleton />)}
      </Suspense>
    </>
  );
}

export default Lister;