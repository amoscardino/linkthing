import { IonChip, IonIcon, IonLabel } from "@ionic/react";
import useDarkMode from "hooks/useDarkMode";
import { checkmarkCircle, pricetagOutline } from "ionicons/icons";

interface TagProps {
    tag: string;
    isActive?: boolean;
    onClick?: () => void;
}

const Tag = (props: TagProps) => {
    const isDarkMode = useDarkMode();

    return (
        <IonChip
            onClick={props.onClick}
            color={props.isActive ? 'primary' : 'medium'}
            outline={!isDarkMode}
        >
            <IonIcon icon={props.isActive ? checkmarkCircle : pricetagOutline} />
            <IonLabel>{props.tag}</IonLabel>
        </IonChip>
    );
};

export default Tag;