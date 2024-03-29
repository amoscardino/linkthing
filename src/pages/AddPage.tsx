import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonTextarea,
    IonToggle,
    useIonModal,
    useIonToast
} from "@ionic/react";
import { alertOutline, checkmarkOutline, closeOutline, pricetagOutline } from "ionicons/icons";
import StandardPage from "components/StandardPage";
import { tapMedium } from "utils/haptics";
import Bookmark from "api/types/bookmark";
import Footer from "components/Footer";
import useNewBookmark from "hooks/useNewBookmark";
import TagsPage from "./TagsPage";
import { useRef } from "react";

interface AddPageProps {
    url: string | undefined
    dismiss: (anyChanges: boolean) => void;
}

const AddPage = ({ url, dismiss }: AddPageProps) => {
    const { bookmark, isExistingBookmark, setBookmark, saveBookmark } = useNewBookmark(url || '');
    const [showToast, dismissToast] = useIonToast();
    const pageRef = useRef<HTMLElement | null>(null);

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
        if (!bookmark.url || !bookmark.url.length || !bookmark.url.startsWith('http')) {
            await showToast({
                header: 'Missing URL',
                message: 'Cannot add a bookmark without a URL',
                icon: alertOutline,
                color: "medium",
                duration: 2000,
                buttons: [{ text: 'Ok', handler: dismissToast }]
            });
        }
        else {
            await saveBookmark();
            await tapMedium();
            dismiss(true);
        }
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
            title="Add Bookmark"
            primaryButton={saveButton}
            secondaryButton={closeButton}
        >
            <IonList className="ion-padding-vertical" style={{ background: '' }}>
                <IonItem className="ion-margin-bottom" lines={isExistingBookmark ? "none" : undefined}>
                    <IonInput
                        label="URL"
                        labelPlacement="stacked"
                        type="url"
                        value={bookmark.url}
                        onIonInput={e => setBookmark(prev => ({ ...prev, url: e.target.value || '' } as Bookmark))}
                        helperText={isExistingBookmark ? "It looks like this URL matches an existing bookmark. If you save this URL again, it will update the older bookmark." : undefined}
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

                <IonItem lines="none" className="ion-margin-bottom">
                    <IonLabel>
                        Unread?
                    </IonLabel>

                    <IonToggle
                        slot="end"
                        checked={bookmark.unread}
                        onIonChange={e => setBookmark(prev => ({ ...prev, unread: e.target.checked } as Bookmark))}
                    />
                </IonItem>

                <Footer />
            </IonList>
        </StandardPage>
    );
};

export default AddPage;
