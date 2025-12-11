'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProfileStore } from '@/store/useProfileStore';
import LoadingPage from '@/components/LoadingPage';
import ProfilePage from '@/components/profile_components/ProfilePage';

function Profile() {
  const params = useParams();
  const id = params.id as string;
  
  const userProfile = useProfileStore((state) => state.userProfile);
  const gettingUserProfile = useProfileStore((state) => state.gettingUserProfile);
  const getUserProfile = useProfileStore((state) => state.getUserProfile);

  useEffect(() => {
    if (id) {
      getUserProfile(id);
    }
  }, [id]);

  if (gettingUserProfile) {
    return (
      <LoadingPage />
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <ProfilePage userProfile={userProfile} />
    </div>
  );
}

export default Profile;
