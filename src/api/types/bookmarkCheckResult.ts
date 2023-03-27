import Bookmark from "./bookmark";
import BookmarkCheckMetadata from "./bookmarkCheckMetadata";

export default interface BookmarkCheckResult {
    bookmark: Bookmark | null;
    metadata: BookmarkCheckMetadata;
}
