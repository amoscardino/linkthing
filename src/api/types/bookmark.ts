
export default interface Bookmark {
    id: number;
    url: string;
    title: string;
    description: string | null;
    website_title: string | null | null;
    website_description: null;
    is_archived: boolean;
    unread: boolean;
    shared: boolean;
    tag_names: any[];
    date_added: string;
    date_modified: string | null;
}
