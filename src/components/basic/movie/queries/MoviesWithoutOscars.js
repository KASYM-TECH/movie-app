import React, { useEffect, useState } from 'react';
import { apiService } from '../../../api';
import { useNavigate } from 'react-router-dom';
import {useWebSocket} from "../../../socket";
import {useSelector} from "react-redux";
import {useError} from "../../../../ErrorProvider";

const MoviesWithoutOscars = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate();
    const { upd } = useWebSocket();
    const userInfo = useSelector((state) => state.user.userInfo);
    const [error, setError] = useState(null);

    const fetchMovies = () => {
        apiService.get(navigate, '/queries/allWithNoOscars')
            .then(data => {
                setMovies(data || []);
            });
    };

    useEffect(() => {
        fetchMovies();
    }, [upd]);

    const getPaginatedMovies = () => {
        const startIndex = currentPage * itemsPerPage;
        return movies.slice(startIndex, startIndex + itemsPerPage);
    };

    const editMovie = (id) => {
        navigate(`/movie/edit/${id}`);
    };

    const goToNextPage = () => {
        if (currentPage < Math.ceil(movies.length / itemsPerPage) - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div>
            <h3>Movies Without Oscars</h3>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Name</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Budget</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Total Box Office</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Genre</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Director</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Screenwriter</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Operator</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Coordinates</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Creation Date</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Oscars Count</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Mpaa Rating</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Length</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Golden Palm Count</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Tagline</th>
                    <th style={{border: '1px solid #ddd', padding: '10px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {getPaginatedMovies().map(movie => (
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
                                {(movie.creatorId === +userInfo.userId) || (userInfo.role === "Admin" && userInfo.allowAdminEdit)
                                    ? "Edit" : "View"}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <button onClick={goToPreviousPage} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>
                    Page {currentPage + 1} of {Math.ceil(movies.length / itemsPerPage)}
                </span>
                <button onClick={goToNextPage} disabled={currentPage >= Math.ceil(movies.length / itemsPerPage) - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

const appStyle = {
    backgroundSize: 'cover', // Makes sure the image covers the entire background
    backgroundPosition: 'center', // Centers the image
    height: '100vh', // 100% height of the viewport
    width: '100%',
};

export default MoviesWithoutOscars;
