import { format, parseISO } from "date-fns";
import { getDomain } from "utils/urls";

interface ListItemDateAndDomainProps {
    date: string;
    url: string;
    small?: boolean;
}

const ListItemDateAndDomain = ({ date, url, small }: ListItemDateAndDomainProps) => {
    const content = (
        <>
            {format(parseISO(date), 'MMM d, yyyy')}
            <span> — </span>
            {getDomain(url)}
        </>
    )

    return small
        ? (
            <p>
                <small>
                    {content}
                </small>
            </p>
        )
        : (
            <p>
                {content}
            </p>
        );
};

export default ListItemDateAndDomain;
