import { getSettings } from "api/settingsApi";
import { atom } from "recoil";
import { ItemMode } from "types/itemMode";

const listItemSettingAtom = atom<ItemMode>({
    key: 'list-item-mode-setting',
    default: null,
    effects: [({ setSelf, trigger }) => {
        const loadSettings = async () => {
            const settings = await getSettings();

            setSelf(settings.listItemMode || null);
        };

        if (trigger === 'get')
            loadSettings();
    }]
});

export default listItemSettingAtom;
