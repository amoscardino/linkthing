import { SetStateAction, useEffect, useState } from "react";
import Bookmark from "api/types/bookmark";
import { deleteBookmark, getBookmark, updateBookmark } from "api/linkdigApi";
import { useQueryClient } from "@tanstack/react-query";

interface UseBookmarkResult {
    bookmark: Bookmark;
    setBookmark: (value: SetStateAction<Bookmark>) => void;
    saveBookmark: () => Promise<void>;
    removeBookmark: () => Promise<void>;
}

const useBookmark = (id: number): UseBookmarkResult => {
    const [bookmark, setBookmark] = useState({} as Bookmark);
    const queryClient = useQueryClient();

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

    const removeBookmark = async (): Promise<void> => {
        await deleteBookmark(bookmark.id);
        await queryClient.invalidateQueries();
    };

    return {
        bookmark,
        setBookmark,
        saveBookmark,
        removeBookmark
    };
};

export default useBookmark;
