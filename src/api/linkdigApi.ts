import { isPlatform } from '@ionic/react';
import { CapacitorHttp } from '@capacitor/core';
import { getSettings } from "./settingsApi";
import Bookmark from "./types/bookmark";
import BookmarkResult from "./types/bookmarkResult";

const getBookmarks = async (query?: string): Promise<Bookmark[]> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    if (!isPlatform('ios') && !isPlatform('android'))
        settings.instanceUrl = 'http://localhost:8010';

    const url = new URL('api/bookmarks', settings.instanceUrl);

    if (query)
        url.search = new URLSearchParams({ q: query }).toString();

    const response = await CapacitorHttp.get({
        url: url.toString(),
        headers: {
            'Authorization': `Token ${settings.token}`
        }
    });

    return (response.data as BookmarkResult).results;
};

export {
    getBookmarks
};
