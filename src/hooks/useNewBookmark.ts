import { SetStateAction, useEffect, useState } from "react";
import Bookmark from "api/types/bookmark";
import { createBookmark } from "api/linkdigApi";
import { useQueryClient } from "@tanstack/react-query";
import { Clipboard } from "@capacitor/clipboard";

interface UseNewBookmarkResult {
    bookmark: Bookmark;
    setBookmark: (value: SetStateAction<Bookmark>) => void;
    saveBookmark: () => Promise<void>;
}

const useNewBookmark = (): UseNewBookmarkResult => {
    const [bookmark, setBookmark] = useState({ unread: true } as Bookmark);
    const queryClient = useQueryClient();

    const saveBookmark = async (): Promise<void> => {
        await createBookmark(bookmark);
        await queryClient.invalidateQueries();
    };

    useEffect(() => {
        const tryLoadUrlFromClipboard = async () => {
            try {
                const { value } = await Clipboard.read();

                if (value && value.length && value.startsWith('http'))
                    setBookmark(prev => ({ ...prev, url: value }));
            }
            catch {
                // Clipboard not available
            }
        };

        tryLoadUrlFromClipboard();
    }, []);

    return {
        bookmark,
        setBookmark,
        saveBookmark
    };
};

export default useNewBookmark;
