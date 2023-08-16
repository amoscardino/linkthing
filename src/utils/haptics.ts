import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * Taps the device with a light impact.
 */
const tapLight = async (): Promise<void> => {
    await Haptics.impact({ style: ImpactStyle.Light });
};

/**
 * Taps the device with a medium impact.
 */
const tapMedium = async (): Promise<void> => {
    await Haptics.impact({ style: ImpactStyle.Medium });
};

/**
 * Taps the device with a heavy impact.
 */
const tapHeavy = async (): Promise<void> => {
    await Haptics.impact({ style: ImpactStyle.Heavy });
};

export {
    tapLight,
    tapMedium,
    tapHeavy
};
