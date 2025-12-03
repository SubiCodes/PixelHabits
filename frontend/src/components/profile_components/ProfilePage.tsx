import React from 'react'
import ProfileHeader from './ProfileHeader'
import { DialogEditBio } from './DialogEditBio'
import { User } from '@/store/useProfileStore';
import { useUser } from '@stackframe/stack';

interface ProfilePageProps {
    userProfile: User;
}

function ProfilePage({ userProfile }: ProfilePageProps) {
    const stackUser = useUser();

    const [isEditBioOpen, setIsEditBioOpen] = React.useState(false);
    const handleEditBioOpenChange = (open: boolean) => {
        setIsEditBioOpen(open);
    }
    
    return (
        <div className="flex flex-col w-full">
            <ProfileHeader user={userProfile} isOwner={userProfile.id === stackUser?.id} onEditBio={() => handleEditBioOpenChange(true)} />
            <DialogEditBio open={isEditBioOpen} onOpenChange={handleEditBioOpenChange} bio={userProfile.bio} userId={userProfile.id} onEditProfileSuccess={() => handleEditBioOpenChange(false)} />
        </div>
    )
}

export default ProfilePage
