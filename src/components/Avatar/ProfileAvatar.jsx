import React, { Suspense } from "react";
import { useAuthStore } from "../../store/authStore.js";

const LazyImage = ({ src, alt }) => (
  <img src={src} alt={alt} className="w-16 h-16 rounded-md overflow-auto object-cover shadow-md opacity-70 hover:opacity-80 transition-all  ease-in-out "  />
);

const ProfileAvatar = ({ user }) => {
  const { authUser } = useAuthStore();

  const imageUrl = user?.profile_url ||  "https://res.cloudinary.com/dufcac38i/image/upload/v1750871808/user-3d-icon_642950-57_y7w2bq.jpg";

  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-transparent p-3 gap-2">
      <Suspense
        fallback={
          <div className="w-16 h-16 rounded-md bg-gray-400 animate-pulse" />
        }
      >
        <LazyImage src={imageUrl} alt="avatar" />
      </Suspense>
    </div>
  );
};

export default ProfileAvatar;