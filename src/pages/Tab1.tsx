import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
} from '../constants/ionicComponents';
import { add } from 'ionicons/icons';
import PostFormModal from '../components/PostFormModal';
import PostList, { Post } from '../components/PostList';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      postId: '1',
      userId: 'u1',
      username: 'テストユーザー',
      content: 'こんにちは！最初の投稿です。',
      timestamp: '2分前',
      profileImageId: 'https://via.placeholder.com/40',
      likes: 5,
      replyCount: 2,
    },
    {
      postId: '2',
      userId: 'u2',
      username: 'デモユーザー',
      content: 'SNSアプリのテストを開始しました。',
      timestamp: '1時間前',
      profileImageId: 'https://via.placeholder.com/40',
      likes: 12,
      replyCount: 4,
    },
  ]);

  // 投稿を追加
  const handlePost = () => {
    if (!postContent.trim()) {
      return;
    }

    const newPost: Post = {
      postId: String(posts.length + 1),
      userId: 'current',
      username: 'あなた',
      content: postContent,
      timestamp: '今',
      profileImageId: 'https://via.placeholder.com/40',
      likes: 0,
      replyCount: 0,
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    setShowPostModal(false);
  };

  // 返信を追加
  const handleReplySubmit = (postId: string, replyContent: string) => {
    setPosts(
      posts.map(post =>
        post.postId === postId
          ? { ...post, replyCount: (post.replyCount ?? 0) + 1 }
          : post
      )
    );
  };

  // リフレッシュ
  const handleRefresh = (event: any) => {
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  return (
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* リフレッシャー */}
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      {/* 投稿一覧 */}
      <PostList posts={posts} onReplySubmit={handleReplySubmit} />

      {/* 投稿フォームモーダル */}
      <PostFormModal
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setPostContent('');
        }}
        content={postContent}
        onContentChange={setPostContent}
        onSubmit={handlePost}
      />

      {/* フローティングボタン */}
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShowPostModal(true)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </IonContent>
  );
};

export default Tab1;
