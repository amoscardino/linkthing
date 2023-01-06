import { IonApp, setupIonicReact } from '@ionic/react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './utils/queryClient';
import ListPage from './pages/ListPage';

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
import './theme/variables.css';
import './theme/utils.css';

setupIonicReact({ mode: 'ios' });

const App = () => (
    <IonApp>
        <QueryClientProvider client={queryClient}>
            <ListPage />
        </QueryClientProvider>
    </IonApp>
);

export default App;
