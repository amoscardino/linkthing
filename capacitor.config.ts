import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.moscardino.LinkThing',
    appName: 'LinkThing',
    webDir: 'build',
    plugins: {
        CapacitorHttp: {
            enabled: true
        }
    }
};

export default config;
