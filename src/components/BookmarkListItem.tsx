import { IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import Bookmark from "../api/types/bookmark";
import { Browser } from '@capacitor/browser';
import { bookmarkOutline } from "ionicons/icons";
import { format, parseISO } from "date-fns";

interface BookmarkListItemProps {
    bookmark: Bookmark;
}

const BookmarkListItem = ({ bookmark }: BookmarkListItemProps) => {
    const domain = new URL(bookmark.url).hostname.replace('www.', '');
    const dateAdded = parseISO(bookmark.date_added);
    const date = format(dateAdded, 'MMM d yyyy');

    const handleClick = async (): Promise<void> => {
        await Browser.open({ url: bookmark.url });
    };

    return (
        <IonItem onClick={handleClick} detail>
            {bookmark.unread && <IonIcon slot="start" icon={bookmarkOutline}></IonIcon>}
            {!bookmark.unread && <IonIcon slot="start"></IonIcon>}

            <IonLabel>
                <h2>
                    {bookmark.title}
                </h2>
                <p>
                    {bookmark.description}
                </p>
                <p>
                    <small>
                        {date} — {domain}
                    </small>
                </p>
            </IonLabel>
        </IonItem>
    );
};

export default BookmarkListItem;
