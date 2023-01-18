import Bookmark from "./bookmark";

export default interface BookmarkResult {
    prevPage?: number;
    nextPage?: number;
    results: Bookmark[]
}
