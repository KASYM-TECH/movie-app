import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api';
import {useWebSocket} from "../socket";
import {useError} from "../../ErrorProvider"; // Assuming you have a service to handle API calls

const AdminAllow = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { upd } = useWebSocket();
    

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'Admin') {
            setError('Access Denied. You must be an Admin.');
            navigate('/');
            return
        }
        apiService.get(navigate, '/admin?role=Admin')
            .then(data => {
                setRequests(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching users');
                setLoading(false);
            });
    }, [upd]);

    // Grant admin rights to a user
    const handleGrantAdmin = (requestId) => {
        apiService.post(navigate, `/admin?roleRequestId=${requestId}`)
            .then(() => {
                setError('Admin rights granted successfully');
            })
            .catch(err => setError('Error granting admin rights'));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <h3>Admin Management</h3>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Current Role</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                </tr>
                </thead>
                <tbody>
                {requests.map(req => (
                    <tr key={req.id}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.user.username}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                            {req.role === 'Admin' ? 'Admin' : 'User'}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                            {!req.fulfilled && (
                                <button
                                    onClick={() => handleGrantAdmin(req.id)}
                                    style={{
                                        background: '#4CAF50',
                                        color: 'white',
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Grant Admin
                                </button>
                            )}
                            {req.fulfilled && (
                                <span style={{ color: '#4CAF50' }}> ✅ </span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminAllow;
