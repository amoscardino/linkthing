import { Clipboard } from "@capacitor/clipboard";
import { IonIcon, IonItemOption } from "@ionic/react";
import { copyOutline } from "ionicons/icons";

interface CopyOptionProps {
    url: string;
    slidingRef: React.MutableRefObject<HTMLIonItemSlidingElement | null>;
}

const CopyOption = ({ url, slidingRef }: CopyOptionProps) => {
    const handleCopyOptionClick = async () => {
        await Clipboard.write({ url: url });
        await slidingRef.current?.close();
    };

    return (
        <IonItemOption
            color="tertiary"
            onClick={handleCopyOptionClick}
        >
            <IonIcon slot="start" icon={copyOutline} />
            Copy
        </IonItemOption>
    );
};

export default CopyOption;
