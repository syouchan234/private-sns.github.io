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
import { User } from '../services/api';

interface Tab3Props {
  user: User | null;
  onLogout: () => void;
}

const Tab3: React.FC<Tab3Props> = ({ user, onLogout }) => {
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);
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
              <img
                src={`https://via.placeholder.com/80?text=${user.username.charAt(0)}`}
                alt="Profile"
              />
            </IonAvatar>
            <div>
              <IonCardTitle>{user.username}</IonCardTitle>
              <IonText color="medium">{user.email}</IonText>
            </div>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <p>{user.profileTxt || '自己紹介は登録されていません。'}</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <IonText style={{ fontSize: '18px', fontWeight: 'bold' }}>0</IonText>
              <br />
              <IonText color="medium">投稿</IonText>
            </div>
            <div style={{ textAlign: 'center' }}>
              <IonText style={{ fontSize: '18px', fontWeight: 'bold' }}>0</IonText>
              <br />
              <IonText color="medium">フォロワー</IonText>
            </div>
            <div style={{ textAlign: 'center' }}>
              <IonText style={{ fontSize: '18px', fontWeight: 'bold' }}>0</IonText>
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

export default Tab3;
