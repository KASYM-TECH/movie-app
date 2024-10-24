import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../socket';
import { apiService } from '../../api';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const ListCoordinates = () => {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Items per page
    const { upd } = useWebSocket();
    
    const [sortBy, setSortBy] = useState("id"); // Default sort by id
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user.userInfo);

    const fetchCoordinates = (page = 0, pageSize = itemsPerPage, sort = sortBy) => {
        apiService.get(navigate, `/coordinates?page=${page}&pageSize=${pageSize}&sortBy=${sort}`)
            .then(data => {
                setList(data || []);
            });
    };

    useEffect(() => {
        fetchCoordinates(currentPage);
    }, [currentPage, sortBy, upd]);

    const editCoordinate = (id) => {
        navigate(`/coordinates/edit/${id}`)
    };

    const addCoordinate = () => {
        navigate("/coordinates/create")
    };

    const goToNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    return (
        <div
            style={{
                top: '20px',
                left: '20px',
                right: '20px',
                bottom: '20px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.3s ease-in-out',
            }}
        >
            <h3>Manage Coordinates</h3>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="sortBy">Sort by: </label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="id">ID</option>
                    <option value="x">X Coordinate</option>
                    <option value="y">Y Coordinate</option>
                </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>X</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>Y</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {list.map(c => (
                    <tr key={c.id}>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{c.x}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{c.y}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                            <button onClick={() => editCoordinate(c.id)}>
                                {(c.creatorId === +userInfo.userId) || (userInfo.role === "Admin" && c.allowAdminEdit)
                                    ? "Edit" : "View"}
                                </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <button onClick={goToPreviousPage} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>
                    Page {currentPage}
                </span>
                <button onClick={goToNextPage} disabled={!list.length}>
                    Next
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={addCoordinate}>Add Coordinate</button>
            </div>
        </div>
    );
};

export default ListCoordinates;
