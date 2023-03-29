import { IonButton, IonIcon, useIonModal } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import AddPage from "pages/AddPage";

interface AddButtonProps {
    containingPage: HTMLElement | null;
    onChanges: () => Promise<void>;
}

const AddButton = ({ containingPage, onChanges }: AddButtonProps) => {
    const handleDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await onChanges();

        dismissModal();
    };

    const [showModal, dismissModal] = useIonModal(AddPage, { dismiss: handleDismiss });

    const handleAddButtonClick = () => {
        showModal({
            canDismiss: true,
            presentingElement: containingPage || undefined
        });
    };

    return (
        <IonButton
            onClick={handleAddButtonClick}
            title="Add Bookmark"
        >
            <IonIcon slot="icon-only" icon={addOutline} />
        </IonButton>
    );
};

export default AddButton;
