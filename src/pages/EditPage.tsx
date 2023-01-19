import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTextarea,
    IonToggle
} from "@ionic/react";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
import StandardPage from "components/StandardPage";
import { tapMedium } from "utils/haptics";
import useBookmark from "hooks/useBookmark";
import Bookmark from "api/types/bookmark";

interface EditPageProps {
    id: number;
    dismiss: (anyChanges: boolean) => void;
}

const EditPage = ({ id, dismiss }: EditPageProps) => {
    const { bookmark, setBookmark, saveBookmark } = useBookmark(id);

    const handleCloseButton = () => {
        dismiss(false);
    };

    const handleSaveButton = async () => {
        await saveBookmark();
        await tapMedium();
        dismiss(true);
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
            title="Edit Bookmark"
            primaryButton={saveButton}
            secondaryButton={closeButton}
        >
            <IonList className="ion-padding-vertical" style={{ background: '' }}>
                <IonItem className="ion-margin-bottom">
                    <IonLabel position="stacked">
                        URL
                    </IonLabel>

                    <IonInput
                        name="url"
                        value={bookmark.url}
                        disabled
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">
                        Title
                    </IonLabel>

                    <IonInput
                        value={bookmark.title}
                        onIonChange={e => setBookmark(prev => ({ ...prev, title: e.target.value || '' } as Bookmark))}
                    />

                    <IonNote slot="helper" className="ion-margin-bottom">
                        Leave blank to use title scraped from website.
                    </IonNote>
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">
                        Description
                    </IonLabel>

                    <IonTextarea
                        autoGrow
                        value={bookmark.description}
                        onIonChange={e => setBookmark(prev => ({ ...prev, description: e.target.value || '' } as Bookmark))}
                    />

                    <IonNote slot="helper" className="ion-margin-bottom">
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
            </IonList>
        </StandardPage>
    );
};

export default EditPage;
