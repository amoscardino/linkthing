import {
    IonButton,
    IonChip,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader
} from "@ionic/react";
import { closeOutline, pricetagOutline } from "ionicons/icons";
import StandardPage from "components/StandardPage";
import Footer from "components/Footer";
import QueryResultDisplay from "components/QueryResultDisplay";
import { Fragment } from "react";
import useGroupedTags from "hooks/useGroupedTags";

interface TagsPageProps {
    dismiss: (tag: string | null) => void;
}

const TagsPage = ({ dismiss }: TagsPageProps) => {
    const { groups, isSuccess, isLoading, isError } = useGroupedTags();

    const handleCloseButton = () => {
        dismiss(null);
    };

    const closeButton = (
        <IonButton onClick={handleCloseButton} title="Clear">
            <IonIcon slot="icon-only" icon={closeOutline} />
        </IonButton>
    );

    return (
        <StandardPage
            title="Tags"
            secondaryButton={closeButton}
        >
            <QueryResultDisplay
                fullWidth
                isSuccess={isSuccess}
                isLoading={isLoading}
                isError={isError}
                isEmpty={!groups?.length}
                successRender={() => (
                    <>
                        <IonList className="ion-padding-vertical" style={{ background: '' }}>
                            {groups.map(group => (
                                <Fragment key={group.name}>
                                    <IonListHeader>
                                        {group.name}
                                    </IonListHeader>

                                    <IonItem>
                                        <div className="ion-padding-vertical">
                                            {group.tags.map(tag => (
                                                <IonChip key={tag} onClick={() => dismiss(tag)}>
                                                    <IonIcon icon={pricetagOutline} />
                                                    <IonLabel>{tag}</IonLabel>
                                                </IonChip>
                                            ))}
                                        </div>
                                    </IonItem>
                                </Fragment>
                            ))}

                            <Footer />
                        </IonList>
                    </>
                )}
                errorMessage="Unable to load tags. Maybe check your settings?"
                emptyRender={() => <>No tags found.</>}
            />
        </StandardPage >
    );
};

export default TagsPage;
