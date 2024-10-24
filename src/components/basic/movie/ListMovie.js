import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../socket';
import { apiService } from '../../api';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const ListMovies = () => {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const { upd } = useWebSocket();
    const [sortBy, setSortBy] = useState("id");
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user.userInfo);
    
    const [filterName, setFilterName] = useState("");
    const [filterMpaaRating, setFilterMpaaRating] = useState("");
    const [filterGenre, setFilterGenre] = useState("");
    const [filterTagline, setFilterTagline] = useState("");

    const fetchMovies = (page = 0, pageSize = itemsPerPage, sort = sortBy) => {
        try {
            let url = `/movies?page=${page}&pageSize=${pageSize}&sortBy=${sort}`
            if(filterName !== "") {
                url += "&filterName=" + filterName
            }
            if(filterMpaaRating !== "") {
                url += "&filterMpaaRating=" + filterMpaaRating
            }
            if(filterGenre !== "") {
                url += "&filterGenre=" + filterGenre
            }
            if(filterTagline !== "") {
                url += "&filterTagline=" + filterTagline
            }

            apiService.get(navigate, url)
                .then(data => {
                    setList(data || []);
                });
        } catch {
            setList([])
        }
    };

    useEffect(() => {
        fetchMovies(currentPage);
    }, [upd, currentPage, sortBy, filterName, filterMpaaRating, filterGenre, filterTagline]);

    const editMovie = (id) => {
        navigate(`/movie/edit/${id}`);
    };

    const addMovie = () => {
        navigate("/movie/create");
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
            <h3>Manage Movies</h3>

            <div style={{marginBottom: '10px'}}>
                <label htmlFor="sortBy">Sort by: </label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="budget">Budget</option>
                    <option value="totalBoxOffice">Total Box Office</option>
                </select>
            </div>

            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                <tr>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Name
                        <div>
                            <input type="text" placeholder={'filter value'} value={filterName}
                                   onChange={(target)=>setFilterName(target.target.value)}></input>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Budget</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Total Box Office</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Genre
                        <div>
                            <select value={filterGenre}
                                onChange={(target)=>{setFilterGenre(target.target.value)}}>
                                <option value="">SELECT FILTER</option>
                                <option value="DRAMA">DRAMA</option>
                                <option value="COMEDY">COMEDY</option>
                                <option value="TRAGEDY">TRAGEDY</option>
                                <option value="THRILLER">THRILLER</option>
                            </select>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Director</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Screenwriter</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Operator</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Coordinates</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Creation Date</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Oscars Count</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Mpaa Rating
                        <div>
                            <select value={filterMpaaRating} onChange={(target)=>{setFilterMpaaRating(target.target.value)}}>
                                <option value="">SELECT FILTER</option>
                                <option value="G">G</option>
                                <option value="PG">PG</option>
                                <option value="R">R</option>
                                <option value="NC_17">NC_17</option>
                            </select>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Length</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Golden Palm Count</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Tagline
                        <div>
                            <input value={filterTagline} type="text" placeholder={'filter value'}
                               onChange={(target)=>{setFilterTagline(target.target.value)}}></input>
                        </div>
                    </th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {list.map(movie => (
                    <tr key={movie.id}>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.name}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.budget}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.totalBoxOffice}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.genre}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.director?.name || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.screenwriter?.name || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.operator?.name || "N/A"}</td>
                        <td style={{
                            border: '1px solid #ddd',
                            padding: '10px'
                        }}>{"x: " + movie.coordinates.x + ", y: " + movie.coordinates.y || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.creationDate || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.oscarsCount}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.mpaaRating || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.length}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.goldenPalmCount}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>{movie.tagline || "N/A"}</td>
                        <td style={{border: '1px solid #ddd', padding: '10px'}}>
                            <button onClick={() => editMovie(movie.id)}>
                                {((movie.creatorId === +userInfo.userId) || (userInfo.role === "Admin" && movie.allowAdminEdit))
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
                <button onClick={addMovie}>Add Movie</button>
            </div>
        </div>
    );
};

export default ListMovies;
