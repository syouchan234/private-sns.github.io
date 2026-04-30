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
  IonSpinner,
} from '../constants/ionicComponents'; // Ionicのコンポーネントをインポート
import { login, saveToken, saveUser } from '../services/api'; // APIサービスをインポート
import type { User } from '../services/api'; // ユーザー型をインポート

interface LoginFormProps {
  onLogin: (user: User) => void; // ログイン時のコールバック関数（ユーザー情報付き）
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState(''); // ユーザー名の状態管理
  const [password, setPassword] = useState(''); // パスワードの状態管理
  const [showAlert, setShowAlert] = useState(false); // アラート表示の状態管理
  const [alertMessage, setAlertMessage] = useState(''); // アラートメッセージの状態管理
  const [isLoading, setIsLoading] = useState(false); // ローディング状態

  // ログインボタンがクリックされた時の処理（非同期）
  const handleLogin = async () => {
    console.log('Login attempt:', { username, password });
    
    // 入力チェック
    if (!username || !password) {
      setAlertMessage('ユーザー名とパスワードを入力してください。');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      // GAS APIにログインリクエストを送信
      const result = await login(username, password);

      if (result.status === 'ok' && result.data) {
        // ログイン成功
        console.log('Login successful:', result.data);
        
        // トークンとユーザー情報をローカルストレージに保存
        saveToken(result.data.token);
        saveUser(result.data);

        // 親コンポーネントのコールバックを実行
        onLogin(result.data);
      } else {
        // ログイン失敗
        console.error('Login failed:', result.message);
        setAlertMessage(result.message || 'ログインに失敗しました。');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlertMessage('ネットワークエラーが発生しました。');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage> {/* Ionicページコンポーネント */}
      <IonHeader> {/* ヘッダー */}
        <IonToolbar>
          <IonTitle>MiniSNS ログイン</IonTitle> {/* タイトル */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"> {/* コンテンツエリア */}
        <div style={{ marginTop: '40px' }}>
          <h2>MiniSNS へようこそ</h2>
          <p>ログイン情報を入力してください</p>
        </div>

        <IonItem> {/* 入力項目 */}
          <IonLabel position="floating">ユーザー名またはメール</IonLabel> {/* ラベル */}
          <IonInput
            type="text"
            value={username}
            disabled={isLoading}
            onIonChange={(e) => setUsername(e.detail.value!)} // 入力変更時の処理
          />
        </IonItem>
        <IonItem> {/* 入力項目 */}
          <IonLabel position="floating">パスワード</IonLabel> {/* ラベル */}
          <IonInput
            type="password"
            value={password}
            disabled={isLoading}
            onIonChange={(e) => setPassword(e.detail.value!)} // 入力変更時の処理
          />
        </IonItem>

        {/* ログインボタン */}
        <div style={{ marginTop: '20px' }}>
          <IonButton 
            expand="full" 
            onClick={handleLogin}
            disabled={isLoading}
            color="primary"
          >
            {isLoading ? (
              <>
                <IonSpinner name="crescent" style={{ marginRight: '10px' }} />
                ログイン中...
              </>
            ) : (
              'ログイン'
            )}
          </IonButton>
        </div>

        {/* メモ */}
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px', fontSize: '14px' }}>
          <h4 style={{ marginTop: 0 }}>📝 注意</h4>
          <p>
            GASプロジェクトをデプロイして、<code>src/services/api.ts</code> の 
            <code>GAS_DEPLOYMENT_ID</code> を設定してください。
          </p>
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