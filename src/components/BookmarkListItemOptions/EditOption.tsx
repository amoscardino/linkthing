import { IonIcon, IonItemOption, useIonModal } from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import EditPage from "pages/EditPage";

interface EditOptionProps {
    id: number;
    listRefresh: () => Promise<void>;
    slidingRef: React.MutableRefObject<HTMLIonItemSlidingElement | null>;
    containingPage: HTMLElement | null;
}

const EditOption = ({ id, listRefresh, slidingRef, containingPage }: EditOptionProps) => {
    const handleEdiModalDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await listRefresh();

        dismissEditModal();
        await slidingRef.current?.close();
    };

    const [showEditModal, dismissEditModal] = useIonModal(EditPage, { id, dismiss: handleEdiModalDismiss });


    const handleEditOptionClick = async () => {
        showEditModal({
            canDismiss: true,
            presentingElement: containingPage || undefined
        });
        await slidingRef.current?.close();
    };

    return (
        <IonItemOption
            color="secondary"
            onClick={handleEditOptionClick}
        >
            <IonIcon slot="start" icon={pencilOutline} />
            Edit
        </IonItemOption>
    );
};

export default EditOption;
