import { CapacitorHttp } from '@capacitor/core';
import { getSettings } from "./settingsApi";
import Bookmark from "./types/bookmark";
import BookmarkResult from "./types/bookmarkResult";

const PAGE_SIZE = 10;

const getBookmarks = async (query?: string, page: number = 0): Promise<BookmarkResult> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    // Add a delay to debug loading states
    // await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const url = new URL('api/bookmarks/', settings.instanceUrl);
    const params = new URLSearchParams();

    if (query)
        params.append('q', query);

    params.append('limit', PAGE_SIZE.toString());
    params.append('offset', (page * PAGE_SIZE).toString());

    url.search = params.toString();

    const response = await CapacitorHttp.get({
        url: url.toString(),
        headers: {
            'Authorization': `Token ${settings.token}`
        }
    });

    if (response.status !== 200)
        throw new Error('Unable to load bookmarks');

    return {
        prevPage: response.data.previous ? page - 1 : undefined,
        nextPage: response.data.next ? page + 1 : undefined,
        results: response.data.results as Bookmark[]
    };
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

const updateBookmark = async (bookmark: Bookmark): Promise<void> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    const url = new URL(`api/bookmarks/${bookmark.id}/`, settings.instanceUrl);

    await CapacitorHttp.patch({
        url: url.toString(),
        data: {
            title: bookmark.title,
            description: bookmark.description,
            unread: bookmark.unread
        },
        headers: {
            'Authorization': `Token ${settings.token}`,
            'Content-Type': 'application/json'
        }
    });
};

export {
    getBookmarks,
    getBookmark,
    toggleBookmarkRead,
    updateBookmark
};
