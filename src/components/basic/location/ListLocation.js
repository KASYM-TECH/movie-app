import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../socket';
import { apiService } from '../../api';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const ListLocations = () => {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Items per page
    const { upd } = useWebSocket();
    const [sortBy, setSortBy] = useState("id"); // Default sort by id
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const userInfo = useSelector((state) => state.user.userInfo);

    const [filterName, setFilterName] = useState("")

    // Fetch locations from backend with pagination
    const fetchLocations = (page = 0, pageSize = itemsPerPage, sort = sortBy) => {
        let url = `/locations?page=${page}&pageSize=${pageSize}&sortBy=${sort}`
        if(filterName !== "") {
            url += "&filterName=" + filterName
        }
        console.log(url)
        apiService.get(navigate, url)
            .then(data => {
                setList(data || []); // Assuming 'content' contains list items
            });
    };

    useEffect(() => {
        fetchLocations(currentPage);
    }, [upd, currentPage, sortBy, filterName]);

    const editLocation = (id) => {
        navigate(`/location/edit/${id}`);
    };

    const addLocation = () => {
        navigate("/location/create");
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
            <h3>Manage Locations</h3>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="sortBy">Sort by: </label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="id">ID</option>
                    <option value="x">X Coordinate</option>
                    <option value="y">Y Coordinate</option>
                    <option value="z">Z Coordinate</option>
                    <option value="name">Name</option>
                </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>X</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>Y</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px' }}>Z</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Name
                        <div>
                            <input type="text" placeholder={'filter value'} value={filterName}
                                   onChange={(target) => setFilterName(target.target.value)}></input>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {list.map(location => (
                    <tr key={location.id}>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{location.x}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{location.y}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{location.z}</td>
                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{location.name}</td>
                            <td style={{border: '1px solid #ddd', padding: '10px'}}>
                                <button onClick={() => editLocation(location.id)}>
                                    {(location.creatorId === +userInfo.userId) || (userInfo.role === "Admin" && location.allowAdminEdit)
                                        ? "Edit" : "View"}
                                </button>
                            </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
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
                <button onClick={addLocation}>Add Location</button>
            </div>
        </div>
    );
};

export default ListLocations;
