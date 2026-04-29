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
      id: 1,
      author: 'テストユーザー',
      avatar: 'https://via.placeholder.com/40',
      content: 'こんにちは！最初の投稿です。',
      timestamp: '2分前',
      likes: 5,
      comments: 2,
    },
    {
      id: 2,
      author: 'デモユーザー',
      avatar: 'https://via.placeholder.com/40',
      content: 'SNSアプリのテストを開始しました。',
      timestamp: '1時間前',
      likes: 12,
      comments: 4,
    },
  ]);

  // 投稿を追加
  const handlePost = () => {
    if (!postContent.trim()) {
      return;
    }

    const newPost: Post = {
      id: posts.length + 1,
      author: 'あなた',
      avatar: 'https://via.placeholder.com/40',
      content: postContent,
      timestamp: '今',
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    setShowPostModal(false);
  };

  // 返信を追加
  const handleReplySubmit = (postId: number, replyContent: string) => {
    setPosts(
      posts.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
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
