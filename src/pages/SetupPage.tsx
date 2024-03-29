import { InputChangeEventDetail } from "@ionic/core";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonList
} from "@ionic/react";
import StandardPage from "components/StandardPage";
import { tapMedium } from "utils/haptics";
import useSettings from "hooks/useSettings";
import { Settings } from "api/types/settings";
import logoHeader from 'assets/logoHeader.png';
import StandardColumn from "components/StandardColumn";
import { checkmark } from "ionicons/icons";
import Footer from "components/Footer";

const SetupPage = () => {
    const {
        settings,
        setSettings,
        persistSettings
    } = useSettings();
    const settingsAreValid = (settings?.instanceUrl?.length || 0) > 0
        && settings?.instanceUrl?.startsWith('http')
        && (settings.token?.length || 0) > 0;

    const handleSaveButton = async () => {
        await persistSettings();
        await tapMedium();
    };

    const handleInstanceUrlChange = (evt: CustomEvent<InputChangeEventDetail>) => {
        setSettings(prev => ({ ...prev, instanceUrl: evt.detail.value || '' } as Settings));
    };

    const handleTokenChange = (evt: CustomEvent<InputChangeEventDetail>) => {
        setSettings(prev => ({ ...prev, token: evt.detail.value || '' } as Settings));
    };

    return (
        <StandardPage title="Welcome!">
            <StandardColumn>
                <IonCard>
                    <IonImg src={logoHeader} />

                    <IonCardHeader>
                        <IonCardTitle>Welcome to LinkThing!</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        To use LinkThing, you need to have an instance of <a href="https://github.com/sissbruecker/linkding/" target="_blank" rel="noreferrer noopener">linkding</a> and a user account on that instance. Enter your instance information below to get started.
                    </IonCardContent>

                    <IonList>
                        <IonItem lines="none" className="ion-padding-bottom">
                            <IonInput
                                label="Instance URL"
                                labelPlacement="stacked"
                                value={settings?.instanceUrl}
                                inputMode="url"
                                autocapitalize="off"
                                autocorrect="off"
                                autocomplete="off"
                                onIonInput={handleInstanceUrlChange}
                                helperText="What URL you use to access Linkding. This should start with http or https."
                            />
                        </IonItem>

                        <IonItem lines="none" className="ion-padding-bottom">
                            <IonInput
                                label="API Token"
                                labelPlacement="stacked"
                                name="token"
                                value={settings?.token}
                                inputMode="url"
                                autocapitalize="off"
                                autocorrect="off"
                                autocomplete="off"
                                onIonInput={handleTokenChange}
                                helperText="Your REST API token from Settings > Integrations."
                            />
                        </IonItem>
                    </IonList>

                    <div className="ion-padding ion-text-center">
                        <IonButton
                            expand="block"
                            shape="round"
                            onClick={handleSaveButton}
                            disabled={!settingsAreValid}
                        >
                            <IonIcon slot="start" icon={checkmark} />
                            Get Started
                        </IonButton>
                    </div>
                </IonCard>

                <Footer />
            </StandardColumn>
        </StandardPage >
    );
};

export default SetupPage;
