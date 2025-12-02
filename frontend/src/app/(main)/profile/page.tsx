'use client';

import React, { useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useProfileStore } from '@/store/useProfileStore';
import ProfileHeader from '@/components/profile_components/ProfileHeader';
import { DialogEditBio } from '@/components/profile_components/DialogEditBio';
import LoadingPage from '@/components/LoadingPage';

function Profile() {
  const stackUser = useUser();
  const userProfile = useProfileStore((state) => state.userProfile);
  const gettingUserProfile = useProfileStore((state) => state.gettingUserProfile);
  const getUserProfile = useProfileStore((state) => state.getUserProfile);

  const [isEditBioOpen, setIsEditBioOpen] = React.useState(false);
  const handleEditBioOpenChange = (open: boolean) => {
    setIsEditBioOpen(open);
  }

  useEffect(() => {
    if (stackUser?.id) {
      getUserProfile(stackUser.id);
    }
  }, [stackUser?.id]);

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
      <ProfileHeader user={userProfile} isOwner={userProfile.id === stackUser?.id} onEditBio={() => handleEditBioOpenChange(true)} />
      <DialogEditBio open={isEditBioOpen} onOpenChange={handleEditBioOpenChange} bio={userProfile.bio} userId={userProfile.id} onEditProfileSuccess={() => handleEditBioOpenChange(false)} />
    </div>
  );
}

export default Profile;
