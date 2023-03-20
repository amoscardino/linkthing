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
import StandardPage from "components/StandardPage";
import { tapMedium } from "utils/haptics";
import useSettings from "hooks/useSettings";
import { Settings } from "api/types/settings";
import Footer from "components/Footer";

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
                <IonListHeader>
                    Linkding Settings
                </IonListHeader>

                <IonItem>
                    <IonLabel position="stacked">
                        Instance URL
                    </IonLabel>

                    <IonInput
                        name="instanceUrl"
                        value={settings?.instanceUrl}
                        inputMode="url"
                        autocapitalize="off"
                        autocorrect="off"
                        autocomplete="off"
                        onIonChange={handleInstanceUrlChange}
                    />

                    <IonNote slot="helper" className="ion-margin-bottom">
                        What URL you use to access Linkdig. This should start with <code>http</code> or <code>https</code>.
                    </IonNote>
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">
                        API Token
                    </IonLabel>

                    <IonInput
                        name="token"
                        value={settings?.token}
                        inputMode="url"
                        autocapitalize="off"
                        autocorrect="off"
                        autocomplete="off"
                        onIonChange={handleTokenChange}
                    />

                    <IonNote slot="helper">
                        Your REST API token from Settings &gt; Integrations.
                    </IonNote>
                </IonItem>

                <IonListHeader className="ion-margin-top ion-padding-top">
                    About LinkThing
                </IonListHeader>

                <IonItem>
                    <IonLabel>
                        {`Version ${process.env.REACT_APP_VERSION}`}
                    </IonLabel>
                </IonItem>

                <IonItem>
                    <IonLabel>
                        {`© ${new Date().getFullYear()} Andrew Moscardino`}
                    </IonLabel>
                </IonItem>

                <IonItem href="https://moscardino.net" target="_blank">
                    <IonLabel>
                        moscardino.net
                    </IonLabel>
                </IonItem>

                <Footer />
            </IonList>
        </StandardPage >
    );
};

export default SettingsPage;
