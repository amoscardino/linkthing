import { IonList } from "@ionic/react";
import { useRef } from "react";
import BookmarkListItem from "../components/BookmarkListItem";
import QueryResultDisplay from "../components/QueryResultDisplay";
import SettingsButton from "../components/SettingsButton";
import Snowman from "../components/Snowman";
import StandardPage from "../components/StandardPage";
import useBookmarks from "../hooks/useBookmarks";

const ListPage = () => {
    const pageRef = useRef<HTMLElement | null>(null);
    const { bookmarks, isSuccess, isLoading, isError, refresh } = useBookmarks();

    const handleRefresh = async (): Promise<void> => {
        await refresh();
    };

    return (
        <StandardPage
            title="Bookmarks"
            ref={pageRef}
            primaryButton={<SettingsButton onChanges={handleRefresh} containingPage={pageRef.current} />}
            onPullToRefresh={handleRefresh}
        >
            <QueryResultDisplay
                isSuccess={isSuccess}
                isLoading={isLoading}
                isError={isError}
                isEmpty={!bookmarks?.length}
                successRender={() => (
                    <IonList>
                        {(bookmarks || []).map(bookmark => (
                            <BookmarkListItem key={bookmark.id} bookmark={bookmark} />
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
