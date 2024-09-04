import { IonIcon, IonThumbnail } from "@ionic/react";
import { bookmark, bookmarkOutline, globeOutline } from "ionicons/icons";
import { useRecoilValue } from "recoil";
import showFaviconsSettingAtom from "state/showFaviconsSettingState";

interface BookmarkIconProps {
    faviconUrl: string | null;
    unread: boolean;
}

const BookmarkIcon = ({ faviconUrl, unread }: BookmarkIconProps) => {
    const showFavicons = useRecoilValue(showFaviconsSettingAtom);

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

    const unreadIcon = unread ? (
        <IonIcon
            slot="end"
            color="primary"
            icon={bookmark}
            style={{ 'font-size': '1.5rem' }}
            className="ion-margin-top"
        />
    ) : null;

    if (faviconUrl && faviconUrl.length > 0) {
        return (
            <>
                <IonThumbnail
                    slot="start"
                    style={{ '--size': '1.5rem', '--border-radius': '0.5rem' }}
                    className="ion-margin-top"
                >
                    <img alt="" src={faviconUrl} />
                </IonThumbnail>
                {unreadIcon}
            </>
        );
    }

    return (
        <>
            <IonIcon
                slot="start"
                color="primary"
                icon={globeOutline}
                style={{ 'font-size': '1.5rem' }}
                className="ion-margin-top"
            />
            {unreadIcon}
        </>
    );
};

export default BookmarkIcon;
