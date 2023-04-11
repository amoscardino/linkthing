import { IonButton, IonIcon, useIonModal } from "@ionic/react";
import { pricetagOutline } from "ionicons/icons";
import TagsPage from "pages/TagsPage";

interface TagsButtonProps {
    containingPage: HTMLElement | null;
    onChanges: (tag: string | null) => Promise<void>;
}

const TagsButton = ({ containingPage, onChanges }: TagsButtonProps) => {
    const handleDismiss = async (tags: string[] | null) => {
        await onChanges(tags?.length ? tags[0] : null);
        dismissModal();
    };

    const [showModal, dismissModal] = useIonModal(TagsPage, { dismiss: handleDismiss });

    const handleSettingsButtonClick = () => {
        showModal({
            canDismiss: true,
            presentingElement: containingPage || undefined
        });
    };

    return (
        <IonButton
            onClick={handleSettingsButtonClick}
            title="Open Tags"
        >
            <IonIcon slot="icon-only" icon={pricetagOutline} />
        </IonButton>
    );
};

export default TagsButton;
