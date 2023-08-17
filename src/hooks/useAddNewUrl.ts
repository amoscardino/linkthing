import { useEffect, useState } from "react";
import { useAppUrlOpen } from "@capacitor-community/app-react";
import { useIonModal } from "@ionic/react";
import AddPage from "pages/AddPage";

const useAddNewUrl = (containingPage: HTMLElement | null, onChanges: () => Promise<void>) => {
    const { appUrlOpen } = useAppUrlOpen();
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        if (!appUrlOpen?.length)
            return;

        const parsedUrl = new URL(appUrlOpen);

        console.log(`Launch URL: ${parsedUrl}`);

        if (parsedUrl.protocol !== 'linkthing:' && parsedUrl.pathname !== '/add')
            return;

        setUrl(parsedUrl.searchParams.get('url') || '');
    }, [appUrlOpen, setUrl]);

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
