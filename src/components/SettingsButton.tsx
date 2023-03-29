import { IonButton, IonIcon, useIonModal } from "@ionic/react";
import { settingsOutline } from "ionicons/icons";
import SettingsPage from "pages/SettingsPage";

interface SettingsButtonProps {
    containingPage: HTMLElement | null;
    onChanges: () => Promise<void>;
}

const SettingsButton = ({ containingPage, onChanges }: SettingsButtonProps) => {
    const handleDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await onChanges();

        dismissModal();
    };

    const [showModal, dismissModal] = useIonModal(SettingsPage, { dismiss: handleDismiss });

    const handleSettingsButtonClick = () => {
        showModal({
            canDismiss: true,
            presentingElement: containingPage || undefined
        });
    };

    return (
        <IonButton
            onClick={handleSettingsButtonClick}
            title="Open Settings"
        >
            <IonIcon slot="icon-only" icon={settingsOutline} />
        </IonButton>
    );
};

export default SettingsButton;
