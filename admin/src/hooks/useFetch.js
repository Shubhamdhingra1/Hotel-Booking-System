import { useEffect, useState } from "react";
import { httpClient, toApiPath } from "../shared/api/httpClient";

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
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(err);
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
        } catch (err) {
            setLoading(false);
            setError(err);
        }
    };

    return { data, loading, error, reFetch };
};

export default useFetch;
