import { IonText } from "@ionic/react";
import { WithChildrenProps } from "../types/props";

interface EmptyMessageProps extends WithChildrenProps { }

const EmptyMessage = ({ children }: EmptyMessageProps) => (
    <div className="ion-padding ion-text-center center">
        <IonText color="medium">
            {children}
        </IonText>
    </div>
);

export default EmptyMessage;
