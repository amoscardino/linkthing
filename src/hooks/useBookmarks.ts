import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarks } from 'api/linkdigApi';
import Bookmark from "api/types/bookmark";
import { QueryResult } from "types/results";
import { ViewMode } from "types/viewMode";

interface UseBookmarksResult extends QueryResult {
    bookmarks?: Bookmark[];
    enabled: boolean;
    refresh: () => Promise<void>;
    canLoadMore: boolean;
    loadMore: () => Promise<void>;
}

const useBookmarks = (search: boolean, viewMode: ViewMode, searchQuery: string): UseBookmarksResult => {
    const query = search ? searchQuery : viewMode === 'unread' ? '!unread' : undefined;
    const queryKey = ['bookmarks', query];

    const {
        data,
        isSuccess,
        isLoading,
        isError,
        refetch,
        hasNextPage: canLoadMore,
        fetchNextPage,
    } = useInfiniteQuery({
        enabled: viewMode !== null,
        queryKey: queryKey,
        queryFn: ({ pageParam = 0 }) => getBookmarks(query, pageParam),
        getNextPageParam: lastPage => lastPage.nextPage,
        getPreviousPageParam: lastPage => lastPage.prevPage
    });

    const refresh = async () => {
        await refetch();
    };

    const loadMore = async () => {
        await fetchNextPage();
    };

    return {
        bookmarks: data?.pages.flatMap(page => page.results),
        enabled: viewMode !== null,
        isSuccess,
        isLoading,
        isError,
        refresh,
        canLoadMore,
        loadMore
    } as UseBookmarksResult;
};

export default useBookmarks;
