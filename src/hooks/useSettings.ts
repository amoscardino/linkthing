import React, { useEffect, useState } from "react";
import { Settings } from "api/types/settings";
import { useQueryClient } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import hasSettingsAtom from "state/hasSettingsState";
import { getSettings, saveSettings } from "api/settingsApi";
import browserSettingAtom from "state/browserSettingState";
import listItemSettingAtom from "state/listItemSettingState";

interface UseSettingsResult {
    settings?: Settings;
    setSettings: (value: React.SetStateAction<Settings | undefined>) => void;
    persistSettings: () => Promise<void>;
}

const useSettings = (): UseSettingsResult => {
    const [, setHasSettings] = useRecoilState(hasSettingsAtom);
    const [, setBrowserSettings] = useRecoilState(browserSettingAtom);
    const [, setListItemSettings] = useRecoilState(listItemSettingAtom);
    const [settings, setSettings] = useState<Settings | undefined>(undefined);
    const queryClient = useQueryClient();

    useEffect(() => {
        const loadSettings = async () => {
            setSettings(await getSettings());
        };

        loadSettings();
    }, []);

    const persistSettings = async (): Promise<void> => {
        const hasSettings = settings !== undefined && (settings.instanceUrl?.length || 0) > 0 && (settings.token?.length || 0) > 0;

        setHasSettings(hasSettings);
        setBrowserSettings(settings?.browserMode || null);
        setListItemSettings(settings?.listItemMode || 'description');
        await saveSettings(settings);

        if (hasSettings)
            await queryClient.invalidateQueries();
    };

    return {
        settings,
        setSettings,
        persistSettings
    };
};

export default useSettings;
