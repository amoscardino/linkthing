import { getSettings } from "api/settingsApi";
import { atom } from "recoil";
import { BrowserMode } from "types/browserMode";

const browserSettingAtom = atom<BrowserMode>({
    key: 'browser-setting',
    default: null,
    effects: [({ setSelf, trigger }) => {
        const loadSettings = async () => {
            const settings = await getSettings();

            setSelf(settings.browserMode || null);
        };

        if (trigger === 'get')
            loadSettings();
    }]
});

export default browserSettingAtom;
