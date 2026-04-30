import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonText,
  IonAvatar,
  IonSpinner,
} from '../constants/ionicComponents';
import { thumbsUp, chatbubbleOutline, trash } from 'ionicons/icons';
import PostFormModal from './PostFormModal';
import { getReplies, createReply, deletePost, type Post as ApiPost, getToken } from '../services/api';

export interface Post extends ApiPost {
  replyCount?: number;
  likes?: number;
}

interface PostListProps {
  posts: Post[];
  onReplySubmit?: (postId: string, replyContent: string) => void;
  onPostDelete?: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  onReplySubmit,
  onPostDelete,
}) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replyCounts, setReplyCounts] = useState<{ [key: string]: number }>({});

  // 返信数を取得
  useEffect(() => {
    const fetchReplyCounts = async () => {
      const counts: { [key: string]: number } = {};
      for (const post of posts) {
        const result = await getReplies(post.postId, 1, 0);
        if (result.status === 'ok' && result.data) {
          counts[post.postId] = result.data.total;
        }
      }
      setReplyCounts(counts);
    };

    if (posts.length > 0) {
      fetchReplyCounts();
    }
  }, [posts]);

  const handleOpenReply = (postId: string) => {
    setReplyingToPostId(postId);
    setShowReplyModal(true);
  };

  const handleReplySubmit = async () => {
    if (replyingToPostId !== null && replyContent.trim()) {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        console.error('Token not found');
        setIsLoading(false);
        return;
      }

      const result = await createReply(token, replyingToPostId, replyContent);
      
      if (result.status === 'ok') {
        setReplyContent('');
        setShowReplyModal(false);
        setReplyingToPostId(null);
        
        // 返信数を更新
        setReplyCounts(prev => ({
          ...prev,
          [replyingToPostId]: (prev[replyingToPostId] || 0) + 1
        }));

        if (onReplySubmit) {
          onReplySubmit(replyingToPostId, replyContent);
        }
      } else {
        console.error('Reply creation failed:', result.message);
      }

      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const token = getToken();
    if (!token) {
      console.error('Token not found');
      return;
    }

    if (confirm('この投稿を削除しますか？')) {
      const result = await deletePost(token, postId);
      if (result.status === 'ok') {
        if (onPostDelete) {
          onPostDelete(postId);
        }
      } else {
        console.error('Post deletion failed:', result.message);
      }
    }
  };

  if (posts.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        投稿がまだありません
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <IonCard key={post.postId} style={{ margin: '16px' }}>
          <IonCardHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IonAvatar style={{ width: '40px', height: '40px', marginRight: '12px' }}>
                  <img src={`https://via.placeholder.com/40?text=${post.username.charAt(0)}`} alt={post.username} />
                </IonAvatar>
                <div>
                  <IonCardTitle style={{ margin: 0, fontSize: '16px' }}>{post.username}</IonCardTitle>
                  <IonText color="medium" style={{ fontSize: '12px' }}>
                    {new Date(post.timestamp).toLocaleString('ja-JP')}
                  </IonText>
                </div>
              </div>
              <IonButton 
                fill="clear" 
                size="small"
                color="danger"
                onClick={() => handleDeletePost(post.postId)}
              >
                <IonIcon icon={trash} />
              </IonButton>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <p>{post.content}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', marginTop: '12px' }}>
              <IonButton fill="clear" size="small" disabled>
                <IonIcon slot="start" icon={thumbsUp} />
                0
              </IonButton>
              <IonButton
                fill="clear"
                size="small"
                onClick={() => handleOpenReply(post.postId)}
              >
                <IonIcon slot="start" icon={chatbubbleOutline} />
                {replyCounts[post.postId] || 0}
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      ))}

      {/* 返信フォームモーダル */}
      <PostFormModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setReplyingToPostId(null);
          setReplyContent('');
        }}
        content={replyContent}
        onContentChange={setReplyContent}
        onSubmit={handleReplySubmit}
        isReply={true}
      />

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <IonSpinner name="crescent" />
        </div>
      )}
    </>
  );
};

export default PostList;
