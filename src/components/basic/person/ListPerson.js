import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../socket';
import { apiService } from '../../api';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const ListPersons = () => {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Items per page
    const { upd } = useWebSocket();
    const [sortBy, setSortBy] = useState("id"); // Default sort by id
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user.userInfo);
    
    const [filterName, setFilterName] = useState("")
    const [filterEyeColor, setFilterEyeColor] = useState("")
    const [filterHairColor, setFilterHairColor] = useState("")
    const [filterNationality, setFilterNationality] = useState("")

    const fetchPersons = (page = 0, pageSize = itemsPerPage, sort = sortBy) => {
        let url = `/persons?page=${page}&pageSize=${pageSize}&sortBy=${sort}`
        if(filterName !== "") {
            url += "&filterName=" + filterName
        }
        if(filterEyeColor !== "") {
            url += "&filterEyeColor=" + filterEyeColor
        }
        if(filterHairColor !== "") {
            url += "&filterHairColor=" + filterHairColor
        }
        if(filterNationality !== "") {
            url += "&filterNationality=" + filterNationality
        }
        console.log(url)
        apiService.get(navigate, url)
            .then(data => {
                setList(data || []);
            });
    };

    useEffect(() => {
        fetchPersons(currentPage);
    }, [upd, currentPage, sortBy, filterName, filterEyeColor, filterHairColor, filterNationality]);

    const editPerson = (id) => {
        navigate(`/person/edit/${id}`);
    };

    const addPerson = () => {
        navigate("/person/create");
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
            <h3>Manage Persons</h3>

            {/* Sort dropdown */}
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="sortBy">Sort by: </label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="height">Height</option>
                    <option value="nationality">Nationality</option>
                </select>
            </div>

            {/* Persons Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Name
                        <div>
                            <input type="text" placeholder={'filter value'} value={filterName}
                                   onChange={(target) => setFilterName(target.target.value)}></input>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Eye Color
                        <div>
                            <select value={filterEyeColor}
                                    onChange={(target) => {
                                        setFilterEyeColor(target.target.value)
                                    }}>
                                <option value="">SELECT FILTER</option>
                                <option value="GREEN">GREEN</option>
                                <option value="RED">RED</option>
                                <option value="BLUE">BLUE</option>
                                <option value="YELLOW">YELLOW</option>
                                <option value="WHITE">WHITE</option>
                            </select>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Hair Color
                        <div>
                            <select value={filterHairColor}
                                    onChange={(target) => {
                                        setFilterHairColor(target.target.value)
                                    }}>
                                <option value="">SELECT FILTER</option>
                                <option value="GREEN">GREEN</option>
                                <option value="RED">RED</option>
                                <option value="BLUE">BLUE</option>
                                <option value="YELLOW">YELLOW</option>
                                <option value="WHITE">WHITE</option>
                            </select>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Height</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Nationality
                        <div>
                            <select value={filterNationality}
                                    onChange={(target) => {
                                        setFilterNationality(target.target.value)
                                    }}>
                                <option value="">SELECT FILTER</option>
                                <option value="RUSSIA">RUSSIA</option>
                                <option value="UNITED_KINGDOM">UNITED_KINGDOM</option>
                                <option value="SOUTH_KOREA">SOUTH_KOREA</option>
                            </select>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Actions</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Location</th>
                </tr>
                </thead>
                <tbody>
                {list.map(person => (
                    <tr key={person.id}>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{person.name}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{person.eyeColor || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{person.hairColor || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{person.height}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{person.nationality || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}} onClick={()=>navigate(`/location/edit/${person.location.id}`)}>x: {person.location.x}, y: {person.location.y}, name: {person.location.name}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>
                            <button onClick={() => editPerson(person.id)}>
                                {(person.creatorId === +userInfo.userId) || (userInfo.role === "Admin" && person.allowAdminEdit)
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
                <button onClick={addPerson}>Add Person</button>
            </div>
        </div>
    );
};

export default ListPersons;
