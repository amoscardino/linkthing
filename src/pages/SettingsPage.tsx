import { InputChangeEventDetail, SelectChangeEventDetail, ToggleChangeEventDetail } from "@ionic/core";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonToggle
} from "@ionic/react";
import { addOutline, checkmarkOutline, closeOutline, helpCircleOutline, trashOutline } from "ionicons/icons";
import StandardPage from "components/StandardPage";
import { tapMedium } from "utils/haptics";
import useSettings from "hooks/useSettings";
import { CustomHeader, Settings } from "api/types/settings";
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

  const handleClipboardChange = (evt: CustomEvent<ToggleChangeEventDetail>) => {
    const checked = evt.detail.checked;
    setSettings(prev => ({ ...prev, disableClipboard: !checked } as Settings));
  };

  const handleInitialViewModeChange = (evt: CustomEvent<SelectChangeEventDetail>) => {
    setSettings(prev => ({ ...prev, initialViewMode: evt.detail.value || 'unread' } as Settings));
  };

  const handleListItemModeChange = (evt: CustomEvent<SelectChangeEventDetail>) => {
    setSettings(prev => ({ ...prev, listItemMode: evt.detail.value || 'description' } as Settings));
  };

  const handleBrowserModeChange = (evt: CustomEvent<SelectChangeEventDetail>) => {
    setSettings(prev => ({ ...prev, browserMode: evt.detail.value || 'in-app' } as Settings));
  };

  const handleShowFaviconsChange = (evt: CustomEvent<ToggleChangeEventDetail>) => {
    setSettings(prev => ({ ...prev, showFavicons: evt.detail.checked } as Settings));
  };

  const handleAddHeader = () => {
    const newHeader: CustomHeader = {
      id: crypto.randomUUID(),
      name: '',
      value: ''
    };
    setSettings(prev => ({
      ...prev,
      customHeaders: [...(prev?.customHeaders || []), newHeader]
    } as Settings));
  };

  const handleRemoveHeader = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customHeaders: (prev?.customHeaders || []).filter(header => header.id !== id)
    } as Settings));
  };

  const handleHeaderNameChange = (id: string, name: string) => {
    setSettings(prev => {
      const headers = [...(prev?.customHeaders || [])];
      const header = headers.find(h => h.id === id);
      if (header) {
        header.name = name;
      }
      return { ...prev, customHeaders: headers } as Settings;
    });
  };

  const handleHeaderValueChange = (id: string, value: string) => {
    setSettings(prev => {
      const headers = [...(prev?.customHeaders || [])];
      const header = headers.find(h => h.id === id);
      if (header) {
        header.value = value;
      }
      return { ...prev, customHeaders: headers } as Settings;
    });
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

        <IonItem lines="none" className="ion-margin-bottom">
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

        <IonItem lines="none" className="ion-margin-bottom">
          <IonInput
            label="API Token"
            labelPlacement="stacked"
            value={settings?.token}
            inputMode="url"
            autocapitalize="off"
            autocorrect="off"
            autocomplete="off"
            onIonInput={handleTokenChange}
            helperText="Your REST API token from Settings > Integrations."
          />
        </IonItem>

        <IonListHeader>
          Custom Request Headers (optional)
        </IonListHeader>

        {(settings?.customHeaders || []).map(header => (
          <div key={header.id}>
            <IonItem lines="none">
              <IonInput
                label="Header Name"
                labelPlacement="stacked"
                value={header.name}
                autocapitalize="off"
                autocorrect="off"
                autocomplete="off"
                onIonInput={(e) => handleHeaderNameChange(header.id, e.detail.value || '')}
                helperText="e.g., X-Custom-Header"
              />
            </IonItem>
            <IonItem lines="none" className="ion-padding-bottom">
              <IonInput
                label="Header Value"
                labelPlacement="stacked"
                value={header.value}
                autocapitalize="off"
                autocorrect="off"
                autocomplete="off"
                onIonInput={(e) => handleHeaderValueChange(header.id, e.detail.value || '')}
                helperText="e.g., custom-value"
              />
              <IonButton
                slot="end"
                fill="clear"
                onClick={() => handleRemoveHeader(header.id)}
                title="Remove Header"
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonItem>
          </div>
        ))}

        <IonItem lines="none">
          <div className="ion-text-end ion-flex-grow-1">
            <IonButton
              fill="outline"
              onClick={handleAddHeader}
            >
              <IonIcon slot="start" icon={addOutline} />
              Add Custom Header
            </IonButton>
          </div>
        </IonItem>

        <IonListHeader className="ion-margin-top ion-padding-top">
          App Settings
        </IonListHeader>

        <IonItem>
          <IonSelect
            label="Browser"
            value={settings?.browserMode || 'in-app'}
            onIonChange={handleBrowserModeChange}
            interface="popover"
          >
            <IonSelectOption value="in-app">In-App Browser</IonSelectOption>
            <IonSelectOption value="external">External Browser</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonSelect
            label="Initial View Mode"
            value={settings?.initialViewMode || 'unread'}
            onIonChange={handleInitialViewModeChange}
            interface="popover"
          >
            <IonSelectOption value="unread">Unread</IonSelectOption>
            <IonSelectOption value="all">All</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonSelect
            label="List Item Display"
            value={settings?.listItemMode || 'description'}
            onIonChange={handleListItemModeChange}
            interface="popover"
          >
            <IonSelectOption value="description">Description</IonSelectOption>
            <IonSelectOption value="tags">Tags</IonSelectOption>
            <IonSelectOption value="both">Both</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonToggle checked={!settings?.disableClipboard} onIonChange={handleClipboardChange}>
            Enable Clipboard Detection
          </IonToggle>
        </IonItem>

        <IonItem lines="none" className="ion-margin-bottom">
          <IonToggle
            checked={settings?.showFavicons || false}
            onIonChange={handleShowFaviconsChange}
          >
            Show Favicons
          </IonToggle>

          <IonIcon id="FaviconHelpIcon" icon={helpCircleOutline} slot="start" />
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

      <IonPopover trigger="FaviconHelpIcon" triggerAction="click">
        <IonContent class="ion-padding">Requires linkding 1.31 or later.</IonContent>
      </IonPopover>
    </StandardPage >
  );
};

export default SettingsPage;
