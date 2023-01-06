import { CapacitorHttp } from '@capacitor/core';
import { getSettings } from "./settingsApi";
import Bookmark from "./types/bookmark";
import BookmarkResult from "./types/bookmarkResult";

const getBookmarks = async (query?: string): Promise<Bookmark[]> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    const url = new URL('api/bookmarks', settings.instanceUrl);

    if (query)
        url.search = new URLSearchParams({ q: query }).toString();

    const response = await CapacitorHttp.get({
        url: url.toString(),
        headers: {
            'Authorization': `Token ${settings.token}`
        }
    });

    if (response.status !== 200)
        throw new Error('Unable to load bookmarks');

    return (response.data as BookmarkResult).results;
};

const getBookmark = async (id: number): Promise<Bookmark> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    const url = new URL(`api/bookmarks/${id}/`, settings.instanceUrl);

    const response = await CapacitorHttp.get({
        url: url.toString(),
        headers: {
            'Authorization': `Token ${settings.token}`
        }
    });

    if (response.status !== 200)
        throw new Error('Unable to load bookmark');

    return response.data as Bookmark;
};

const toggleBookmarkRead = async (id: number): Promise<void> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    const bookmark = await getBookmark(id);
    const url = new URL(`api/bookmarks/${id}/`, settings.instanceUrl);

    await CapacitorHttp.patch({
        url: url.toString(),
        data: { unread: !bookmark.unread },
        headers: {
            'Authorization': `Token ${settings.token}`,
            'Content-Type': 'application/json'
        }
    });
};

export {
    getBookmarks,
    getBookmark,
    toggleBookmarkRead
};
