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
    bookmark,
    bookmarkOutline,
    pencilOutline,
    sadOutline,
    shareOutline
} from "ionicons/icons";
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { format, parseISO } from "date-fns";
import { updateBookmarkRead } from "api/linkdigApi";
import EditPage from "pages/EditPage";
import { tapMedium } from "utils/haptics";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";

interface BookmarkListItemProps {
    id: number;
    url: string;
    title: string;
    description: string | null;
    unread: boolean;
    dateAdded: string;
    listRefresh: () => Promise<void>;
    containingPage: HTMLElement | null;
}

const BookmarkListItem = (props: BookmarkListItemProps) => {
    const { id, title, description, url, unread, listRefresh, containingPage } = props;
    const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const [showToast, dismissToast] = useIonToast();
    const queryClient = useQueryClient();
    const domain = new URL(url).hostname.replace('www.', '');

    const handleDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await listRefresh();

        dismissEditModal();
        await slidingRef.current?.close();
    };

    const [showEditModal, dismissEditModal] = useIonModal(EditPage, { id, dismiss: handleDismiss });

    const handleItemClick = async () => {
        await Browser.open({ url: url });
    };

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
            duration: 3000,
            buttons: [{ text: 'Ok', handler: async () => dismissToast() }]
        });
    };

    const handleShareOptionClick = async () => {
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
                    icon={unread ? bookmark : bookmarkOutline}
                />

                <IonLabel className="ion-text-wrap">
                    <h2 className={classNames("two-line-truncate", { 'text-bold': unread })}>
                        {title}
                    </h2>

                    {!!description && (
                        <p className="two-line-truncate">
                            {description}
                        </p>
                    )}

                    <p>
                        <small>
                            {format(parseISO(props.dateAdded), 'MMM d, yyyy')} — {domain}
                        </small>
                    </p>
                </IonLabel>
            </IonItem>

            <IonItemOptions side="start">
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
