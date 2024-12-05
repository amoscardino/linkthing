
export default interface Bookmark {
    id: number;
    url: string;
    title: string;
    description: string | null;
    website_title: string | null;
    website_description: string | null;
    is_archived: boolean;
    unread: boolean;
    shared: boolean;
    tag_names?: string[];
    date_added: string;
    date_modified: string | null;
    favicon_url: string | null;
    preview_url: string | null;
}
