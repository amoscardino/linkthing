import { RefresherEventDetail } from "@ionic/core";
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import { forwardRef } from "react";
import { WithChildrenProps } from "../types/props";
import { tapLight } from "../utils/haptics";

interface StandardPageProps extends WithChildrenProps {
    /** Page title. Shows in the header bar. Will use large title styles on iOS. */
    title: string;

    /** JSX to show inside an `IonButtons` element in the primary header slot. */
    primaryButton?: JSX.Element;

    /** JSX to show inside an `IonButtons` element in the secondary header slot. */
    secondaryButton?: JSX.Element;

    /** If defined, an `IonRefresher` component will be added to the `IonContent` fixed slot
     * and this handler will be called from `onIonRefresh`.
      */
    onPullToRefresh?: () => Promise<void>,

    /** JSX to show inside an `IonFooter` element. Should be either an `IonToolbar` or `undefined`. */
    footer?: JSX.Element,
}

const StandardPage = forwardRef<HTMLElement, StandardPageProps>((props, ref) => {
    const pullToRefreshHandler = async (event: CustomEvent<RefresherEventDetail>) => {
        await props.onPullToRefresh!();
        await tapLight();

        event.detail.complete();
    };

    return (
        <IonPage ref={ref}>
            <IonHeader translucent>
                <IonToolbar>
                    {props.secondaryButton !== undefined && (
                        <IonButtons slot="secondary">
                            {props.secondaryButton}
                        </IonButtons>
                    )}

                    {props.primaryButton !== undefined && (
                        <IonButtons slot="primary">
                            {props.primaryButton}
                        </IonButtons>
                    )}

                    <IonTitle>{props.title}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{props.title}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {props.onPullToRefresh !== undefined && (
                    <IonRefresher slot="fixed" onIonRefresh={pullToRefreshHandler}>
                        <IonRefresherContent pullingIcon="lines" refreshingSpinner="lines" />
                    </IonRefresher>
                )}

                {props.children}
            </IonContent>

            {props.footer && (
                <IonFooter translucent collapse="fade">
                    {props.footer}
                </IonFooter>
            )}
        </IonPage>
    );
});

export default StandardPage;
