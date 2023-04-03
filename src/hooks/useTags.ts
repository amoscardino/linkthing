import { useQuery } from "@tanstack/react-query";
import { getTags } from "api/linkdigApi";
import { QueryResult } from "types/results";

interface UseTagsResult extends QueryResult {
    tags: string[];
}

const useTags = (): UseTagsResult => {
    const {
        data,
        isSuccess,
        isLoading,
        isError
    } = useQuery(['tags'], () => getTags());

    const tags = [...(data || [])].sort();

    return {
        tags,
        isSuccess,
        isLoading,
        isError
    };
};

export default useTags;
