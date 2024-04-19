import { IonApp, setupIonicReact } from '@ionic/react';
import { useRecoilValue } from 'recoil';
import ListPage from 'pages/ListPage';
import SetupPage from 'pages/SetupPage';
import hasSettingsAtom from 'state/hasSettingsState';
import Loader from 'components/Loader';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import 'theme/utils.css';

setupIonicReact();

const App = () => {
    const hasSettings = useRecoilValue(hasSettingsAtom)

    return (
        <IonApp>
            {hasSettings !== null && (
                <>
                    {!hasSettings && (
                        <SetupPage />
                    )}

                    {hasSettings && (
                        <ListPage />
                    )}
                </>
            )}

            {hasSettings === null && (
                <Loader />
            )}
        </IonApp>
    );
};

export default App;
