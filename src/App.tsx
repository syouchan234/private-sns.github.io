import React, { useEffect, useState } from 'react'; // ReactとuseEffect/useStateをインポート
import {
  IonApp,
  IonButton,
  IonFooter,
  IonIcon,
  IonLabel,
  IonPage,
  IonToolbar,
  setupIonicReact
} from './constants/ionicComponents'; // Ionicのコンポーネントをインポート
import { ellipse, square, triangle } from 'ionicons/icons'; // アイコンをインポート
import Tab1 from './pages/Tab1'; // Tab1ページをインポート
import Tab2 from './pages/Tab2'; // Tab2ページをインポート
import Tab3 from './pages/Tab3'; // Tab3ページをインポート
import LoginForm from './components/LoginForm'; // ログインフォームをインポート

// ユーザー情報の型定義
import { User } from './services/api';

import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact(); // Ionic Reactのセットアップ

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.localStorage.getItem('isLoggedIn') === 'true';
  }); // ログイン状態を管理
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const userData = window.localStorage.getItem('currentUser');
    const user = userData ? JSON.parse(userData) : null;
    console.log('Loaded from localStorage:', user);
    return user;
  }); // 現在のユーザー情報を管理
  const [activeTab, setActiveTab] = useState('tab1'); // アクティブなタブを管理

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
      if (currentUser) {
        window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('Saved to localStorage:', currentUser);
      } else {
        window.localStorage.removeItem('currentUser');
        console.log('Removed currentUser from localStorage');
      }
    }
  }, [isLoggedIn, currentUser]);

  // ログイン処理
  const handleLogin = (user: User) => {
    console.log('Login successful:', user);
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab('tab3'); // ログイン後にProfileタブに移動
  };

  // ログアウト処理
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('tab1');
  };

  // タブが切り替わったときにスクロール位置をトップにリセット（疑似ページ遷移の補完）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

  // ログインしていない場合、ログインフォームを表示
  if (!isLoggedIn) {
    return (
      <IonApp>
        <LoginForm onLogin={handleLogin} />
      </IonApp>
    );
  }

  // ログインしている場合、タブコンテンツとタブバーを表示
  return (
    <IonApp>
      <IonPage>
        {/* 疑似遷移を確実にするため、各ページコンポーネントを表示。
            条件付きレンダリングにより、アクティブなタブのみがDOMに描画されます。
        */}
        <main style={{ height: 'calc(100vh - 56px)', overflow: 'auto' }}>
          {activeTab === 'tab1' && <Tab1 />}
          {/* {activeTab === 'tab2' && <Tab2 />} */}
          {activeTab === 'tab3' && <Tab3 user={currentUser} onLogout={handleLogout} />}
        </main>

        {/* タブ風のフッターボタンで画面切り替え */}
        <IonFooter>
          <IonToolbar>
            <div style={{ display: 'flex', width: '100%' }}>
              <IonButton
                fill="clear"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
                strong={activeTab === 'tab1'}
                onClick={() => setActiveTab('tab1')}
              >
                <IonIcon aria-hidden="true" icon={triangle} />
                <IonLabel>Home</IonLabel>
              </IonButton>

              
              <IonButton
                fill="clear"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
                strong={activeTab === 'tab2'}
                onClick={() => setActiveTab('tab2')}
              >
                <IonIcon aria-hidden="true" icon={ellipse} />
                <IonLabel>TestPage</IonLabel>
              </IonButton>
             

              <IonButton
                fill="clear"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
                strong={activeTab === 'tab3'}
                onClick={() => setActiveTab('tab3')}
              >
                <IonIcon aria-hidden="true" icon={square} />
                <IonLabel>Profile</IonLabel>
              </IonButton>
            </div>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    </IonApp>
  );
};

export default App;