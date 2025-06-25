import { useEffect, useState } from "react"
import axios from "axios";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
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
        try {
            const response = await axios.get(url);
            const data = await response.data;
            setData(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error);
        }
    };

    return { data, loading, error, reFetch };
};

export default useFetch;