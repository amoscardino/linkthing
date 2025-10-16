import { CapacitorHttp } from '@capacitor/core';
import { getSettings } from "./settingsApi";
import Bookmark from "./types/bookmark";
import BookmarkCheckResult from './types/bookmarkCheckResult';
import BookmarkResult from "./types/bookmarkResult";

const PAGE_SIZE = 10;

/**
 * Gets the linkding instance URL and token from the settings.
 * @returns The linkding instance URL and token from the settings.
 */
const getLinkdingSettings = async (): Promise<{ instanceUrl?: string, token?: string, customHeaders?: Record<string, string> }> => {
    const { instanceUrl, token, customHeaders } = await getSettings();

    if (instanceUrl === undefined || token === undefined)
        throw new Error('Missing Linkdig settings. Please provide them from the Settings page.');

    // Convert custom headers array to a record
    const headersRecord: Record<string, string> = {};
    if (customHeaders && customHeaders.length > 0) {
        customHeaders.forEach(header => {
            if (header.name && header.value) {
                headersRecord[header.name] = header.value;
            }
        });
    }

    return { instanceUrl, token, customHeaders: headersRecord };
};

/**
 * Gets the bookmarks from the linkding instance.
 * @param query The query to search for.
 * @param page The page to load (0 indexed)
 * @returns The bookmarks from the linkding instance.
 */
const getBookmarks = async (query?: string, page: number = 0): Promise<BookmarkResult> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    // Add a delay to debug loading states
    // await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

    const url = new URL('api/bookmarks/', instanceUrl);
    const params = {} as any;

    if (query)
        params.q = query;

    params.limit = PAGE_SIZE.toString();
    params.offset = (page * PAGE_SIZE).toString();

    const response = await CapacitorHttp.get({
        url: url.toString(),
        params: params,
        headers: {
            'Authorization': `Token ${token}`,
            ...customHeaders
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

/**
 * Gets a bookmark from the linkding instance.
 * @param id The id of the bookmark to get.
 * @returns The bookmark from the linkding instance.
 */
const getBookmark = async (id: number): Promise<Bookmark> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    const url = new URL(`api/bookmarks/${id}/`, instanceUrl);

    const response = await CapacitorHttp.get({
        url: url.toString(),
        headers: {
            'Authorization': `Token ${token}`,
            ...customHeaders
        }
    });

    if (response.status !== 200)
        throw new Error('Unable to load bookmark');

    return response.data as Bookmark;
};

/**
 * Gets information about a URL (title, description, etc.)
 * @param urlToCheck The URL to check.
 * @returns Information about a URL (title, description, etc.)
 */
const checkUrl = async (urlToCheck: string): Promise<BookmarkCheckResult> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    const url = new URL(`api/bookmarks/check/`, instanceUrl);

    const response = await CapacitorHttp.get({
        url: url.toString(),
        params: {
            url: urlToCheck
        },
        headers: {
            'Authorization': `Token ${token}`,
            ...customHeaders
        }
    });

    if (response.status !== 200)
        throw new Error('Unable to check URL');

    return response.data as BookmarkCheckResult;
};

/**
 * Creates a bookmark in the linkding instance.
 * @param bookmark The bookmark to create.
 */
const createBookmark = async (bookmark: Bookmark): Promise<void> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    const url = new URL(`api/bookmarks/`, instanceUrl);

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
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            ...customHeaders
        }
    });
};

/**
 * Updates a bookmark in the linkding instance.
 * @param bookmark The bookmark to update.
 */
const updateBookmark = async (bookmark: Bookmark): Promise<void> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    const url = new URL(`api/bookmarks/${bookmark.id}/`, instanceUrl);

    await CapacitorHttp.patch({
        url: url.toString(),
        data: {
            title: bookmark.title,
            description: bookmark.description,
            unread: bookmark.unread,
            tag_names: bookmark.tag_names
        },
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            ...customHeaders
        }
    });
};

/**
 * Performs a patch update to toggle the unread field of a bookmark.
 * @param id The id of the bookmark to update.
 */
const updateBookmarkRead = async (id: number): Promise<void> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    const bookmark = await getBookmark(id);
    const url = new URL(`api/bookmarks/${id}/`, instanceUrl);

    await CapacitorHttp.patch({
        url: url.toString(),
        data: { unread: !bookmark.unread },
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            ...customHeaders
        }
    });
};

/**
 * Deletes a bookmark from the linkding instance.
 * @param id The id of the bookmark to delete.
 */
const deleteBookmark = async (id: number): Promise<void> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    const url = new URL(`api/bookmarks/${id}/`, instanceUrl);

    await CapacitorHttp.delete({
        url: url.toString(),
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            ...customHeaders
        }
    });
};

/**
 * Gets the tags from the linkding instance.
 * @returns The tags from the linkding instance.
 */
const getTags = async (): Promise<string[]> => {
    const { instanceUrl, token, customHeaders } = await getLinkdingSettings();

    const url = new URL(`api/tags/`, instanceUrl);

    const response = await CapacitorHttp.get({
        url: url.toString(),
        params: {
            limit: '1000'
        },
        headers: {
            'Authorization': `Token ${token}`,
            ...customHeaders
        }
    });

    if (response.status !== 200)
        throw new Error('Unable to load tags');

    return response.data?.results?.map((tag: { name: string }) => tag.name) || [];
};

export {
    getBookmarks,
    getBookmark,
    checkUrl,
    createBookmark,
    updateBookmark,
    updateBookmarkRead,
    deleteBookmark,
    getTags
};
