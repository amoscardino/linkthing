import { IonText } from "@ionic/react";
import { WithChildrenProps } from "types/props";

interface ErrorMessageProps extends WithChildrenProps {}

const ErrorMessage = ({ children }: ErrorMessageProps) => (
    <div className="ion-padding ion-text-center center">
        <IonText color="danger">
            {children}
        </IonText>
    </div>
);

export default ErrorMessage;
