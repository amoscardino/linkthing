import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { WithChildrenProps } from "types/props";

const StandardColumn = ({ children }: WithChildrenProps) => (
    <IonGrid className="ion-no-padding">
        <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeSm="10" sizeMd="8" sizeLg="7" sizeXl="6">
                {children}
            </IonCol>
        </IonRow>
    </IonGrid>
);

export default StandardColumn;
