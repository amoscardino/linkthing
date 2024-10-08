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
  let iconClass = 'ion-margin-top';

  if (!showFavicons) {
    return (
      <IonIcon
        slot="start"
        color="primary"
        icon={unread ? bookmark : bookmarkOutline}
        style={{ 'font-size': '1.5rem' }}
        className={iconClass}
      />
    );
  }

  if (unread)
    iconClass = `${iconClass} dot`;

  if (faviconUrl && faviconUrl.length > 0) {
    return (
      <IonThumbnail
        slot="start"
        style={{ '--size': '1.5rem', '--border-radius': '0.5rem' }}
        className={iconClass}
      >
        <img alt="" src={faviconUrl} />
      </IonThumbnail>
    );
  }

  return (
    <IonIcon
      slot="start"
      color="primary"
      icon={globeOutline}
      style={{ 'font-size': '1.5rem' }}
      className={iconClass}
    />
  );
};

export default BookmarkIcon;
