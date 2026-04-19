import React, { useState } from 'react'; // ReactとuseStateをインポート
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'; // Ionicのコンポーネントをインポート

interface LoginFormProps {
  onLogin: () => void; // ログイン時のコールバック関数
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState(''); // ユーザー名の状態管理
  const [password, setPassword] = useState(''); // パスワードの状態管理

  // ログインボタンがクリックされた時の処理
  const handleLogin = () => {
    // 疎通確認のため、入力なしでもログイン可能
    onLogin();
  };

  return (
    <IonPage> {/* Ionicページコンポーネント */}
      <IonHeader> {/* ヘッダー */}
        <IonToolbar>
          <IonTitle>ログイン</IonTitle> {/* タイトル */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"> {/* コンテンツエリア */}
        <IonItem> {/* 入力項目 */}
          <IonLabel position="floating">ユーザー名</IonLabel> {/* ラベル */}
          <IonInput
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)} // 入力変更時の処理
          />
        </IonItem>
        <IonItem> {/* 入力項目 */}
          <IonLabel position="floating">パスワード</IonLabel> {/* ラベル */}
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)} // 入力変更時の処理
          />
        </IonItem>
        <IonButton expand="full" onClick={handleLogin}> {/* ログインボタン */}
          ログイン
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginForm;