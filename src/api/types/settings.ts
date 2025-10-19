import { BrowserMode } from "types/browserMode";
import { ItemMode } from "types/itemMode";
import { ViewMode } from "types/viewMode";

export interface CustomHeader {
  id: string;
  name: string;
  value: string;
}

export interface Settings {
  instanceUrl?: string;
  token?: string;
  disableClipboard?: boolean;
  initialViewMode?: ViewMode;
  listItemMode?: ItemMode;
  browserMode?: BrowserMode;
  showFavicons?: boolean;
  customHeaders?: CustomHeader[];
}
