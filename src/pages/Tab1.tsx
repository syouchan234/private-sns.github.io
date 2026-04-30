import React, { useState, useEffect } from 'react';
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
import { createPost, getPosts, getToken } from '../services/api';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPosts = async () => {
    setIsLoading(true);
    const result = await getPosts(20, 0);
    if (result.status === 'ok' && result.data?.posts) {
      setPosts(result.data.posts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 投稿を追加
  const handlePost = async () => {
    if (!postContent.trim()) {
      return;
    }

    const token = getToken();
    if (!token) {
      alert('ログイン状態が無効です。再度ログインしてください。');
      return;
    }

    const result = await createPost(token, postContent);
    if (result.status === 'ok') {
      setPostContent('');
      setShowPostModal(false);
      await loadPosts();
    } else {
      alert(result.message || '投稿に失敗しました。');
    }
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

  const handlePostDelete = (postId: string) => {
    setPosts(posts.filter(post => post.postId !== postId));
  };

  // リフレッシュ
  const handleRefresh = async (event: any) => {
    await loadPosts();
    event.detail.complete();
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
      <PostList posts={posts} onReplySubmit={handleReplySubmit} onPostDelete={handlePostDelete} />

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
