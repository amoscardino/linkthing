import { InputChangeEventDetail } from "@ionic/core";
import {
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote
} from "@ionic/react";
import { checkmarkOutline, closeOutline } from "ionicons/icons";
import StandardPage from "../components/StandardPage";
import { tapMedium } from "../utils/haptics";
import useSettings from "../hooks/useSettings";
import { Settings } from "../api/types/settings";

interface SettingsPageProps {
    dismiss: (anyChanges: boolean) => void;
}

const SettingsPage = ({ dismiss }: SettingsPageProps) => {
    const {
        settings,
        setSettings,
        persistSettings
    } = useSettings();

    const handleCloseButton = () => {
        dismiss(false);
    };

    const handleSaveButton = async () => {
        await persistSettings();
        await tapMedium();
        dismiss(true);
    };

    const handleInstanceUrlChange = (evt: CustomEvent<InputChangeEventDetail>) => {
        setSettings(prev => ({ ...prev, instanceUrl: evt.detail.value || '' } as Settings));
    };

    const handleTokenChange = (evt: CustomEvent<InputChangeEventDetail>) => {
        setSettings(prev => ({ ...prev, token: evt.detail.value || '' } as Settings));
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
            title="Settings"
            primaryButton={saveButton}
            secondaryButton={closeButton}
        >
            <IonList className="ion-padding-vertical" style={{ background: '' }}>
                <IonListHeader>Linkdig Settings</IonListHeader>

                <IonItem>
                    <IonLabel position="floating">
                        Instance URL
                    </IonLabel>

                    <IonInput
                        name="instanceUrl"
                        value={settings.instanceUrl}
                        inputMode="url"
                        autocapitalize="off"
                        autocorrect="off"
                        autocomplete="off"
                        onIonChange={handleInstanceUrlChange}
                    />
                </IonItem>

                <IonItem lines="none">
                    <IonNote className="ion-padding-vertical" style={{ fontSize: "75%" }}>
                        What URL you use to access Linkdig. This should start with <code>http</code> or <code>https</code>.
                    </IonNote>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">
                        API Token
                    </IonLabel>

                    <IonInput
                        name="token"
                        value={settings.token}
                        inputMode="url"
                        autocapitalize="off"
                        autocorrect="off"
                        autocomplete="off"
                        onIonChange={handleTokenChange}
                    />
                </IonItem>

                <IonItem lines="none">
                    <IonNote className="ion-padding-vertical" style={{ fontSize: "75%" }}>
                        Your REST API token from Settings &gt; Integrations.
                    </IonNote>
                </IonItem>
            </IonList>
        </StandardPage>
    );
};

export default SettingsPage;
