import { useEffect, useState } from "react";
import { App } from '@capacitor/app';
import { useIonModal } from "@ionic/react";
import AddPage from "pages/AddPage";
import { PluginListenerHandle } from "@capacitor/core";

const useAddNewUrl = (containingPage: HTMLElement | null, onChanges: () => Promise<void>) => {
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        let listener = null as PluginListenerHandle | null;

        (async () => {
            listener = await App.addListener('appUrlOpen', data => {
                if (!data.url.length)
                    return;

                const parsedUrl = new URL(data.url);

                console.log(`Launch URL: ${parsedUrl}`);

                if (parsedUrl.protocol !== 'linkthing:' && parsedUrl.pathname !== '/add')
                    return;

                setUrl(parsedUrl.searchParams.get('url') || '');
            });
        })();

        return () => {
            listener?.remove();
        };
    }, [setUrl]);

    const handleUrlModalDismiss = async (anyChanges: boolean) => {
        setUrl('');

        if (anyChanges)
            await onChanges();

        dismissUrlModal();
    };

    const [showUrlModal, dismissUrlModal] = useIonModal(AddPage, { url, dismiss: handleUrlModalDismiss });

    useEffect(() => {
        if (url.length) {
            showUrlModal({
                canDismiss: true,
                presentingElement: containingPage || undefined
            });
        }
    }, [url, showUrlModal, containingPage]);

    return {
        url,
        setUrl
    };
};

export default useAddNewUrl;
