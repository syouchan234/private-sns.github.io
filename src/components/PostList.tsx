import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonText,
  IonAvatar,
} from '../constants/ionicComponents';
import { thumbsUp, chatbubbleOutline } from 'ionicons/icons';
import PostFormModal from './PostFormModal';

export interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

interface PostListProps {
  posts: Post[];
  onReplySubmit: (postId: number, replyContent: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onReplySubmit }) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyingToPostId, setReplyingToPostId] = useState<number | null>(null);

  const handleOpenReply = (postId: number) => {
    setReplyingToPostId(postId);
    setShowReplyModal(true);
  };

  const handleReplySubmit = () => {
    if (replyingToPostId !== null) {
      onReplySubmit(replyingToPostId, replyContent);
      setReplyContent('');
      setShowReplyModal(false);
      setReplyingToPostId(null);
    }
  };

  return (
    <>
      {posts.map((post) => (
        <IonCard key={post.id} style={{ margin: '16px' }}>
          <IonCardHeader>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <IonAvatar style={{ width: '40px', height: '40px', marginRight: '12px' }}>
                <img src={post.avatar} alt={post.author} />
              </IonAvatar>
              <div>
                <IonCardTitle style={{ margin: 0 }}>{post.author}</IonCardTitle>
                <IonText color="medium" style={{ fontSize: '12px' }}>
                  {post.timestamp}
                </IonText>
              </div>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <p>{post.content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px' }}>
              <IonButton fill="clear" size="small">
                <IonIcon slot="start" icon={thumbsUp} />
                {post.likes}
              </IonButton>
              <IonButton
                fill="clear"
                size="small"
                onClick={() => handleOpenReply(post.id)}
              >
                <IonIcon slot="start" icon={chatbubbleOutline} />
                {post.comments}
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
    </>
  );
};

export default PostList;
