import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTextarea,
    IonToggle,
    useIonToast
} from "@ionic/react";
import { alertOutline, checkmarkOutline, closeOutline } from "ionicons/icons";
import StandardPage from "components/StandardPage";
import { tapMedium } from "utils/haptics";
import Bookmark from "api/types/bookmark";
import Footer from "components/Footer";
import useNewBookmark from "hooks/useNewBookmark";

interface AddPageProps {
    dismiss: (anyChanges: boolean) => void;
}

const AddPage = ({ dismiss }: AddPageProps) => {
    const { bookmark, isExistingBookmark, setBookmark, saveBookmark } = useNewBookmark();
    const [showToast, dismissToast] = useIonToast();

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
            title="Add Bookmark"
            primaryButton={saveButton}
            secondaryButton={closeButton}
        >
            <IonList className="ion-padding-vertical" style={{ background: '' }}>
                <IonItem className="ion-margin-bottom">
                    <IonLabel position="stacked">
                        URL
                    </IonLabel>

                    <IonInput
                        type="url"
                        value={bookmark.url}
                        onIonChange={e => setBookmark(prev => ({ ...prev, url: e.target.value || '' } as Bookmark))}
                    />

                    {isExistingBookmark && (
                        <IonNote slot="helper" color="warning">
                            It looks like this URL matches an existing bookmark.
                            If you save this URL again, it will update the older bookmark.
                        </IonNote>
                    )}
                </IonItem>

                <IonItem className="ion-margin-bottom">
                    <IonLabel position="stacked">
                        Title
                    </IonLabel>

                    <IonInput
                        value={bookmark.title}
                        onIonChange={e => setBookmark(prev => ({ ...prev, title: e.target.value || '' } as Bookmark))}
                        placeholder={bookmark.website_title || ''}
                    />

                    <IonNote slot="helper">
                        Leave blank to use title scraped from website.
                    </IonNote>
                </IonItem>

                <IonItem className="ion-margin-bottom">
                    <IonLabel position="stacked">
                        Description
                    </IonLabel>

                    <IonTextarea
                        value={bookmark.description}
                        onIonChange={e => setBookmark(prev => ({ ...prev, description: e.target.value || '' } as Bookmark))}
                        placeholder={bookmark.website_description || ''}
                        autoGrow
                        rows={4}
                    />

                    <IonNote slot="helper">
                        Leave blank to use description scraped from website.
                    </IonNote>
                </IonItem>

                <IonItem>
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
