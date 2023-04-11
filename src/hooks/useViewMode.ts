import { getSettings } from "api/settingsApi";
import React, { useEffect, useState } from "react";

type ViewMode = 'unread' | 'all' | null;

interface UseViewModeResult {
    viewMode: ViewMode,
    setViewMode: (value: React.SetStateAction<ViewMode>) => void
}

const useViewMode = (): UseViewModeResult => {
    const [viewMode, setViewMode] = useState<ViewMode>(null);

    useEffect(() => {
        const loadInitialValue = async () => {
            const settings = await getSettings();

            setViewMode(settings.initialViewMode || 'unread');
        };

        loadInitialValue();
    }, []);

    return {
        viewMode,
        setViewMode
    }
};

export default useViewMode;
