import { useEffect, useRef, useState } from "react";
import useViewMode from "./useViewMode";
import useBookmarks, { UseBookmarksResult } from "./useBookmarks";
import useAddNewUrl from "./useAddNewUrl";
import { ViewMode } from "types/viewMode";

interface UseBookmarksListResult {
    pageRef: React.MutableRefObject<HTMLElement | null>;
    searchbarRef: React.MutableRefObject<HTMLIonSearchbarElement | null>;
    viewMode: ViewMode;
    setViewMode: (value: React.SetStateAction<ViewMode>) => void;
    showSearch: boolean;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    bookmarksResult: UseBookmarksResult;
}

const useBookmarksList = (): UseBookmarksListResult => {
    const pageRef = useRef<HTMLElement | null>(null);
    const searchbarRef = useRef<HTMLIonSearchbarElement | null>(null);
    const { viewMode, setViewMode } = useViewMode();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const bookmarksResult = useBookmarks(showSearch, viewMode, searchQuery);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (showSearch)
                await searchbarRef.current?.setFocus();
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [showSearch]);

    useAddNewUrl(pageRef.current, bookmarksResult.refresh);

    return {
        pageRef,
        searchbarRef,
        viewMode,
        setViewMode,
        showSearch,
        setShowSearch,
        searchQuery,
        setSearchQuery,
        bookmarksResult
    };
};

export default useBookmarksList;
