import Bookmark from "./bookmark";

export default interface BookmarkResult {
    count: number;
    previous: string | null;
    next: string | null;
    results: Bookmark[]
}
