import { useRef } from "react";
import {
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    useIonModal,
    useIonToast
} from "@ionic/react";
import {
    bookmark,
    bookmarkOutline,
    copyOutline,
    pencilOutline,
    shareOutline
} from "ionicons/icons";
import { Browser } from '@capacitor/browser';
import { format, parseISO } from "date-fns";
import { updateBookmarkRead } from "api/linkdigApi";
import EditPage from "pages/EditPage";
import { tapMedium } from "utils/haptics";
import { useQueryClient } from "@tanstack/react-query";
import useBookmarkSharing from "hooks/useBookmarkSharing";
import { Clipboard } from "@capacitor/clipboard";
import { useRecoilValue } from "recoil";
import browserSettingAtom from "state/browserSettingState";
import Tag from "./Tag";
import listItemSettingAtom from "state/listItemSettingState";

interface BookmarkListItemProps {
    id: number;
    url: string;
    title: string;
    description: string | null;
    tags: string[];
    unread: boolean;
    dateAdded: string;
    listRefresh: () => Promise<void>;
    containingPage: HTMLElement | null;
}

const BookmarkListItem = (props: BookmarkListItemProps) => {
    const { id, title, description, tags, url, unread, listRefresh, containingPage } = props;
    const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const browserMode = useRecoilValue(browserSettingAtom);
    const listItemMode = useRecoilValue(listItemSettingAtom);
    const { shareBookmark } = useBookmarkSharing();
    const [showToast, dismissToast] = useIonToast();
    const queryClient = useQueryClient();
    const domain = new URL(url).hostname.replace('www.', '');

    const handleEdiModalDismiss = async (anyChanges: boolean) => {
        if (anyChanges)
            await listRefresh();

        dismissEditModal();
        await slidingRef.current?.close();
    };

    const [showEditModal, dismissEditModal] = useIonModal(EditPage, { id, dismiss: handleEdiModalDismiss });

    const handleToggleReadOptionClick = async () => {
        await slidingRef.current?.close();

        await updateBookmarkRead(id);
        await queryClient.invalidateQueries(['bookmarks']);

        await tapMedium();
        await listRefresh();
        await dismissToast();

        await showToast({
            header: 'Bookmark Updated',
            message: `This bookmark has been marked as ${unread ? 'read' : 'unread'}.`,
            icon: unread ? bookmarkOutline : bookmark,
            color: "medium",
            duration: 3000,
            buttons: [{
                text: 'Ok',
                handler: async () => dismissToast()
            }]
        });
    };

    const handleCopyOptionClick = async () => {
        await Clipboard.write({ url });
        await slidingRef.current?.close();
    };

    const handleShareOptionClick = async () => {
        await slidingRef.current?.close();
        await shareBookmark(url, title, description);
    };

    const handleEditOptionClick = async () => {
        showEditModal({
            canDismiss: true,
            presentingElement: containingPage || undefined
        });
        await slidingRef.current?.close();
    };

    const itemProps = browserMode === 'external'
        ? { href: url, target: "_blank" }
        : { button: true, onClick: async () => { await Browser.open({ url }) } }

    return (
        <IonItemSliding ref={slidingRef}>
            <IonItem {...itemProps} className="item-top-align">
                <IonIcon
                    slot="start"
                    color={unread ? "primary" : "medium"}
                    icon={unread ? bookmark : bookmarkOutline}
                    className="ion-margin-top"
                />

                <IonLabel className="ion-text-wrap">
                    <h2 className="two-line-truncate">
                        {title}
                    </h2>

                    {listItemMode === 'tags'
                        ? (
                            <>
                                <p>
                                    {format(parseISO(props.dateAdded), 'MMM d, yyyy')} — {domain}
                                </p>

                                <p>
                                    {(tags || []).map(tag => (
                                        <Tag
                                            key={tag}
                                            tag={tag}
                                        />
                                    ))}
                                </p>
                            </>
                        )
                        : (
                            <>
                                {!!description && (
                                    <p className="two-line-truncate">
                                        {description}
                                    </p>
                                )}

                                <p>
                                    <small>
                                        {format(parseISO(props.dateAdded), 'MMM d, yyyy')} — {domain}
                                    </small>
                                </p>
                            </>
                        )
                    }

                </IonLabel>
            </IonItem>

            <IonItemOptions side="start">
                <IonItemOption
                    color="primary"
                    onClick={handleToggleReadOptionClick}
                >
                    {unread && (
                        <>
                            <IonIcon slot="start" icon={bookmarkOutline} />
                            Read
                        </>
                    )}

                    {!unread && (
                        <>
                            <IonIcon slot="start" icon={bookmark} />
                            Unread
                        </>
                    )}
                </IonItemOption>
            </IonItemOptions>

            <IonItemOptions side="end">
                <IonItemOption
                    color="medium"
                    onClick={handleCopyOptionClick}
                >
                    <IonIcon slot="start" icon={copyOutline} />
                    Copy
                </IonItemOption>

                <IonItemOption
                    color="tertiary"
                    onClick={handleShareOptionClick}
                >
                    <IonIcon slot="start" icon={shareOutline} />
                    Share
                </IonItemOption>

                <IonItemOption
                    color="secondary"
                    onClick={handleEditOptionClick}
                >
                    <IonIcon slot="start" icon={pencilOutline} />
                    Edit
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default BookmarkListItem;
