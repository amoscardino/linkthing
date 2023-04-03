import { QueryResult } from "types/results";
import useTags from "./useTags";

interface TagGroup {
    name: string;
    tags: string[];
}

interface UseGroupedTagsResult extends QueryResult {
    groups: TagGroup[];
}

const useGroupedTags = (): UseGroupedTagsResult => {
    const { tags, isSuccess, isLoading, isError } = useTags();

    const groups = tags.reduce((groups: TagGroup[], tag: string) => {
        const groupName = /[A-Z]/i.test(tag[0]) ? tag[0].toUpperCase() : '0-9';
        const existingGroups = groups.filter(g => g.name === groupName);

        if (!existingGroups.length)
            return [...groups, { name: groupName, tags: [tag] }];

        existingGroups[0].tags.push(tag);
        return [...groups];
    }, [] as TagGroup[]);

    return {
        groups,
        isSuccess,
        isLoading,
        isError
    };
};

export default useGroupedTags;
