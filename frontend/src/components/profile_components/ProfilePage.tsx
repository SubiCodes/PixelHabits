import React from 'react'
import ProfileHeader from './ProfileHeader'
import { DialogEditBio } from './DialogEditBio'
import { User } from '@/store/useProfileStore';
import { useUser } from '@stackframe/stack';
import TabsProfilePages from './TabsProfilePages';
import { Activity, useActivityStore } from '@/store/useActivityStore';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import CardActivity from '../activity_components/CardActivity';
import { DialogViewActivity } from '../activity_components/DialogViewActivity';
import { useLikeStore } from '@/store/useLikeStore';
import { DialogEditActivity } from '../activity_components/DialogEditActivity';
import { DialogDeleteActivity } from '../activity_components/DialogDeleteActivity';

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

    const [openedActivity, setOpenedActivity] = React.useState<Activity | null>(null);
    const [isActivityOpen, setIsActivityOpen] = React.useState<boolean>(false);
    const activities = useActivityStore((state) => state.userActivities);
    const getUserActivities = useActivityStore((state) => state.getUserActivities);
    const gettingUserActivities = useActivityStore((state) => state.gettingUserActivities);
    const gettingUserActivitiesError = useActivityStore((state) => state.gettingUserActivitiesError);

    const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = React.useState<boolean>(false);

    const openEditActivityDialog = async (activity: Activity) => {
        setOpenedActivity(activity);
        setIsEditActivityDialogOpen(true);
    };

    const openActivity = (activity: Activity) => {
        setOpenedActivity(activity);
        setIsActivityOpen(true);
    };

    const closeViewAndEditDialogs = () => {
        setIsActivityOpen(false);
        setIsEditActivityDialogOpen(false);
    };

    const [isDeleteActivityDialogOpen, setIsDeleteActivityDialogOpen] = React.useState<boolean>(false);
    const [activityToDelete, setActivityToDelete] = React.useState<string | null>(null);
    const openDeleteActivityDialog = (activityId: string) => {
        setActivityToDelete(activityId);
        setIsDeleteActivityDialogOpen(true);
    }
    const closeViewAndDeleteDialogs = () => {
        setIsActivityOpen(false);
        setIsDeleteActivityDialogOpen(false);
    };

    const likeActivityOnUserActivities = useActivityStore((state) => state.likeActivityOnUserActivities);
    const isUserLiked = useActivityStore((state) => state.isUserLikedUserActivity);
    const like = useLikeStore((state) => state.like);

    const handleLike = async (activityId: string) => {
        if (!stackUser) return;
        const isLiked = isUserLiked(activityId, stackUser.id);
        likeActivityOnUserActivities(activityId, stackUser.id, !isLiked);
        await like(activityId, stackUser.id);
    };

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
            <div className='flex flex-1 overflow-auto mt-2'>
                {/* Display for when activities is active */}
                {currentTab === "Activities" ? (
                    gettingUserActivities ? (
                        <div className='flex flex-1 w-full h-full items-center justify-center p-4'>
                            <LoadingPage />
                        </div>
                    ) : gettingUserActivitiesError ? (
                        <div className='flex flex-1 w-full h-full items-center justify-center p-4'>
                            <ErrorPage errorMessage={gettingUserActivitiesError} retryAction={() => getUserActivities(userProfile.id, stackUser?.id || '')} />
                        </div>
                    ) : activities.length === 0 ? (
                        <div className='flex flex-1 items-center justify-center p-4'>
                            <p className='text-muted-foreground'>No activities to show.</p>
                        </div>
                    ) : (
                        <div className='w-full grid grid-cols-3 px-2'>
                            {activities.map((activity) => (
                                <CardActivity key={activity.id} activity={activity} openActivity={() => openActivity(activity)} />
                            ))}
                        </div>
                    )
                ) : (
                    <></>
                )}
            </div>
            <DialogEditBio
                open={isEditBioOpen}
                onOpenChange={handleEditBioOpenChange}
                bio={userProfile.bio} userId={userProfile.id}
                onEditProfileSuccess={() => handleEditBioOpenChange(false)} />
            <DialogViewActivity
                open={isActivityOpen}
                close={() => setIsActivityOpen(false)}
                activity={openedActivity}
                editFunc={(activity) => activity && openEditActivityDialog(activity as unknown as Activity)}
                deleteFunc={() => openDeleteActivityDialog(activityToDelete ?? "")}
                handleLikeFunction={() => handleLike(openedActivity ? openedActivity.id : '')}
                fromUserProfile={true}
            />
            <DialogEditActivity
                open={isEditActivityDialogOpen}
                onOpenChange={setIsEditActivityDialogOpen}
                activity={openedActivity ?? null}
                onEditSuccess={closeViewAndEditDialogs}
                fromProfile={true}
            />
            <DialogDeleteActivity
                open={isDeleteActivityDialogOpen}
                activity={openedActivity}
                closeViews={closeViewAndDeleteDialogs}
                fromProfile={true}
            />
        </div >
    )
}

export default ProfilePage
