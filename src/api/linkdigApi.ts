import { CapacitorHttp } from '@capacitor/core';
import { getSettings } from "./settingsApi";
import Bookmark from "./types/bookmark";
import BookmarkCheckResult from './types/bookmarkCheckResult';
import BookmarkResult from "./types/bookmarkResult";

const PAGE_SIZE = 10;

const getBookmarks = async (query?: string, page: number = 0): Promise<BookmarkResult> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    // Add a delay to debug loading states
    // await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const url = new URL('api/bookmarks/', settings.instanceUrl);
    const params = {} as any;

    if (query)
        params.q = query;

    params.limit = PAGE_SIZE.toString();
    params.offset = (page * PAGE_SIZE).toString();

    const response = await CapacitorHttp.get({
        url: url.toString(),
        params: params,
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

const checkUrl = async (urlToCheck: string): Promise<BookmarkCheckResult> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    const url = new URL(`api/bookmarks/check/`, settings.instanceUrl);

    const response = await CapacitorHttp.get({
        url: url.toString(),
        params: {
            url: urlToCheck
        },
        headers: {
            'Authorization': `Token ${settings.token}`
        }
    });

    if (response.status !== 200)
        throw new Error('Unable to check URL');

    return response.data as BookmarkCheckResult;
};

const createBookmark = async (bookmark: Bookmark): Promise<void> => {
    const settings = await getSettings();

    if (settings.instanceUrl === undefined || settings.token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    const url = new URL(`api/bookmarks/`, settings.instanceUrl);

    await CapacitorHttp.post({
        url: url.toString(),
        data: {
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description,
            unread: bookmark.unread,
            tag_names: bookmark.tag_names
        },
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
            unread: bookmark.unread,
            tag_names: bookmark.tag_names
        },
        headers: {
            'Authorization': `Token ${settings.token}`,
            'Content-Type': 'application/json'
        }
    });
};

const updateBookmarkRead = async (id: number): Promise<void> => {
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
    checkUrl,
    createBookmark,
    updateBookmark,
    updateBookmarkRead
};
