import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import { useWebSocket } from "../../socket";
import SelectPerson from "../person/SelectPerson";
import SelectCoordinates from "../coordinates/SelectCoordinates";
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider"; // Component to select director, screenwriter, or operator

const EditMovie = () => {
    const { id } = useParams();  // Get the movie ID from the URL
    const navigate = useNavigate(); // For navigation after actions
    const { upd } = useWebSocket();
    const userInfo = useSelector((state) => state.user.userInfo);

    const [movie, setMovie] = useState({
        name: '', coordinates: { x: '', y: '' }, oscarsCount: 0, budget: 0,
        totalBoxOffice: 0, mpaaRating: '', director: {}, screenwriter: {}, operator: {},
        length: 0, goldenPalmCount: 0, tagline: '', genre: ''
    });
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [showSelectScreenwriter, setShowSelectScreenwriter] = useState(false);
    const [showSelectDirector, setShowSelectDirector] = useState(false);
    const [showSelectOperator, setShowSelectOperator] = useState(false);
    const [showSelectCoordinates, setShowSelectCoordinates] = useState(false);

    const allowEdit = ()=> {
        return movie.creatorId === +userInfo.userId || (userInfo.role === "Admin" && movie.allowAdminEdit)
    }

    useEffect(() => {
        apiService.get(navigate, `/movies/${id}`)
            .then(data => {
                setMovie(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error loading movie');
                setLoading(false);
            });
    }, [id, upd]);

    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
        if (type === 'checkbox') {
            setMovie((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setMovie((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleUpdate = () => {
        if (!movie.screenwriter) {
            setError('Screenwriter is required.');
            return;
        }

        if (!(movie.coordinates.x && movie.coordinates.y)) {
            setError('Coordinates are required.');
            return;
        }

        if (!movie.tagline) {
            setError('Tagline is required.');
            return;
        }

        if (!movie.genre) {
            setError('Genre is required.');
            return;
        }

        if (!movie.mpaaRating) {
            setError('MPAA Rating is required.');
            return;
        }

        if (!movie.name) {
            setError('Movie name is required.');
            return;
        }

        if (movie.oscarsCount <= 1 || (movie.oscarsCount + "").includes(".")) {
            setError('Oscars count must be greater than 1 and int');
            return;
        }

        if (movie.budget <= 1) {
            setError('Budget must be greater than 1.');
            return;
        }

        if (movie.totalBoxOffice <= 1) {
            setError('Total box office must be greater than 1.');
            return;
        }

        if (!movie.director) {
            setError('Director is required.');
            return;
        }

        if (!movie.operator) {
            setError('Operator is required.');
            return;
        }

        if (movie.length <= 1 || (movie.length + "").includes(".")) {
            setError('Movie length must be greater than 1 and int');
            return;
        }

        if (movie.goldenPalmCount <= 1 || (movie.goldenPalmCount + "").includes(".")) {
            setError('Golden Palm count must be greater than 1 and int');
            return;
        }

        delete movie.creationDate

        apiService.put(navigate, `/movies/${id}`, movie)
            .then(() => {
                setError('Movie updated successfully');
                navigate('/');
            })
            .catch(err => setError('Error updating movie'));
    };

    const handleDelete = (replaceDirector) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            apiService.delete(navigate, `/movies/${id}`)
                .then(() => {
                    setError('Movie deleted successfully');
                    navigate('/');
                })
                .catch(err => setError('Error deleting movie'));
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <h3>Edit Movie</h3>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <div style={{marginBottom: '20px'}}>
                <label>
                    Movie Name:
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="name"
                        value={movie.name}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Budget:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="budget"
                        value={movie.budget}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Total Box Office:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="totalBoxOffice"
                        value={movie.totalBoxOffice}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Oscars Count:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="oscarsCount"
                        value={movie.oscarsCount}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Rating:
                    <select
                        disabled={!allowEdit()}
                        name="rating"
                        value={movie.mpaaRating}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    >
                        <option value="">SELECT</option>
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="R">R</option>
                        <option value="NC_17">NC-17</option>
                    </select>
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Length:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="length"
                        value={movie.length}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Golden Palm Count:
                    <input
                        min={0}
                        disabled={!allowEdit()}
                        type="number"
                        name="goldenPalmCount"
                        value={movie.goldenPalmCount}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Tagline:
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="tagline"
                        value={movie.tagline}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Genre:
                    <select
                        disabled={!allowEdit()}
                        name="genre"
                        value={movie.genre}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    >
                        <option value="">SELECT</option>
                        <option value="DRAMA">DRAMA</option>
                        <option value="COMEDY">COMEDY</option>
                        <option value="TRAGEDY">TRAGEDY</option>
                        <option value="THRILLER">THRILLER</option>
                    </select>
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Director <button style={{backgroundColor:'white', borderRadius:'5px'}} onClick={()=>navigate("/person/edit/" + movie.director.id)}>view</button>
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="director"
                        value={movie.director?.name || ""}
                        onClick={() => setShowSelectDirector(true)}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
                <div style={{marginBottom: '20px'}} onClick={() => setShowSelectDirector(true)}>
                </div>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Screenwriter: <button style={{backgroundColor: 'white', borderRadius: '5px'}}
                                          onClick={() => navigate("/person/edit/" + movie.screenwriter.id)}>view</button>
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="director"
                        value={movie.screenwriter?.name || ""}
                        onClick={() => setShowSelectScreenwriter(true)}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
                <div style={{marginBottom: '20px'}} onClick={() => setShowSelectScreenwriter(true)}>
                </div>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Operator: <button style={{backgroundColor: 'white', borderRadius: '5px'}}
                                      onClick={() => navigate("/person/edit/" + movie.operator.id)}>view</button>
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="director"
                        value={movie.operator?.name || ""}
                        onClick={() => setShowSelectOperator(true)}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
                <div style={{marginBottom: '20px'}} onClick={() => setShowSelectOperator(true)}>
                </div>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Coordinates: <button style={{backgroundColor: 'white', borderRadius: '5px'}}
                                         onClick={() => navigate("/coordinates/edit/" + movie.coordinates.id)}>view</button>
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="coordinates"
                        value={movie.operator?.name || ""}
                        onClick={() => setShowSelectOperator(true)}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
                <div style={{marginBottom: '20px'}} onClick={() => setShowSelectCoordinates(true)}>
                </div>
            </div>

            <button
                onClick={handleUpdate}
                disabled={!allowEdit()}
                style={{
                    background: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    marginRight: '10px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Update
            </button>
            <button
                onClick={handleDelete}
                disabled={!allowEdit()}
                style={{
                    background: '#f44336',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Delete
            </button>
            {showSelectDirector &&
                <SelectPerson cw={() => setShowSelectDirector(false)} onSelected={person => {
                    setMovie(prev => ({...prev, director: person}))
                }}/>}
            {showSelectScreenwriter &&
                <SelectPerson cw={() => setShowSelectScreenwriter(false)} onSelected={person => {
                    setMovie(prev => ({...prev, screenwriter: person}))
                }}/>}
            {showSelectOperator &&
                <SelectPerson cw={() => setShowSelectOperator(false)} onSelected={person => {
                    setMovie(prev => ({...prev, operator: person}))
                }}/>}
            {showSelectCoordinates &&
                <SelectCoordinates cw={() => setShowSelectOperator(false)} onSelected={coordinates => {
                    setMovie(prev => ({...prev, coordinates: coordinates}))
                }}/>}

        </div>
    );
};

export default EditMovie;
