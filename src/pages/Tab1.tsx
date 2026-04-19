import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <ExploreContainer name="Tab 1 page" />
    </IonContent>
  );
};

export default Tab1;
