import { SetStateAction, useEffect, useState } from "react";
import Bookmark from "api/types/bookmark";
import { checkUrl, createBookmark } from "api/linkdigApi";
import { useQueryClient } from "@tanstack/react-query";
import { Clipboard } from "@capacitor/clipboard";
import useSettings from "./useSettings";

interface UseNewBookmarkResult {
    bookmark: Bookmark;
    isExistingBookmark: boolean;
    setBookmark: (value: SetStateAction<Bookmark>) => void;
    saveBookmark: () => Promise<void>;
}

const useNewBookmark = (url: string): UseNewBookmarkResult => {
    const [bookmark, setBookmark] = useState({ url: url, unread: true } as Bookmark);
    const [isExistingBookmark, setIsExistingBookmark] = useState(false);
    const { settings } = useSettings();
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

        if (!url.length && settings && !settings?.disableClipboard)
            tryLoadUrlFromClipboard();
    }, [url, settings, settings?.disableClipboard]);

    useEffect(() => {
        const loadMetadata = async () => {
            var checkResults = await checkUrl(bookmark.url);

            setBookmark(prev => ({
                ...prev,
                website_title: checkResults.metadata.title,
                website_description: checkResults.metadata.description
            }));

            setIsExistingBookmark(!!(checkResults.bookmark?.id));
        };

        loadMetadata();
    }, [bookmark.url]);

    return {
        bookmark,
        isExistingBookmark,
        setBookmark,
        saveBookmark
    };
};

export default useNewBookmark;
