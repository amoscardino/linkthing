import { Preferences } from '@capacitor/preferences';
import { Settings } from './types/settings';

const getSettings = async (): Promise<Settings> => {
    const instanceUrl = (await Preferences.get({ key: 'instanceUrl' })).value;
    const token = (await Preferences.get({ key: 'token' })).value;

    const settings = { instanceUrl, token } as Settings;

    return settings;
};

const saveSettings = async (settings: Settings): Promise<void> => {
    await Preferences.set({ key: 'instanceUrl', value: settings.instanceUrl || '' });
    await Preferences.set({ key: 'token', value: settings.token || '' });
};

export {
    getSettings,
    saveSettings
};
