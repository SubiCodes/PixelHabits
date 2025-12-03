import React from 'react'
import ProfileHeader from './ProfileHeader'
import { DialogEditBio } from './DialogEditBio'
import { User } from '@/store/useProfileStore';
import { useUser } from '@stackframe/stack';
import TabsProfilePages from './TabsProfilePages';
import { useActivityStore } from '@/store/useActivityStore';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';

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

    React.useEffect(() => {
        if (currentTab === "Activities") {
            getUserActivities(userProfile.id, stackUser?.id || '');
        };
    }, [currentTab]);

    return (
        <div className="flex flex-col w-full">
            <ProfileHeader user={userProfile} isOwner={userProfile.id === stackUser?.id} onEditBio={() => handleEditBioOpenChange(true)} />
            <TabsProfilePages
                pages={["Activities", "Habits", `${userProfile.id === stackUser?.id ? "Likes" : ""}`]}
                activeTab={currentTab}
                onChangeTab={(tab) => setCurrentTab(tab)}
            />
            <div className='flex flex-1 overflow-auto'>
                {currentTab === "Activities" ? (
                    gettingUserActivities ? (
                        <LoadingPage />
                    ) : gettingUserActivitiesError ? (
                        <div className='flex flex-1 items-center justify-center p-4'>
                            <ErrorPage errorMessage={gettingUserActivitiesError} retryAction={() => getUserActivities(userProfile.id, stackUser?.id || '')}/>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className='flex flex-1 items-center justify-center p-4'>
                            <p className='text-muted-foreground'>No activities to show.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-3 space-x-2 space-y-2'>

                        </div>
                    )
                ) : (
                    <></>
                )}
            </div>
            <DialogEditBio open={isEditBioOpen} onOpenChange={handleEditBioOpenChange} bio={userProfile.bio} userId={userProfile.id} onEditProfileSuccess={() => handleEditBioOpenChange(false)} />
        </div >
    )
}

export default ProfilePage
