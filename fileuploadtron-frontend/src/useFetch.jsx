import {useState, useEffect} from 'react';


function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const loadingTime = 500;

    useEffect(() => {
        setTimeout(()=>{
            fetch(url)
                .then(response => { return response.json(); } )
                .then(resp_json => {
                    setData(resp_json);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('error getting test:', error);
                    setIsLoading(false);
                });
        }, loadingTime);
    },[url]);   // dk y

    return {data, isLoading};
}

export default useFetch;