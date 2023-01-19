import { useRef, useState } from "react";
import {
    InfiniteScrollCustomEvent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonSegment,
    IonSegmentButton,
    IonToolbar
} from "@ionic/react";
import BookmarkListItem from "components/BookmarkListItem";
import QueryResultDisplay from "components/QueryResultDisplay";
import SettingsButton from "components/SettingsButton";
import Snowman from "components/Snowman";
import StandardPage from "components/StandardPage";
import useBookmarks from "hooks/useBookmarks";

const ListPage = () => {
    const pageRef = useRef<HTMLElement | null>(null);
    const [unreadOnly, setUnreadOnly] = useState<boolean>(true);
    const {
        bookmarks,
        isSuccess,
        isLoading,
        isError,
        refresh,
        canLoadMore,
        loadMore
    } = useBookmarks(unreadOnly);

    const handleRefresh = async (): Promise<void> => {
        await refresh();
    };

    const handleInfiniteScroll = async (evt: InfiniteScrollCustomEvent) => {
        await loadMore();
        await evt.target.complete();
    };

    const listFooter = (
        <IonToolbar>
            <IonSegment
                value={unreadOnly ? 'unread' : 'all'}
                onIonChange={(e) => setUnreadOnly((e.detail.value || 'unread') === 'unread')}
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
                    <>
                        <IonList>
                            {(bookmarks || []).map(bookmark => (
                                <BookmarkListItem
                                    key={bookmark.id}
                                    bookmark={bookmark}
                                    listRefresh={handleRefresh}
                                    containingPage={pageRef.current}
                                />
                            ))}
                        </IonList>

                        <IonInfiniteScroll
                            onIonInfinite={handleInfiniteScroll}
                            disabled={!canLoadMore}
                            className="ion-margin-top"
                        >
                            <IonInfiniteScrollContent />
                        </IonInfiniteScroll>

                        {!canLoadMore && <Snowman />}
                    </>
                )}
                errorMessage="Unable to load bookmarks. Maybe check your settings?"
                emptyRender={() => <>No bookmarks found.</>}
            />
        </StandardPage>
    );
};

export default ListPage;
