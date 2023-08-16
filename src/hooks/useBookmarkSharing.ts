import { Share } from "@capacitor/share";
import { useIonToast } from "@ionic/react";
import Bookmark from "api/types/bookmark";
import { sadOutline } from "ionicons/icons";
import { getBookmarkDescription, getBookmarkTitle } from "utils/bookmarks";

interface UseBookmarkSharing {
    shareBookmark: (bookmark: Bookmark) => Promise<void>;
}

const useBookmarkSharing = (): UseBookmarkSharing => {
    const [showToast, dismissToast] = useIonToast();

    const shareBookmark = async (bookmark: Bookmark) => {
        if ((await Share.canShare()).value) {
            await Share.share({
                title: getBookmarkTitle(bookmark),
                text: getBookmarkDescription(bookmark) || undefined,
                url: bookmark.url
            });
        }
        else {
            await dismissToast();
            await showToast({
                header: 'Oh, no!',
                message: 'Sharing is not supported on this platform. Sorry about that.',
                position: 'top',
                duration: 2000,
                icon: sadOutline,
                translucent: true,
                buttons: [{ text: 'Ok', handler: async () => dismissToast() }]
            });
        }
    };

    return { shareBookmark };
};

export default useBookmarkSharing;
