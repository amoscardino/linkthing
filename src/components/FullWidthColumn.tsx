import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { WithChildrenProps } from "types/props";

const FullWidthColumn = ({ children }: WithChildrenProps) => (
    <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-center">
            <IonCol size="12">
                {children}
            </IonCol>
        </IonRow>
    </IonGrid>
);

export default FullWidthColumn;
