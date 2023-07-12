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

    const groups = tags
        .reduce((groups: TagGroup[], tag: string) => {
            const groupName = /[A-Z]/.test(tag[0].toUpperCase()) ? tag[0].toUpperCase() : '#';
            const existingGroups = groups.filter(g => g.name === groupName);

            if (!existingGroups.length)
                return [...groups, { name: groupName, tags: [tag] }];

            existingGroups[0].tags.push(tag);
            return [...groups];
        }, [] as TagGroup[])
        .sort((a, b) => a.name === "#" ? -1 : a.name.localeCompare(b.name));

    for (let group of groups)
        group.tags.sort((a, b) => a.localeCompare(b));

    return {
        groups,
        isSuccess,
        isLoading,
        isError
    };
};

export default useGroupedTags;
