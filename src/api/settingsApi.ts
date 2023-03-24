import { Preferences } from '@capacitor/preferences';
import { Settings } from './types/settings';

const getSettings = async (): Promise<Settings> => {
    const instanceUrl = (await Preferences.get({ key: 'instanceUrl' })).value;
    const token = (await Preferences.get({ key: 'token' })).value;
    const disableClipboard = (await Preferences.get({ key: 'disableClipboard' })).value;

    const settings = { instanceUrl, token, disableClipboard: disableClipboard?.length } as Settings;

    return settings;
};

const saveSettings = async (settings?: Settings): Promise<void> => {
    if (!settings)
        return;

    await Preferences.set({ key: 'instanceUrl', value: settings.instanceUrl || '' });
    await Preferences.set({ key: 'token', value: settings.token || '' });
    await Preferences.set({ key: 'disableClipboard', value: settings.disableClipboard ? 'true' : '' });
};

export {
    getSettings,
    saveSettings
};
