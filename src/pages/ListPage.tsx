import {
    IonList,
    IonSegment,
    IonSegmentButton,
    IonToolbar,
    SegmentChangeEventDetail
} from "@ionic/react";
import { useRef, useState } from "react";
import BookmarkListItem from "../components/BookmarkListItem";
import QueryResultDisplay from "../components/QueryResultDisplay";
import SettingsButton from "../components/SettingsButton";
import Snowman from "../components/Snowman";
import StandardPage from "../components/StandardPage";
import useBookmarks from "../hooks/useBookmarks";

const ListPage = () => {
    const pageRef = useRef<HTMLElement | null>(null);
    const [filter, setFilter] = useState<string>('unread');
    const bookmarksQuery = filter === 'unread' ? '!unread' : undefined;
    const { bookmarks, isSuccess, isLoading, isError, refresh } = useBookmarks(bookmarksQuery);

    const handleRefresh = async (): Promise<void> => {
        await refresh();
    };

    const handleFilterChange = (evt: CustomEvent<SegmentChangeEventDetail>) => {
        setFilter(evt.detail.value || 'unread');
    };

    const listFooter = (
        <IonToolbar>
            <IonSegment
                value={filter}
                onIonChange={handleFilterChange}
                style={{ minWidth: '60%' }}
            >
                <IonSegmentButton value="unread">
                    Unread
                </IonSegmentButton>
                <IonSegmentButton value="all">
                    All
                </IonSegmentButton>
            </IonSegment>
        </IonToolbar>
    );

    return (
        <StandardPage
            title="Bookmarks"
            ref={pageRef}
            primaryButton={<SettingsButton onChanges={handleRefresh} containingPage={pageRef.current} />}
            onPullToRefresh={handleRefresh}
            footer={listFooter}
        >
            <QueryResultDisplay
                isSuccess={isSuccess}
                isLoading={isLoading}
                isError={isError}
                isEmpty={!bookmarks?.length}
                successRender={() => (
                    <IonList>
                        {(bookmarks || []).map(bookmark => (
                            <BookmarkListItem key={bookmark.id} bookmark={bookmark} listRefresh={refresh} />
                        ))}

                        <Snowman />
                    </IonList>
                )}
                errorMessage="Unable to load bookmarks. Maybe check your settings?"
                emptyRender={() => <>No bookmarks found.</>}
            />
        </StandardPage>
    );
};

export default ListPage;
