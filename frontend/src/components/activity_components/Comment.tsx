import type { Comment } from '@/store/useCommentStore';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
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
  comment: Comment
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  let createdAtString: string;
  if (comment.createdAt instanceof Date && typeof comment.createdAt.toISOString === 'function') {
    createdAtString = comment.createdAt.toISOString();
  } else if (typeof comment.createdAt === 'string') {
    createdAtString = comment.createdAt;
  } else {
    createdAtString = String(comment.createdAt);
  }
  const timeAgo = getTimeAgo(createdAtString);
  return (
    <div className="flex items-start py-3 px-2 pr-4 bg-white">
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
          <span className="text-xs text-[#888]">{24} likes</span>
          <button className="bg-none border-none text-[#888] cursor-pointer text-xs">Reply</button>
        </div>
      </div>
      <button
        className="bg-none border-none text-[#222] ml-2 cursor-pointer text-lg"
        aria-label="Like"
      >
        <span role="img" aria-label="like">♡</span>
      </button>
    </div>
  );
};

export default Comment;
