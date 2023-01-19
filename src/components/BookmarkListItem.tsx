import { useRef } from "react";
import {
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    useIonModal
} from "@ionic/react";
import { Browser } from '@capacitor/browser';
import { bookmark as bookmarkIcon, checkmark, pencilOutline } from "ionicons/icons";
import { format, parseISO } from "date-fns";
import Bookmark from "api/types/bookmark";
import { toggleBookmarkRead } from "api/linkdigApi";
import EditPage from "pages/EditPage";

interface BookmarkListItemProps {
    bookmark: Bookmark;
    listRefresh: () => Promise<void>;
    containingPage: HTMLElement | null;
}

const BookmarkListItem = ({ bookmark, listRefresh, containingPage }: BookmarkListItemProps) => {
    const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const domain = new URL(bookmark.url).hostname.replace('www.', '');
    const dateAdded = parseISO(bookmark.date_added);
    const date = format(dateAdded, 'MMM d yyyy');

    const handleDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await listRefresh();

        dismissEditModal();
        await slidingRef.current?.close();
    };

    const [showEditModal, dismissEditModal] = useIonModal(EditPage, { id: bookmark.id, dismiss: handleDismiss });

    const handleItemClick = async (): Promise<void> => {
        await Browser.open({ url: bookmark.url });
    };

    const handleToggleReadClick = async () => {
        await slidingRef.current?.close();
        await toggleBookmarkRead(bookmark.id);
        await listRefresh();
    };

    const handleEditOptionClick = () => {
        showEditModal({
            swipeToClose: true,
            presentingElement: containingPage || undefined
        });
    };

    return (
        <IonItemSliding ref={slidingRef}>
            <IonItem onClick={handleItemClick} button>
                <IonIcon
                    slot="start"
                    color="primary"
                    icon={bookmark.unread ? bookmarkIcon : undefined}
                />

                <IonLabel className="ion-text-wrap">
                    <h2 className="two-line-truncate">
                        {bookmark.title || bookmark.website_title || bookmark.url}
                    </h2>

                    {!!(bookmark.description || bookmark.website_description) && (
                        <p className="two-line-truncate">
                            {bookmark.description || bookmark.website_description}
                        </p>
                    )}

                    <p>
                        <small>
                            {date} — {domain}
                        </small>
                    </p>
                </IonLabel>
            </IonItem>

            <IonItemOptions side="start" onIonSwipe={handleToggleReadClick}>
                <IonItemOption
                    color="primary"
                    expandable
                    onClick={handleToggleReadClick}
                >
                    {bookmark.unread && (
                        <>
                            <IonIcon slot="start" icon={checkmark} />
                            Read
                        </>
                    )}

                    {!bookmark.unread && (
                        <>
                            <IonIcon slot="start" icon={bookmarkIcon} />
                            Unread
                        </>
                    )}
                </IonItemOption>
            </IonItemOptions>

            <IonItemOptions side="end">
                <IonItemOption
                    onClick={handleEditOptionClick}
                    color="medium"
                >
                    <IonIcon slot="start" icon={pencilOutline} />
                    Edit
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding >
    );
};

export default BookmarkListItem;
