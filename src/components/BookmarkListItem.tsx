import {
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel
} from "@ionic/react";
import Bookmark from "../api/types/bookmark";
import { Browser } from '@capacitor/browser';
import { bookmarkOutline, checkmark, pencilOutline } from "ionicons/icons";
import { format, parseISO } from "date-fns";
import { toggleBookmarkRead } from "../api/linkdigApi";
import { useRef } from "react";

interface BookmarkListItemProps {
    bookmark: Bookmark;
    listRefresh: () => Promise<void>
}

const BookmarkListItem = (props: BookmarkListItemProps) => {
    const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const { id, url, date_added, unread, title, description } = props.bookmark;
    const domain = new URL(url).hostname.replace('www.', '');
    const dateAdded = parseISO(date_added);
    const date = format(dateAdded, 'MMM d yyyy');

    const handleItemClick = async (): Promise<void> => {
        await Browser.open({ url: url });
    };

    const handleToggleReadClick = async () => {
        await slidingRef.current?.close();
        await toggleBookmarkRead(id);
        await props.listRefresh();
    };

    return (
        <IonItemSliding ref={slidingRef}>
            <IonItem onClick={handleItemClick} button>
                {unread && <IonIcon slot="start" icon={bookmarkOutline} color="primary"></IonIcon>}
                {!unread && <IonIcon slot="start"></IonIcon>}

                <IonLabel>
                    <h2>
                        {title}
                    </h2>
                    <p>
                        {description}
                    </p>
                    <p>
                        <small>
                            {date} — {domain}
                        </small>
                    </p>
                </IonLabel>
            </IonItem>

            <IonItemOptions side="start">
                {unread && (
                    <IonItemOption color="success" onClick={handleToggleReadClick}>
                        <IonIcon slot="start" icon={checkmark} />
                        Read
                    </IonItemOption>
                )}

                {!unread && (
                    <IonItemOption color="primary" onClick={handleToggleReadClick}>
                        <IonIcon slot="start" icon={bookmarkOutline} />
                        Unread
                    </IonItemOption>
                )}
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
