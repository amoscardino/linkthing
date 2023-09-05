import Bookmark from "api/types/bookmark";

const getBookmarkTitle = (bookmark: Bookmark) => {
    return bookmark.title || bookmark.website_title || bookmark.url;
};

const getBookmarkDescription = (bookmark: Bookmark) => {
    return bookmark.description || bookmark.website_description || '';
};

export {
    getBookmarkTitle,
    getBookmarkDescription
}
