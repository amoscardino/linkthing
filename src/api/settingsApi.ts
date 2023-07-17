import { Preferences } from '@capacitor/preferences';
import { Settings } from './types/settings';

const getSettings = async (): Promise<Settings> => {
    const instanceUrl = (await Preferences.get({ key: 'instanceUrl' })).value;
    const token = (await Preferences.get({ key: 'token' })).value;
    const disableClipboard = (await Preferences.get({ key: 'disableClipboard' })).value;
    const initialViewMode = (await Preferences.get({ key: 'initialViewMode' })).value;
    const listItemMode = (await Preferences.get({ key: 'listItemMode' })).value;
    const browserMode = (await Preferences.get({ key: 'browserMode' })).value;

    return {
        instanceUrl,
        token,
        disableClipboard: disableClipboard?.length,
        initialViewMode: initialViewMode || 'unread',
        listItemMode: listItemMode || 'default',
        browserMode: browserMode || 'in-app'
    } as Settings;
};

const saveSettings = async (settings?: Settings): Promise<void> => {
    if (!settings)
        return;

    await Preferences.set({ key: 'instanceUrl', value: settings.instanceUrl || '' });
    await Preferences.set({ key: 'token', value: settings.token || '' });
    await Preferences.set({ key: 'disableClipboard', value: settings.disableClipboard ? 'true' : '' });
    await Preferences.set({ key: 'initialViewMode', value: settings.initialViewMode?.toString() || '' });
    await Preferences.set({ key: 'listItemMode', value: settings.listItemMode?.toString() || '' });
    await Preferences.set({ key: 'browserMode', value: settings.browserMode?.toString() || '' });
};

export {
    getSettings,
    saveSettings
};
