import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote } from "@ionic/react";
import Bookmark from "../api/types/bookmark";
import { Browser } from '@capacitor/browser';
import { bookmarkOutline, checkmark, pencilOutline } from "ionicons/icons";
import { format, parseISO } from "date-fns";

interface BookmarkListItemProps {
    bookmark: Bookmark;
}

const BookmarkListItem = (props: BookmarkListItemProps) => {
    const { url, date_added, unread, title, description } = props.bookmark;
    const domain = new URL(url).hostname.replace('www.', '');
    const dateAdded = parseISO(date_added);
    const date = format(dateAdded, 'MMM d yyyy');

    const handleItemClick = async (): Promise<void> => {
        await Browser.open({ url: url });
    };

    return (
        <IonItemSliding>
            <IonItem onClick={handleItemClick} button>
                {unread && <IonIcon slot="start" icon={bookmarkOutline}></IonIcon>}
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
                    <IonItemOption color="success" disabled>
                        <IonIcon slot="start" icon={checkmark} />
                        Read
                    </IonItemOption>
                )}

                {!unread && (
                    <IonItemOption color="primary" disabled>
                        <IonIcon slot="start" icon={bookmarkOutline} />
                        Unread
                    </IonItemOption>
                )}
            </IonItemOptions>

            <IonItemOptions side="end">
                <IonItemOption color="medium" disabled>
                    <IonIcon slot="start" icon={pencilOutline} />
                    Edit
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default BookmarkListItem;
