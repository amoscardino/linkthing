import { useRef } from "react";
import {
    IonIcon,
    IonItem,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
} from "@ionic/react";
import { bookmark as bookmarkIcon, bookmarkOutline } from "ionicons/icons";
import { Browser } from '@capacitor/browser';
import { format, parseISO } from "date-fns";
import { useRecoilValue } from "recoil";
import browserSettingAtom from "state/browserSettingState";
import listItemSettingAtom from "state/listItemSettingState";
import Bookmark from "api/types/bookmark";
import { getBookmarkDescription, getBookmarkTitle } from "utils/bookmarks";
import { getDomain } from "utils/urls";
import ToggleReadOption from "components/BookmarkListItemOptions/ToggleReadOption";
import CopyOption from "components/BookmarkListItemOptions/CopyOption";
import ShareOption from "components/BookmarkListItemOptions/ShareOption";
import EditOption from "components/BookmarkListItemOptions/EditOption";

interface BookmarkListItemProps {
    bookmark: Bookmark;
    listRefresh: () => Promise<void>;
    containingPage: HTMLElement | null;
}

const BookmarkListItem = ({ bookmark, listRefresh, containingPage }: BookmarkListItemProps) => {
    const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const browserMode = useRecoilValue(browserSettingAtom);
    const listItemMode = useRecoilValue(listItemSettingAtom);
    const description = listItemMode === 'tags'
        ? (bookmark.tag_names || []).map(tag => `#${tag}`).join(' ')
        : getBookmarkDescription(bookmark);

    const itemProps = browserMode === 'external'
        ? { href: bookmark.url, target: "_blank" }
        : { button: true, onClick: async () => { await Browser.open({ url: bookmark.url }) } }

    return (
        <IonItemSliding ref={slidingRef}>
            <IonItem {...itemProps} detail={false} className="item-top-align">
                <IonIcon
                    slot="start"
                    color={bookmark.unread ? "primary" : "medium"}
                    icon={bookmark.unread ? bookmarkIcon : bookmarkOutline}
                    className="ion-margin-top"
                />

                <IonLabel className="ion-text-wrap">
                    <h2 className="two-line-truncate">
                        {getBookmarkTitle(bookmark)}
                    </h2>

                    {description.length > 0 && (
                        <p className="two-line-truncate">
                            {description}
                        </p>
                    )}

                    <p>
                        <small>
                            {format(parseISO(bookmark.date_added), 'MMM d, yyyy')}
                            <span>—</span>
                            {getDomain(bookmark.url)}
                        </small>
                    </p>
                </IonLabel>
            </IonItem>

            <IonItemOptions side="start">
                <ToggleReadOption
                    id={bookmark.id}
                    unread={bookmark.unread}
                    slidingRef={slidingRef}
                    listRefresh={listRefresh} />
            </IonItemOptions>

            <IonItemOptions side="end">
                <CopyOption url={bookmark.url} slidingRef={slidingRef} />
                <ShareOption bookmark={bookmark} slidingRef={slidingRef} />
                <EditOption
                    id={bookmark.id}
                    listRefresh={listRefresh}
                    slidingRef={slidingRef}
                    containingPage={containingPage}
                />
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default BookmarkListItem;
