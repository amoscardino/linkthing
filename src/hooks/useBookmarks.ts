import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarks } from 'api/linkdigApi';
import Bookmark from "api/types/bookmark";
import { QueryResult } from "types/results";
import queryClient from "utils/queryClient";

interface UseBookmarksResult extends QueryResult {
    bookmarks?: Bookmark[];
    refresh: () => Promise<void>;
    canLoadMore: boolean;
    loadMore: () => Promise<void>;
}

const useBookmarks = (unread: boolean): UseBookmarksResult => {
    const queryKey = ['bookmarks', unread];
    const query = unread ? '!unread' : undefined;

    const {
        data,
        isSuccess,
        isLoading,
        isError,
        refetch,
        hasNextPage: canLoadMore,
        fetchNextPage,
    } = useInfiniteQuery({
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
        isSuccess,
        isLoading,
        isError,
        refresh,
        canLoadMore,
        loadMore
    } as UseBookmarksResult;
};

export default useBookmarks;
