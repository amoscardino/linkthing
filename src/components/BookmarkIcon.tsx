import { IonIcon, IonThumbnail } from "@ionic/react";
import classNames from "classnames";
import { bookmark, bookmarkOutline } from "ionicons/icons";
import { useRecoilValue } from "recoil";
import showFaviconsSettingAtom from "state/showFaviconsSettingState";

interface BookmarkIconProps {
    faviconUrl: string | null;
    unread: boolean;
}

const BookmarkIcon = ({ faviconUrl, unread }: BookmarkIconProps) => {
    const showFavicons = useRecoilValue(showFaviconsSettingAtom);
    const classes = classNames('ion-margin-top', { 'dot': unread });

    if (!showFavicons) {
        return (
            <IonIcon
                slot="start"
                color="primary"
                icon={unread ? bookmark : bookmarkOutline}
                style={{ 'font-size': '1.5rem' }}
                className="ion-margin-top"
            />
        );
    }

    if (faviconUrl && faviconUrl.length > 0) {
        return (
            <IonThumbnail
                slot="start"
                style={{ '--size': '1.5rem', '--border-radius': '0.5rem' }}
                className={classes}
            >
                <img alt="" src={faviconUrl} />
            </IonThumbnail>
        );
    }

    return (
        <IonIcon
            slot="start"
            color="primary"
            icon={bookmarkOutline}
            style={{ 'font-size': '1.5rem' }}
            className={classes}
        />
    );
};

export default BookmarkIcon;
