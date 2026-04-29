import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonTextarea,
  IonIcon,
} from '../constants/ionicComponents';
import { send } from 'ionicons/icons';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  isReply?: boolean;
}

const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  content,
  onContentChange,
  onSubmit,
  isReply = false,
}) => {
  const handleSubmit = () => {
    if (!content.trim()) {
      return;
    }
    onSubmit();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isReply ? '返信する' : '新しい投稿'}</IonTitle>
          <IonButton slot="end" color="primary" onClick={onClose}>
            閉じる
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <IonAvatar style={{ width: '40px', height: '40px', marginRight: '12px' }}>
                <img src="https://via.placeholder.com/40" alt="You" />
              </IonAvatar>
              <span style={{ color: '#666' }}>あなた</span>
            </div>
            <IonTextarea
              placeholder={isReply ? '返信を入力...' : 'あなたの考えを共有しましょう...'}
              rows={isReply ? 4 : 6}
              value={content}
              onIonChange={(e) => onContentChange(e.detail.value || '')}
              style={{ marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <IonButton
                fill="outline"
                onClick={() => {
                  onClose();
                  onContentChange('');
                }}
              >
                キャンセル
              </IonButton>
              <IonButton
                fill="solid"
                onClick={handleSubmit}
                disabled={!content.trim()}
              >
                <IonIcon slot="start" icon={send} />
                {isReply ? '返信' : '投稿'}
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default PostFormModal;
