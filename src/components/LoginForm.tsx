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
import { login, registerUser, saveToken, saveUser } from '../services/api'; // APIサービスをインポート
import type { User } from '../services/api'; // ユーザー型をインポート

interface LoginFormProps {
  onLogin: (user: User) => void; // ログイン時のコールバック関数（ユーザー情報付き）
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState(''); // ユーザー名の状態管理
  const [email, setEmail] = useState(''); // メールアドレスの状態管理
  const [password, setPassword] = useState(''); // パスワードの状態管理
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 確認用パスワード
  const [isRegistering, setIsRegistering] = useState(false); // 登録モード
  const [showAlert, setShowAlert] = useState(false); // アラート表示の状態管理
  const [alertMessage, setAlertMessage] = useState(''); // アラートメッセージの状態管理
  const [isLoading, setIsLoading] = useState(false); // ローディング状態

  // ログインボタンがクリックされた時の処理（非同期）
  const handleLogin = async () => {
    console.log('Login attempt:', { username, password });
    
    if (!username || !password) {
      setAlertMessage('ユーザー名とパスワードを入力してください。');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.status === 'ok' && result.data) {
        console.log('Login successful:', result.data);
        saveToken(result.data.token);
        saveUser(result.data);
        onLogin(result.data);
      } else {
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

  const handleRegister = async () => {
    console.log('Register attempt:', { username, email, password, passwordConfirm });

    if (!username || !email || !password || !passwordConfirm) {
      setAlertMessage('すべての項目を入力してください。');
      setShowAlert(true);
      return;
    }
    if (password !== passwordConfirm) {
      setAlertMessage('パスワードと確認パスワードが一致しません。');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser(username, email, password, passwordConfirm);

      if (result.status === 'ok' && result.data) {
        console.log('Register successful:', result.data);
        saveToken(result.data.token);
        saveUser(result.data);
        onLogin(result.data);
      } else {
        console.error('Register failed:', result.message);
        setAlertMessage(result.message || '登録に失敗しました。');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Register error:', error);
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

        <IonItem>
          <IonLabel position="floating">ユーザー名またはメール</IonLabel>
          <IonInput
            type="text"
            value={username}
            disabled={isLoading}
            onIonChange={(e) => setUsername(e.detail.value!)}
          />
        </IonItem>
        {isRegistering && (
          <IonItem>
            <IonLabel position="floating">メールアドレス</IonLabel>
            <IonInput
              type="email"
              value={email}
              disabled={isLoading}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>
        )}
        <IonItem>
          <IonLabel position="floating">パスワード</IonLabel>
          <IonInput
            type="password"
            value={password}
            disabled={isLoading}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        {isRegistering && (
          <IonItem>
            <IonLabel position="floating">パスワード確認</IonLabel>
            <IonInput
              type="password"
              value={passwordConfirm}
              disabled={isLoading}
              onIonChange={(e) => setPasswordConfirm(e.detail.value!)}
            />
          </IonItem>
        )}

        <div style={{ marginTop: '20px' }}>
          <IonButton
            expand="full"
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={isLoading}
            color="primary"
          >
            {isLoading ? (
              <>
                <IonSpinner name="crescent" style={{ marginRight: '10px' }} />
                {isRegistering ? '登録中...' : 'ログイン中...'}
              </>
            ) : isRegistering ? (
              '新規登録'
            ) : (
              'ログイン'
            )}
          </IonButton>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <IonButton fill="clear" onClick={() => setIsRegistering((prev) => !prev)}>
            {isRegistering ? '既にアカウントをお持ちですか？ ログイン' : 'アカウントをお持ちでないですか？ 新規登録'}
          </IonButton>
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