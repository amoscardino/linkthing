import { IonIcon, IonItemOption } from "@ionic/react";
import Bookmark from "api/types/bookmark";
import useBookmarkSharing from "hooks/useBookmarkSharing";
import { shareOutline } from "ionicons/icons";

interface ShareOptionProps {
    bookmark: Bookmark;
    slidingRef: React.MutableRefObject<HTMLIonItemSlidingElement | null>;
}

const ShareOption = ({ bookmark, slidingRef }: ShareOptionProps) => {
    const { shareBookmark } = useBookmarkSharing();

    const handleShareOptionClick = async () => {
        await slidingRef.current?.close();
        await shareBookmark(bookmark);
    };

    return (
        <IonItemOption
            color="secondary"
            onClick={handleShareOptionClick}
        >
            <IonIcon slot="start" icon={shareOutline} />
            Share
        </IonItemOption>
    );
};

export default ShareOption;
