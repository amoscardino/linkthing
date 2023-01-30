import { Share } from "@capacitor/share";
import { useIonToast } from "@ionic/react";
import { sadOutline } from "ionicons/icons";

interface UseBookmarkSharing {
    shareBookmark: (url: string, title: string, description: string | null) => Promise<void>;
}

const useBookmarkSharing = (): UseBookmarkSharing => {
    const [showToast, dismissToast] = useIonToast();

    const shareBookmark = async (url: string, title: string, description: string | null) => {
        if ((await Share.canShare()).value) {
            await Share.share({
                title: title,
                text: description || undefined,
                url: url
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
