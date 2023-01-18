import { useQuery } from "@tanstack/react-query";
import { getBookmarks } from 'api/linkdigApi';
import Bookmark from "api/types/bookmark";
import { QueryResult } from "types/results";

interface UseBookmarksResult extends QueryResult {
    bookmarks?: Bookmark[];
    refresh: () => Promise<void>;
}

const useBookmarks = (query?: string): UseBookmarksResult => {
    const {
        data,
        isSuccess,
        isLoading,
        isError,
        refetch
    } = useQuery(['bookmarks', query], () => getBookmarks(query));

    const refresh = async () => {
        await refetch();
    };

    return {
        bookmarks: data,
        isSuccess,
        isLoading,
        isError,
        refresh
    } as UseBookmarksResult;
};

export default useBookmarks;
