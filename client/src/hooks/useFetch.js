import { useEffect, useState } from "react";
import { httpClient, toApiPath } from "../shared/api/httpClient";

/**
 * Fetches JSON from the API once; optional reFetch for manual refresh.
 */
const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                const response = await httpClient.get(toApiPath(url));
                const data = await response.data;
                setData(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error);
            }
        };
        fetchData();
    }, [url]);


    const reFetch = async () => {
        if (!url) return;
        try {
            const response = await httpClient.get(toApiPath(url));
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error);
        }
    };

    return { data, loading, error, reFetch };
};

export default useFetch;