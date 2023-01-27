import { useRef } from "react";
import {
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    useIonModal,
    useIonToast
} from "@ionic/react";
import {
    bookmark as bookmarkIcon,
    bookmarkOutline,
    checkmark,
    pencilOutline,
    sadOutline,
    shareOutline
} from "ionicons/icons";
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
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
    const [showToast, dismissToast] = useIonToast();
    const domain = new URL(bookmark.url).hostname.replace('www.', '');
    const dateAdded = parseISO(bookmark.date_added);
    const date = format(dateAdded, 'MMM d, yyyy');

    const handleDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await listRefresh();

        dismissEditModal();
        await slidingRef.current?.close();
    };

    const [showEditModal, dismissEditModal] = useIonModal(EditPage, { id: bookmark.id, dismiss: handleDismiss });

    const handleItemClick = async () => {
        await Browser.open({ url: bookmark.url });
    };

    const handleToggleReadOptionClick = async () => {
        await slidingRef.current?.close();
        await toggleBookmarkRead(bookmark.id);
        await listRefresh();
    };

    const handleShareOptionClick = async () => {
        if ((await Share.canShare()).value) {
            await Share.share({
                title: bookmark.title || bookmark.website_title || undefined,
                text: bookmark.description || bookmark.website_description || undefined,
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

            <IonItemOptions side="start">
                <IonItemOption
                    color="primary"
                    onClick={handleToggleReadOptionClick}
                >
                    <IonIcon slot="start" icon={bookmark.unread ? checkmark : bookmarkOutline} />
                    {bookmark.unread ? 'Read' : 'Unread'}
                </IonItemOption>
            </IonItemOptions>

            <IonItemOptions side="end">
                <IonItemOption
                    color="tertiary"
                    onClick={handleShareOptionClick}
                >
                    <IonIcon slot="start" icon={shareOutline} />
                    Share
                </IonItemOption>
                <IonItemOption
                    color="secondary"
                    onClick={handleEditOptionClick}
                >
                    <IonIcon slot="start" icon={pencilOutline} />
                    Edit
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding >
    );
};

export default BookmarkListItem;
