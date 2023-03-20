import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { sparklesOutline } from "ionicons/icons";

const Footer = () => (
    <IonItem lines="none">
        <IonLabel className="ion-text-center ion-padding-top ion-margin-top ion-margin-bottom">
            <IonIcon icon={sparklesOutline} color="medium" style={{ fontSize: '3rem' }} />
        </IonLabel>
    </IonItem>
);

export default Footer;
