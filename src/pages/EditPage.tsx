import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonTextarea,
    IonToggle,
    useIonAlert,
    useIonModal
} from "@ionic/react";
import { checkmarkOutline, closeOutline, pricetagOutline, trashOutline } from "ionicons/icons";
import StandardPage from "components/StandardPage";
import { tapHeavy, tapMedium } from "utils/haptics";
import useBookmark from "hooks/useBookmark";
import Bookmark from "api/types/bookmark";
import Footer from "components/Footer";
import { useRef } from "react";
import TagsPage from "./TagsPage";

interface EditPageProps {
    id: number;
    dismiss: (anyChanges: boolean) => void;
}

const EditPage = ({ id, dismiss }: EditPageProps) => {
    const { bookmark, setBookmark, saveBookmark, removeBookmark } = useBookmark(id);
    const pageRef = useRef<HTMLElement | null>(null);
    const [showDeleteAlert] = useIonAlert();

    const handleTagDismiss = (newTags: string[] | null) => {
        if (newTags !== null)
            setBookmark(prev => ({ ...prev, tag_names: [...newTags] }));

        hideTagModal();
    };

    const [showTagModal, hideTagModal] = useIonModal(TagsPage, {
        dismiss: handleTagDismiss,
        selected: bookmark.tag_names || [],
        multipleSelection: true
    });

    const handleCloseButton = () => {
        dismiss(false);
    };

    const handleSaveButton = async () => {
        await saveBookmark();
        await tapMedium();
        dismiss(true);
    };

    const handleDeleteButton = async () => {
        await showDeleteAlert({
            header: "Delete Bookmark?",
            message: "Are you sure you want to delete this bookmark? This is a permanent action.",
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: "Delete",
                role: "destructive",
                handler: async () => {
                    await removeBookmark();
                    await tapHeavy();
                    dismiss(true);
                }
            }]
        })
    };

    const closeButton = (
        <IonButton onClick={handleCloseButton} title="Cancel">
            <IonIcon slot="icon-only" icon={closeOutline} />
        </IonButton>
    );

    const saveButton = (
        <IonButton onClick={handleSaveButton} title="Save">
            <IonIcon slot="icon-only" icon={checkmarkOutline} />
        </IonButton>
    );

    return (
        <StandardPage
            ref={pageRef}
            title="Edit Bookmark"
            primaryButton={saveButton}
            secondaryButton={closeButton}
        >
            <IonList className="ion-padding-vertical" style={{ background: '' }}>
                <IonItem lines="none" className="ion-margin-bottom">
                    <IonInput
                        label="URL"
                        labelPlacement="stacked"
                        name="url"
                        value={bookmark.url}
                        disabled
                    />
                </IonItem>

                <IonItem lines="none" className="ion-margin-bottom">
                    <IonInput
                        label="Tags"
                        labelPlacement="stacked"
                        value={bookmark.tag_names?.join(' ') || ''}
                        onIonInput={e => setBookmark(prev => ({ ...prev, tag_names: (e.target.value || '').toString().split(' ') } as Bookmark))}
                        helperText="Separate with spaces. Do not prefix with #."
                    />

                    <IonIcon
                        slot="end"
                        icon={pricetagOutline}
                        color="primary"
                        onClick={() => showTagModal({
                            presentingElement: pageRef.current || undefined,
                            canDismiss: true
                        })}
                    />
                </IonItem>

                <IonItem lines="none" className="ion-margin-bottom">
                    <IonInput
                        label="Title"
                        labelPlacement="stacked"
                        value={bookmark.title}
                        onIonInput={e => setBookmark(prev => ({ ...prev, title: e.target.value || '' } as Bookmark))}
                        placeholder={bookmark.website_title || ''}
                        helperText="Leave blank to use title scraped from website."
                    />
                </IonItem>

                <IonItem lines="none" className="ion-margin-bottom">
                    <IonTextarea
                        label="Description"
                        labelPlacement="stacked"
                        value={bookmark.description}
                        onIonInput={e => setBookmark(prev => ({ ...prev, description: e.target.value || '' } as Bookmark))}
                        placeholder={bookmark.website_description || ''}
                        autoGrow
                        rows={4}
                        helperText="Leave blank to use description scraped from website."
                    />
                </IonItem>

                <IonItem className="ion-margin-bottom">
                    <IonLabel>
                        Unread?
                    </IonLabel>

                    <IonToggle
                        slot="end"
                        checked={bookmark.unread}
                        onIonChange={e => setBookmark(prev => ({ ...prev, unread: e.target.checked } as Bookmark))}
                    />
                </IonItem>

                <IonItem className="ion-margin-top" lines="none">
                    <IonLabel className="ion-margin-top ion-padding-top ion-text-center">
                        <IonButton
                            shape="round"
                            color="danger"
                            size="small"
                            onClick={handleDeleteButton}
                        >
                            <IonIcon slot="start" icon={trashOutline} />
                            Delete
                        </IonButton>
                    </IonLabel>
                </IonItem>

                <Footer />
            </IonList>
        </StandardPage>
    );
};

export default EditPage;
