import { IonIcon, IonItemOption, useIonToast } from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { updateBookmarkRead } from "api/linkdigApi";
import { bookmark, bookmarkOutline } from "ionicons/icons";
import { tapMedium } from "utils/haptics";

interface ToggleReadOptionProps {
    id: number;
    unread: boolean;
    slidingRef: React.MutableRefObject<HTMLIonItemSlidingElement | null>;
    listRefresh: () => Promise<void>;
}

const ToggleReadOption = ({ id, unread, slidingRef, listRefresh }: ToggleReadOptionProps) => {
    const [showToast, dismissToast] = useIonToast();
    const queryClient = useQueryClient();

    const handleToggleReadOptionClick = async () => {
        await slidingRef.current?.close();

        await updateBookmarkRead(id);
        await queryClient.invalidateQueries(['bookmarks']);

        await tapMedium();
        await listRefresh();
        await dismissToast();

        await showToast({
            header: 'Bookmark Updated',
            message: `This bookmark has been marked as ${unread ? 'read' : 'unread'}.`,
            icon: unread ? bookmarkOutline : bookmark,
            color: "medium",
            duration: 3000,
            positionAnchor: 'FooterToolbar',
            buttons: [{
                text: 'Ok',
                handler: async () => dismissToast()
            }]
        });
    };

    return (
        <IonItemOption
            color="primary"
            onClick={handleToggleReadOptionClick}
        >
            {unread && (
                <>
                    <IonIcon slot="start" icon={bookmarkOutline} />
                    Read
                </>
            )}

            {!unread && (
                <>
                    <IonIcon slot="start" icon={bookmark} />
                    Unread
                </>
            )}
        </IonItemOption>
    );
};

export default ToggleReadOption;
