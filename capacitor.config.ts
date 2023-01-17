import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.moscardino.LinkThing',
    appName: 'LinkThing',
    webDir: 'build',
    bundledWebRuntime: false,
    plugins: {
        CapacitorHttp: {
            enabled: true
        }
    }
};

export default config;
