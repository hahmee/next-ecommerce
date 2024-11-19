import { useQuery } from '@tanstack/react-query';
import {useEffect, useState} from "react";
import {getCategories} from "@/api/adminAPI";

type CarDetail = {
    detailDate: string;
    detailTime: string;
    comments: string;
}

const useCarEventDetails = () => {
    const [carDetails, setCarDetails] = useState<CarDetail[] | null>(null);
    const hookErrorName = 'Car Event Details';
    const queryKey = ['new-products'];

    const { data, error, isLoading, isError } = useQuery({
        queryKey,
        queryFn: async () => {
            try {
                const response = await getCategories();
                return response.data;
            } catch (err) {
                throw new Error(`Fetching of ${hookErrorName} Hook failed`);
            }
        },
    });

    useEffect(() => {
        if (data && data.length >= 1) {
            setCarDetails(data);
        } else {
            setCarDetails(null);
        }
    }, [data]);

    return {
        carDetails,
        isLoading,
        isError,
        error,
    };
};

export default useCarEventDetails;