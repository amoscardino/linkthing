import Tag from "./Tag";

interface ListItemTagsProps {
    tags: string[];
    onTagClick: (tag: string | null) => Promise<void>;
}

const ListItemTags = ({ tags, onTagClick }: ListItemTagsProps) => {
    const handleTagClick = async (evt: React.MouseEvent, tag: string) => {
        evt.preventDefault();
        evt.stopPropagation();
        await onTagClick(tag);
    };

    return (
        <p style={{ marginTop: '4px', marginLeft: '-4px' }}>
            {tags.map(tag => (
                <Tag
                    key={tag}
                    tag={tag}
                    onClick={async evt => await handleTagClick(evt, tag)}
                />
            ))}
        </p>
    )
};

export default ListItemTags;
