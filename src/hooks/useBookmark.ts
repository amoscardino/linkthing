import { SetStateAction, useEffect, useState } from "react";
import queryClient from "utils/queryClient";
import Bookmark from "api/types/bookmark";
import { getBookmark, updateBookmark } from "api/linkdigApi";

interface UseBookmarkResult {
    bookmark: Bookmark;
    setBookmark: (value: SetStateAction<Bookmark>) => void;
    saveBookmark: () => Promise<void>;
}

const useBookmark = (id: number): UseBookmarkResult => {
    const [bookmark, setBookmark] = useState({} as Bookmark);

    useEffect(() => {
        const loadBookmark = async () => {
            const data = await getBookmark(id);
            setBookmark(data);
        };

        loadBookmark();
    }, [id]);

    const saveBookmark = async (): Promise<void> => {
        await updateBookmark(bookmark);
        await queryClient.invalidateQueries();
    };

    return {
        bookmark,
        setBookmark,
        saveBookmark
    };
};

export default useBookmark;
