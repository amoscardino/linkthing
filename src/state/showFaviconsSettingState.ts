import { getSettings } from "api/settingsApi";
import { atom } from "recoil";

const showFaviconsSettingAtom = atom<boolean>({
    key: 'show-favicons-setting',
    default: false,
    effects: [({ setSelf, trigger }) => {
        const loadSettings = async () => {
            const settings = await getSettings();

            setSelf(settings.showFavicons || false);
        };

        if (trigger === 'get')
            loadSettings();
    }]
});

export default showFaviconsSettingAtom;
