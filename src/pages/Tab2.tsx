import React from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonButton,
  IonIcon,
  IonAlert
} from '../constants/ionicComponents';
import { personCircle, heart, chatbubble, share } from 'ionicons/icons';
import './Tab3.css';
import { User } from '../users';

interface Tab2Props {
  user: User | null;
  onLogout: () => void;
}

const Tab2: React.FC<Tab2Props> = ({ user, onLogout }) => {
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyHkSezXu5oaf3FLamuHyFIjGlqUFkdRjdmxjKBcbn9ZsWnPtQDkCfgww3omwD3bAVr/exec';
  /**
   * 1. GETテスト：A2セルの値を取得する
   */
  const runGetTest = async () => {
    
    try {
      console.log('--- GET疎通テスト開始 ---');
      const url = `${GAS_URL}?mode=get`; 
      
      const response = await fetch(url);
      const result = await response.json();

      console.log('GET成功:', result);
    } catch (e: any) {
      console.error('GETエラー:', e);
    }
  };

  /**
   * 2. POST(書き込み)テスト：A3セルに値を書き込む
   * GAS側がdoGetで待ち受けているため、クエリパラメータでデータを送ります
   */
const runPostTest = async () => {
  try {
    console.log('--- POST(body)テスト開始 ---');
    
    const postBody = new URLSearchParams();
    postBody.append('mode', 'Auth');//認証モード
    postBody.append('pass', 'PASSWORD');

    const response = await fetch(GAS_URL, {
      method: 'POST',
      // headers をあえて指定しない、もしくは以下のように設定
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postBody,
      redirect: 'follow',
    });

    const result = await response.json();
    console.log('POST成功:', result);
  } catch (e: any) {
    console.error('POST通信エラー:', e);
  }
};
  console.log('Tab3 user prop:', user);

  if (!user) {
    return (
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <IonText>ユーザー情報が読み込めません</IonText>
          <br />
          <IonText color="medium">ログイン状態を確認してください</IonText>
        </div>
      </IonContent>
    );
  }

  return (
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* プロフィール情報 */}
      <IonCard>
        <IonCardHeader>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
            <IonAvatar style={{ width: '80px', height: '80px', marginRight: '16px' }}>
              <img src={user.avatar} alt="Profile" />
            </IonAvatar>
            <div>
              <IonCardTitle>{user.name}</IonCardTitle>
              <IonText color="medium">@{user.username}</IonText>
            </div>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <p>{user.bio}</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <IonText style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.posts}</IonText>
              <br />
              <IonText color="medium">投稿</IonText>
            </div>
            <div style={{ textAlign: 'center' }}>
              <IonText style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.followers}</IonText>
              <br />
              <IonText color="medium">フォロワー</IonText>
            </div>
            <div style={{ textAlign: 'center' }}>
              <IonText style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.following}</IonText>
              <br />
              <IonText color="medium">フォロー中</IonText>
            </div>
          </div>
        </IonCardContent>
      </IonCard>

      {/* 設定メニュー */}
      <IonList>
        <IonItem button>
          <IonIcon icon={personCircle} slot="start" />
          <IonLabel>プロフィール編集</IonLabel>
        </IonItem>
        <IonItem button>
          <IonIcon icon={heart} slot="start" />
          <IonLabel>お気に入り</IonLabel>
        </IonItem>
        <IonItem button>
          <IonIcon icon={chatbubble} slot="start" />
          <IonLabel>メッセージ</IonLabel>
        </IonItem>
        <IonItem button>
          <IonIcon icon={share} slot="start" />
          <IonLabel>共有</IonLabel>
        </IonItem>
      </IonList>

      <div style={{ padding: '16px 16px 0 16px' }}>
        <IonButton expand="block" color="tertiary" onClick={runGetTest}>
          GET疎通テスト (A2取得)
        </IonButton>
      </div>

      <div style={{ padding: '16px' }}>
        <IonButton expand="block" color="success" onClick={runPostTest}>
          POST(書込)テスト (A3更新)
        </IonButton>
      </div>

      {/* ログアウトボタン */}
      <div style={{ padding: '16px' }}>
        <IonButton expand="block" color="danger" onClick={() => setShowLogoutAlert(true)}>
          ログアウト
        </IonButton>
      </div>

      {/* ログアウト確認アラート */}
      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header={'ログアウト'}
        message={'本当にログアウトしますか？'}
        buttons={[
          {
            text: 'キャンセル',
            role: 'cancel',
            handler: () => setShowLogoutAlert(false)
          },
          {
            text: 'ログアウト',
            role: 'destructive',
            handler: () => {
              setShowLogoutAlert(false);
              onLogout();
            }
          }
        ]}
      />
    </IonContent>
  );
};

export default Tab2;
