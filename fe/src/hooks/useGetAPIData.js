import { useEffect, useState } from 'react';

function useGetAPIData(fetcher, initialData, dependencies = []) {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await fetcher()
                .then((result) => {
                    setData(result);
                })
                .catch((error) => {
                    console.log(error);
                    setIsError(true);
                });
            setIsLoading(false);
        };
        setIsError(false);
        setIsLoading(true);

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { data, isLoading, isError };
}

export default useGetAPIData;
