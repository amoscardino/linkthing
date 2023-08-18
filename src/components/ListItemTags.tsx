import Tag from "./Tag";

interface ListItemTagsProps{
    tags: string[];
}

const ListItemTags = ({ tags }: ListItemTagsProps) => {
    return (
        <p style={{ marginTop: '4px', marginLeft: '-4px' }}>
            {tags.map(tag => (
                <Tag key={tag} tag={tag} />
            ))}
        </p>
    )
};

export default ListItemTags;
