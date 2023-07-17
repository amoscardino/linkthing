import { BrowserMode } from "types/browserMode";
import { ItemMode } from "types/itemMode";
import { ViewMode } from "types/viewMode";

export interface Settings {
    instanceUrl?: string;
    token?: string;
    disableClipboard?: boolean;
    initialViewMode?: ViewMode;
    listItemMode?: ItemMode;
    browserMode?: BrowserMode;
}
