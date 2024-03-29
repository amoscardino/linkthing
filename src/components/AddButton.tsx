import { IonButton, IonIcon, useIonModal } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import AddPage from "pages/AddPage";

interface AddButtonProps {
    containingPage: HTMLElement | null;
    onChanges: () => Promise<void>;
}

const AddButton = ({ containingPage, onChanges }: AddButtonProps) => {
    const handleNewModalDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await onChanges();

        dismissNewModal();
    };

    const [showNewModal, dismissNewModal] = useIonModal(AddPage, { dismiss: handleNewModalDismiss });

    const handleAddButtonClick = () => {
        showNewModal({
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
