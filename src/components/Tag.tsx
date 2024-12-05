import { IonChip, IonIcon, IonLabel } from "@ionic/react";
import { checkmarkCircle, pricetagOutline } from "ionicons/icons";

interface TagProps {
    tag: string;
    isActive?: boolean;
    onClick?: (evt: React.MouseEvent) => void;
}

const Tag = (props: TagProps) => (
    <IonChip
        onClick={props.onClick}
        color={props.isActive ? 'primary' : undefined}
        outline
    >
        <IonIcon icon={props.isActive ? checkmarkCircle : pricetagOutline} />
        <IonLabel>{props.tag}</IonLabel>
    </IonChip>
);

export default Tag;