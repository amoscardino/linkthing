import { BrowserMode } from "types/browserMode";
import { ViewMode } from "types/viewMode";

export interface Settings {
    instanceUrl?: string;
    token?: string;
    disableClipboard?: boolean;
    initialViewMode?: ViewMode;
    browserMode?: BrowserMode;
}
