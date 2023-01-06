import React, { useEffect, useState } from "react";
import * as settingsApi from "../api/settingsApi";
import { Settings } from "../api/types/settings";
import queryClient from "../utils/queryClient";

interface UseSettingsResult {
    settings: Settings;
    setSettings: (value: React.SetStateAction<Settings>) => void;
    persistSettings: () => Promise<void>;
}

const useSettings = (): UseSettingsResult => {
    const [settings, setSettings] = useState({} as Settings);

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await settingsApi.getSettings();
            setSettings(settings);
        };

        loadSettings();
    }, []);

    const persistSettings = async (): Promise<void> => {
        await settingsApi.saveSettings(settings);
        queryClient.invalidateQueries();
    };

    return {
        settings,
        setSettings,
        persistSettings
    };
};

export default useSettings;
