import React, { useEffect, useState } from "react";
import * as settingsApi from "api/settingsApi";
import { Settings } from "api/types/settings";
import { useQueryClient } from "@tanstack/react-query";

interface UseSettingsResult {
    settings: Settings;
    setSettings: (value: React.SetStateAction<Settings>) => void;
    persistSettings: () => Promise<void>;
}

const useSettings = (): UseSettingsResult => {
    const [settings, setSettings] = useState({} as Settings);
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await settingsApi.getSettings();
            setSettings(settings);
        };

        loadSettings();
    }, []);

    const persistSettings = async (): Promise<void> => {
        await settingsApi.saveSettings(settings);
        await queryClient.invalidateQueries();
    };

    return {
        settings,
        setSettings,
        persistSettings
    };
};

export default useSettings;
