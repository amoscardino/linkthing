import {
    InfiniteScrollCustomEvent,
    IonButton,
    IonButtons,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonToolbar
} from "@ionic/react";
import { search } from "ionicons/icons";
import useBookmarksList from "hooks/useBookmarksList";
import { ViewMode } from "types/viewMode";
import BookmarkListItem from "components/BookmarkListItem";
import QueryResultDisplay from "components/QueryResultDisplay";
import SettingsButton from "components/SettingsButton";
import StandardPage from "components/StandardPage";
import Footer from "components/Footer";
import AddButton from "components/AddButton";
import TagsButton from "components/TagsButton";

const ListPage = () => {
    const {
        pageRef,
        searchbarRef,
        viewMode,
        setViewMode,
        showSearch,
        setShowSearch,
        searchQuery,
        setSearchQuery,
        bookmarksResult: {
            bookmarks,
            enabled,
            isLoading,
            isError,
            isSuccess,
            canLoadMore,
            loadMore,
            refresh
        }
    } = useBookmarksList();

    const handleInfiniteScroll = async (evt: InfiniteScrollCustomEvent) => {
        await loadMore();
        await evt.target.complete();
    };

    const handleTagChange = async (tag: string | null): Promise<void> => {
        if (tag) {
            setSearchQuery(`#${tag}`);
            setShowSearch(true);
        }
        else
            setShowSearch(false);
    };

    const footerToolbar = !showSearch
        ? (
            <IonToolbar id="FooterToolbar">
                <IonSegment
                    value={viewMode?.toString()}
                    onIonChange={(e) => setViewMode((e.detail.value || 'unread') as ViewMode)}
                    style={{ minWidth: '60%' }}
                >
                    <IonSegmentButton value="unread">
                        Unread
                    </IonSegmentButton>
                    <IonSegmentButton value="all">
                        All
                    </IonSegmentButton>
                </IonSegment>

                <IonButtons slot="start">
                    <TagsButton onChanges={handleTagChange} containingPage={pageRef.current} />
                </IonButtons>

                <IonButtons slot="end">
                    <IonButton onClick={() => setShowSearch(true)}>
                        <IonIcon slot="icon-only" icon={search} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        )
        : undefined;

    const primaryHeaderButton = showSearch
        ? (<IonButton onClick={() => setShowSearch(false)}>Cancel</IonButton>)
        : (<AddButton onChanges={refresh} containingPage={pageRef.current} />);

    const secondaryHeaderButton = showSearch
        ? (undefined)
        : (<SettingsButton onChanges={refresh} containingPage={pageRef.current} />);

    return (
        <StandardPage
            title="Bookmarks"
            ref={pageRef}
            primaryButton={primaryHeaderButton}
            secondaryButton={secondaryHeaderButton}
            onPullToRefresh={refresh}
            footer={footerToolbar}
        >
            {showSearch && (
                <IonSearchbar
                    ref={searchbarRef}
                    value={searchQuery}
                    onIonInput={e => setSearchQuery(e.detail.value || '')}
                    debounce={750}
                />
            )}

            <QueryResultDisplay
                isSuccess={isSuccess}
                isLoading={!enabled || isLoading}
                isError={isError}
                isEmpty={!bookmarks?.length}
                successRender={() => (
                    <>
                        <IonList>
                            {(bookmarks || []).map(bookmark => (
                                <BookmarkListItem
                                    key={bookmark.id}
                                    bookmark={bookmark}
                                    listRefresh={refresh}
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

                        {!canLoadMore && <Footer />}
                    </>
                )}
                errorMessage="Unable to load bookmarks. Maybe check your settings?"
                emptyRender={() => <>No bookmarks found.</>}
            />
        </StandardPage>
    );
};

export default ListPage;
