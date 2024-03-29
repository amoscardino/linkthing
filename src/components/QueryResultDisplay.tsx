import { QueryResult } from "../types/results";
import EmptyMessage from "./EmptyMessage";
import ErrorMessage from "./ErrorMessage";
import FullWidthColumn from "./FullWidthColumn";
import Loader from "./Loader";
import StandardColumn from "./StandardColumn";

interface QueryResultDisplayProps extends QueryResult {
    /** Optional prop to determine if the `emptyRender` prop should be used. `isSuccess` must also 
     * be true. */
    isEmpty?: boolean;

    /** Content to render when isSuccess is true.  */
    successRender: () => JSX.Element;

    /** Message to show if `isError` is true. Will be wrapped in an `ErrorMessage` component. */
    errorMessage: string;

    /** Content to render if `isSuccess` and `isEmpty` are both true. Can be a string or JSX. Will be 
     * wrapped in an `EmptyMessage` component.
     */
    emptyRender?: () => JSX.Element | string;

    fullWidth?: boolean;
}

const QueryResultDisplay = (props: QueryResultDisplayProps): JSX.Element | null => {
    if (props.isLoading)
        return <Loader />;

    if (props.isError)
        return <ErrorMessage>{props.errorMessage}</ErrorMessage>;

    if (!props.isSuccess)
        return null;

    if ((props.isEmpty || false) && props.emptyRender !== undefined)
        return <EmptyMessage>{props.emptyRender()}</EmptyMessage>;

    return props.fullWidth
        ? <FullWidthColumn>{props.successRender()}</FullWidthColumn>
        : <StandardColumn>{props.successRender()}</StandardColumn>;
};

export default QueryResultDisplay;
