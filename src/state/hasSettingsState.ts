import { getSettings } from "api/settingsApi";
import { atom } from "recoil";

const hasSettingsAtom = atom<Boolean | null>({
    key: 'has-settings',
    default: null,
    effects: [({ setSelf, trigger }) => {
        const loadSettings = async () => {
            const settings = await getSettings();

            setSelf(settings !== undefined && (settings.instanceUrl?.length || 0) > 0 && (settings.token?.length || 0) > 0);
        };

        if (trigger === 'get')
            loadSettings();
    }]
});

export default hasSettingsAtom;
