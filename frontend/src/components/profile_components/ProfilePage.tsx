import React from 'react'
import ProfileHeader from './ProfileHeader'
import { DialogEditBio } from './DialogEditBio'
import { User } from '@/store/useProfileStore';
import { useUser } from '@stackframe/stack';
import TabsProfilePages from './TabsProfilePages';
import { useActivityStore } from '@/store/useActivityStore';

interface ProfilePageProps {
    userProfile: User;
}

function ProfilePage({ userProfile }: ProfilePageProps) {
    const stackUser = useUser();

    const [isEditBioOpen, setIsEditBioOpen] = React.useState(false);
    const handleEditBioOpenChange = (open: boolean) => {
        setIsEditBioOpen(open);
    };

    const [currentTab, setCurrentTab] = React.useState<string>("Activities");

    const activities = useActivityStore((state) => state.userActivities);
    const getUserActivities = useActivityStore((state) => state.getUserActivities);
    const gettingUserActivities = useActivityStore((state) => state.gettingUserActivities);
    const gettingUserActivitiesError = useActivityStore((state) => state.gettingUserActivitiesError);

    return (
        <div className="flex flex-col w-full">
            <ProfileHeader user={userProfile} isOwner={userProfile.id === stackUser?.id} onEditBio={() => handleEditBioOpenChange(true)} />
            <TabsProfilePages
                pages={["Activities", "Habits", `${userProfile.id === stackUser?.id ? "Likes" : ""}`]}
                activeTab={currentTab}
                onChangeTab={(tab) => setCurrentTab(tab)}
            />
            <DialogEditBio open={isEditBioOpen} onOpenChange={handleEditBioOpenChange} bio={userProfile.bio} userId={userProfile.id} onEditProfileSuccess={() => handleEditBioOpenChange(false)} />
        </div>
    )
}

export default ProfilePage
