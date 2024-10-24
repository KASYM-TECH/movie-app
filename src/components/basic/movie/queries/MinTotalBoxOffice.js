import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../api';
import {useError} from "../../../../ErrorProvider";

const MinTotalBoxOffice = () => {
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await apiService.get(navigate, '/queries/minTotalBoxOffice');
                if (id !== "0") {
                    navigate("/movie/edit/" + id);
                }
            } catch (error) {
                navigate("/movie");
            }
        };

        fetchData();
    }, [navigate]);

    return <div>Loading...</div>; // You can customize this loading message
};

export default MinTotalBoxOffice;