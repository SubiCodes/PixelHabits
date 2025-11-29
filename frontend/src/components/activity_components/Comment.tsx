import { useCommentStore, type Comment } from '@/store/useCommentStore';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreVertical, Trash2, Heart, HeartIcon } from 'lucide-react';
import { useUser } from '@stackframe/stack';
import { Button } from '../ui/button';
import LoadingPage from '../LoadingPage';

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  // Use UTC for both dates to avoid timezone issues
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
  const diffMs = nowUtc - dateUtc;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear}y`;
  if (diffMonth > 0) return `${diffMonth}mo`;
  if (diffWeek > 0) return `${diffWeek}w`;
  if (diffDay > 0) return `${diffDay}d`;
  if (diffHour > 0) return `${diffHour}h`;
  if (diffMin > 0) return `${diffMin}m`;
  return 'now';
}

interface CommentProps {
  comment: Comment;
  showDelete?: boolean;
  onDelete?: (commentId: string) => void;
  deletingComment?: boolean;
}

const Comment: React.FC<CommentProps> = ({ comment, showDelete, onDelete, deletingComment }) => {

  const user = useUser();
  const likeComment = useCommentStore((state) => state.likeComment);

  const openedCommentsId = useCommentStore((state) => state.openedCommentsId);
  const handleOpenCloseCommentReply = useCommentStore((state) => state.handleOpenCloseCommentReply);
  const commentReplies = useCommentStore((state) => state.commentReplies);
  const gettingCommentReplies = useCommentStore((state) => state.gettingCommentReplies);
  const getCommentReplies = useCommentStore((state) => state.getCommentReplies);

  const likeUnlikeThisComment = async () => {
    if (!user || !comment.id) return;
    await likeComment(comment.id, user.id);
  }

  let createdAtString: string;
  if (comment.createdAt instanceof Date && typeof comment.createdAt.toISOString === 'function') {
    createdAtString = comment.createdAt.toISOString();
  } else if (typeof comment.createdAt === 'string') {
    createdAtString = comment.createdAt;
  } else {
    createdAtString = String(comment.createdAt);
  }
  const timeAgo = getTimeAgo(createdAtString);

  const openCommentReplies = async () => {
    const isAlreadyOpened = openedCommentsId.includes(comment.id);
    await handleOpenCloseCommentReply(comment.id);
    if (!isAlreadyOpened) {
      await getCommentReplies(comment.id);
    }
  }

  return (
    <div className='flex flex-col gap-2 items-start py-3 px-2 pr-4 border-b border-[#eee]'>
      <div className="flex items-start bg-white">
        <Avatar className="w-8 h-8 mr-3">
          <AvatarImage
            src={comment.owner?.profileImageUrl || '/default-profile.png'}
            alt={comment.owner?.name || 'User'}
            className="object-cover"
          />
          <AvatarFallback>
            {comment.owner?.name ? comment.owner.name[0] : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <span className="font-semibold text-[#222] mr-1">{comment.owner?.name || 'User'}</span>
          <span className="text-[#222]">{comment.commentText}</span>
          <div className="flex items-center mt-1 gap-4">
            <span className="text-xs text-[#888]">{timeAgo}</span>
            <span className="text-xs text-[#888]">{comment.comment_likes?.length || 0} likes</span>
            <button className="bg-none border-none text-[#888] cursor-pointer text-xs">Reply</button>
          </div>
        </div>
        {/** Like button or Delete dropdown */}
        {!showDelete ? (
          <button
            className="bg-none border-none text-[#222] ml-2 cursor-pointer text-lg"
            aria-label="Like"
            onClick={likeUnlikeThisComment}
          >
            {comment.comment_likes?.includes(user?.id || '') ? (
              <Heart fill="#e0245e" color="#e0245e" strokeWidth={1.5} size={20} />
            ) : (
              <HeartIcon color="#222" strokeWidth={1.5} size={20} />
            )}
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-none border-none text-[#222] ml-2 cursor-pointer text-lg p-1" aria-label="Options" disabled={deletingComment}>
                <MoreVertical size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600 flex items-center gap-2" onClick={() => onDelete?.(comment.id || comment.id)}>
                <Trash2 size={16} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Button for the replies count */}
      {typeof comment.comment_replies === 'number' && comment.comment_replies > 0 && !openedCommentsId.includes(comment.id) && (
        <div className='flex items-center justify-center w-full px-8'>
          <Button className='flex items-center w-full bg-transparent hover:bg-transparent p-0 cursor-pointer' onClick={() => openCommentReplies()}>
            <div className='flex w-full h-[1px] bg-gray-200' />
            <span className='text-muted-foreground font-normal  '>{`Replies ${comment.comment_replies}`}</span>
            <div className='flex w-full h-[1px] bg-gray-200' />
          </Button>
        </div>
      )}

      {/* Reply Section */}
      {openedCommentsId.includes(comment.id) && (
        <div className='w-full mt-2'>
          {gettingCommentReplies.includes(comment.id) ? (
            <div className='flex flex-1 items-center justify-center'>
              <LoadingPage isMoonLoader={true} />
            </div>
          ) : (
            <div className='flex w-full pl-12'>
              {commentReplies.find(cr => cr.commentId === comment.id)?.replies.map((reply) => (
                <div className="flex items-start bg-white" key={reply.id}>
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage
                      src={reply.owner?.profileImageUrl || '/default-profile.png'}
                      alt={reply.owner?.name || 'User'}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {reply.owner?.name ? reply.owner.name[0] : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <span className="font-semibold text-[#222] mr-1">{reply.owner?.name || 'User'}</span>
                    <span className="text-[#222]">{reply.replyText}</span>
                    <div className="flex items-center mt-1 gap-4">
                      <span className="text-xs text-[#888]">{timeAgo}</span>
                      <span className="text-xs text-[#888]">{0} likes</span>
                      <button className="bg-none border-none text-[#888] cursor-pointer text-xs">Reply</button>
                    </div>
                  </div>
                  {/** Like button or Delete dropdown */}
                  {!showDelete ? (
                    <button
                      className="bg-none border-none text-[#222] ml-2 cursor-pointer text-lg"
                      aria-label="Like"
                      onClick={likeUnlikeThisComment}
                    >
                      {comment.comment_likes?.includes(user?.id || '') ? (
                        <Heart fill="#e0245e" color="#e0245e" strokeWidth={1.5} size={20} />
                      ) : (
                        <HeartIcon color="#222" strokeWidth={1.5} size={20} />
                      )}
                    </button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="bg-none border-none text-[#222] ml-2 cursor-pointer text-lg p-1" aria-label="Options" disabled={deletingComment}>
                          <MoreVertical size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600 flex items-center gap-2" onClick={() => onDelete?.(comment.id || comment.id)}>
                          <Trash2 size={16} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>

          )}
        </div>
      )}


    </div>
  );
};

export default Comment;
