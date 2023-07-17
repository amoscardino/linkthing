import { useEffect, useRef, useState } from "react";
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
import BookmarkListItem from "components/BookmarkListItem";
import QueryResultDisplay from "components/QueryResultDisplay";
import SettingsButton from "components/SettingsButton";
import StandardPage from "components/StandardPage";
import Footer from "components/Footer";
import AddButton from "components/AddButton";
import useBookmarks from "hooks/useBookmarks";
import useViewMode from "hooks/useViewMode";
import { ViewMode } from "types/viewMode";
import TagsButton from "components/TagsButton";

const ListPage = () => {
    const pageRef = useRef<HTMLElement | null>(null);
    const searchbarRef = useRef<HTMLIonSearchbarElement | null>(null);
    const { viewMode, setViewMode } = useViewMode();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const {
        bookmarks,
        enabled,
        isSuccess,
        isLoading,
        isError,
        refresh,
        canLoadMore,
        loadMore
    } = useBookmarks(showSearch, viewMode, searchQuery);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (showSearch)
                await searchbarRef.current?.setFocus();
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [showSearch]);

    const handleRefresh = async (): Promise<void> => {
        await refresh();
    };

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
            <IonToolbar>
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
        : (<AddButton onChanges={handleRefresh} containingPage={pageRef.current} />);

    const secondaryHeaderButton = showSearch
        ? (undefined)
        : (<SettingsButton onChanges={handleRefresh} containingPage={pageRef.current} />);

    return (
        <StandardPage
            title="Bookmarks"
            ref={pageRef}
            primaryButton={primaryHeaderButton}
            secondaryButton={secondaryHeaderButton}
            onPullToRefresh={handleRefresh}
            footer={footerToolbar}
        >
            {showSearch && (
                <IonSearchbar
                    ref={searchbarRef}
                    value={searchQuery}
                    onIonChange={e => setSearchQuery(e.detail.value || '')}
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
                                    id={bookmark.id}
                                    url={bookmark.url}
                                    title={bookmark.title || bookmark.website_title || bookmark.url}
                                    description={bookmark.description || bookmark.website_description}
                                    tags={bookmark.tag_names || []}
                                    unread={bookmark.unread}
                                    dateAdded={bookmark.date_added}
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
