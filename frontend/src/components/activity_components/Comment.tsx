import type { Comment } from '@/store/useCommentStore';
import React from 'react';

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
  const createdAtString = typeof comment.createdAt === 'string' ? comment.createdAt : comment.createdAt.toISOString();
  const timeAgo = getTimeAgo(createdAtString);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #222' }}>
      <img
        src={comment.owner?.profileImageUrl || '/default-profile.png'}
        alt={comment.owner?.name || 'User'}
        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }}
      />
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, color: '#fff', marginRight: 6 }}>{comment.owner?.name || 'User'}</span>
        <span style={{ color: '#fff' }}>{comment.commentText}</span>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 6, gap: 16 }}>
          <span style={{ color: '#888', fontSize: 13 }}>{timeAgo}</span>
          <span style={{ color: '#888', fontSize: 13 }}>{24} likes</span>
          <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 13 }}>Reply</button>
        </div>
      </div>
      <button
        style={{ background: 'none', border: 'none', color: '#fff', marginLeft: 8, cursor: 'pointer', fontSize: 18 }}
        aria-label="Like"
      >
        <span role="img" aria-label="like">♡</span>
      </button>
    </div>
  );
};

export default Comment;
