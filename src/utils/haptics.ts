import { Haptics, ImpactStyle } from '@capacitor/haptics';

const tapLight = async (): Promise<void> => {
    await Haptics.impact({ style: ImpactStyle.Light });
};

const tapMedium = async (): Promise<void> => {
    await Haptics.impact({ style: ImpactStyle.Medium });
};

const tapHeavy = async (): Promise<void> => {
    await Haptics.impact({ style: ImpactStyle.Heavy });
};

export {
    tapLight,
    tapMedium,
    tapHeavy
};
