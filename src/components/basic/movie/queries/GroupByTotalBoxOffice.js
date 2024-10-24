import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../api';
import {useError} from "../../../../ErrorProvider";

const BoxOfficeData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // For navigation after actions
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.get(navigate, '/queries/groupByTotalBoxOffice');
                setData(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={central}>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <h1>Group By Total Box Office</h1>
            <table style={general}>
                <thead>
                <tr>
                    <th>Total Box Office</th>
                    <th>Count</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.totalBoxOffice.toFixed(3)}</td>
                        <td>{item.count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const general = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
}

const central = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    margin: '0 auto', // Center the div itself if it has a width
};

export default BoxOfficeData;
