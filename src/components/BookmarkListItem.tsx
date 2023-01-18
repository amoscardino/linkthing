import { useRef } from "react";
import {
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel
} from "@ionic/react";
import { Browser } from '@capacitor/browser';
import { book, bookmark as bookmarkIcon, checkmark } from "ionicons/icons";
import { format, parseISO } from "date-fns";
import Bookmark from "api/types/bookmark";
import { toggleBookmarkRead } from "api/linkdigApi";

interface BookmarkListItemProps {
    bookmark: Bookmark;
    listRefresh: () => Promise<void>
}

const BookmarkListItem = (props: BookmarkListItemProps) => {
    const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const { bookmark } = props;
    const domain = new URL(bookmark.url).hostname.replace('www.', '');
    const dateAdded = parseISO(bookmark.date_added);
    const date = format(dateAdded, 'MMM d yyyy');

    const handleItemClick = async (): Promise<void> => {
        await Browser.open({ url: bookmark.url });
    };

    const handleToggleReadClick = async () => {
        await slidingRef.current?.close();
        await toggleBookmarkRead(bookmark.id);
        await props.listRefresh();
    };

    return (
        <IonItemSliding ref={slidingRef}>
            <IonItem onClick={handleItemClick} button>
                <IonIcon
                    slot="start"
                    color="primary"
                    icon={bookmark.unread ? bookmarkIcon : undefined}
                />

                <IonLabel>
                    <h2>
                        {bookmark.website_title || bookmark.title || bookmark.url}
                    </h2>
                    <p>
                        {bookmark.website_description || bookmark.description}
                    </p>
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

            {/* <IonItemOptions side="end">
                <IonItemOption color="medium" disabled>
                    <IonIcon slot="start" icon={pencilOutline} />
                    Edit
                </IonItemOption>
            </IonItemOptions> */}
        </IonItemSliding>
    );
};

export default BookmarkListItem;
