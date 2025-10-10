import { Preferences } from '@capacitor/preferences';
import { Settings } from './types/settings';

/**
 * Gets the settings from device preferences.
 * @returns The settings from device preferences.
 */
const getSettings = async (): Promise<Settings> => {
    const instanceUrl = (await Preferences.get({ key: 'instanceUrl' })).value;
    const token = (await Preferences.get({ key: 'token' })).value;
    const disableClipboard = (await Preferences.get({ key: 'disableClipboard' })).value;
    const initialViewMode = (await Preferences.get({ key: 'initialViewMode' })).value;
    const listItemMode = (await Preferences.get({ key: 'listItemMode' })).value;
    const browserMode = (await Preferences.get({ key: 'browserMode' })).value;
    const showFavicons = (await Preferences.get({ key: 'showFavicons' })).value;
    const customHeaders = (await Preferences.get({ key: 'customHeaders' })).value;

    return {
        instanceUrl,
        token,
        disableClipboard: disableClipboard?.length,
        initialViewMode: initialViewMode || 'unread',
        listItemMode: listItemMode || 'description',
        browserMode: browserMode || 'in-app',
        showFavicons: showFavicons === 'true',
        customHeaders: customHeaders ? JSON.parse(customHeaders) : []
    } as Settings;
};

/**
 * Saves the settings to device preferences.
 * @param settings The settings to save.
 * @returns A promise that resolves when the settings have been saved.
 */
const saveSettings = async (settings?: Settings): Promise<void> => {
    if (!settings)
        return;

    await Preferences.set({ key: 'instanceUrl', value: settings.instanceUrl || '' });
    await Preferences.set({ key: 'token', value: settings.token || '' });
    await Preferences.set({ key: 'disableClipboard', value: settings.disableClipboard ? 'true' : '' });
    await Preferences.set({ key: 'initialViewMode', value: settings.initialViewMode?.toString() || '' });
    await Preferences.set({ key: 'listItemMode', value: settings.listItemMode?.toString() || '' });
    await Preferences.set({ key: 'browserMode', value: settings.browserMode?.toString() || '' });
    await Preferences.set({ key: 'showFavicons', value: settings.showFavicons ? 'true' : 'false' });
    await Preferences.set({ key: 'customHeaders', value: JSON.stringify(settings.customHeaders || []) });
};

export {
    getSettings,
    saveSettings
};
