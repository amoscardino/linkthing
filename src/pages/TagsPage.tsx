import { useState } from "react";
import {
    IonButton,
    IonIcon,
    IonItem,
    IonList,
    IonNote
} from "@ionic/react";
import {
    checkmarkOutline,
    closeOutline
} from "ionicons/icons";
import StandardPage from "components/StandardPage";
import Footer from "components/Footer";
import QueryResultDisplay from "components/QueryResultDisplay";
import useGroupedTags from "hooks/useGroupedTags";
import Tag from "components/Tag";

interface TagsPageProps {
    dismiss: (tags: string[] | null) => void;
    selected?: string[];
    multipleSelection?: boolean;
}

const TagsPage = ({ dismiss, selected, multipleSelection }: TagsPageProps) => {
    const { groups, isSuccess, isLoading, isError } = useGroupedTags();
    const [selectedTags, setSelectedTags] = useState([...selected || []]);

    const handleCloseButton = () => {
        dismiss(null);
    };

    const handleSaveButton = () => {
        dismiss([...selectedTags]);
    };

    const handleTagClick = (tag: string) => {
        return () => {
            if (multipleSelection) {
                if (selectedTags.includes(tag))
                    setSelectedTags(prev => prev.filter(x => x !== tag));
                else
                    setSelectedTags(prev => [...prev, tag]);
            }
            else
                dismiss([tag]);
        };
    }

    const closeButton = (
        <IonButton onClick={handleCloseButton} title="Clear">
            <IonIcon slot="icon-only" icon={closeOutline} />
        </IonButton>
    );
    const saveButton = (
        <IonButton onClick={handleSaveButton} title="Clear">
            <IonIcon slot="icon-only" icon={checkmarkOutline} />
        </IonButton>
    );

    return (
        <StandardPage
            title="Tags"
            primaryButton={multipleSelection ? saveButton : undefined}
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
                                <IonItem key={group.name}>
                                    <IonNote slot="start">{group.name}</IonNote>

                                    <div className="ion-padding-vertical">
                                        {group.tags.map(tag => (
                                            <Tag
                                                key={tag}
                                                tag={tag}
                                                isActive={selectedTags.includes(tag)}
                                                onClick={handleTagClick(tag)}
                                            />
                                        ))}
                                    </div>
                                </IonItem>
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
