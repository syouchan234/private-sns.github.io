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
  IonAlert,
} from '../constants/ionicComponents'; // Ionicのコンポーネントをインポート
import usersData, { User } from '../users'; // ユーザーJSONデータをインポート

interface LoginFormProps {
  onLogin: (user: User) => void; // ログイン時のコールバック関数（ユーザー情報付き）
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState(''); // ユーザー名の状態管理
  const [password, setPassword] = useState(''); // パスワードの状態管理
  const [showAlert, setShowAlert] = useState(false); // アラート表示の状態管理
  const [alertMessage, setAlertMessage] = useState(''); // アラートメッセージの状態管理

  // ログインボタンがクリックされた時の処理
  const handleLogin = () => {
    console.log('Login attempt:', { username, password });
    console.log('Available users:', usersData);
    
    // 入力チェック
    if (!username || !password) {
      setAlertMessage('ユーザー名とパスワードを入力してください。');
      setShowAlert(true);
      return;
    }

    // ユーザー認証
    const user = usersData.find(u => u.username === username && u.password === password);

    if (user) {
      // ログイン成功
      console.log('User found:', user);
      onLogin(user);
    } else {
      // ログイン失敗
      console.log('User not found. Checking available users:');
      usersData.forEach(u => {
        console.log(`  - Username: "${u.username}", Password: "${u.password}"`);
      });
      setAlertMessage('ユーザー名またはパスワードが間違っています。');
      setShowAlert(true);
    }
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

        {/* テスト用アカウント情報 */}
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h4>テストアカウント:</h4>
          <p><strong>ユーザー名:</strong> testuser<br /><strong>パスワード:</strong> password123</p>
          <p><strong>ユーザー名:</strong> demo<br /><strong>パスワード:</strong> demo123</p>
        </div>
      </IonContent>

      {/* エラーメッセージのアラート */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'ログインエラー'}
        message={alertMessage}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default LoginForm;