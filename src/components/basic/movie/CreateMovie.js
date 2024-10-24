import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import SelectPerson from '../person/SelectPerson'; // Component to select director, screenwriter, or operator
import SelectCoordinates from '../coordinates/SelectCoordinates';
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider"; // Component to select coordinates

const CreateMovie = () => {
    const [movie, setMovie] = useState({
        name: '',
        coordinates: null,
        oscarsCount: 0,
        budget: 0,
        totalBoxOffice: 0,
        mpaaRating: '',
        director: null,
        screenwriter: null,
        operator: null,
        length: 0,
        creatorId: localStorage.getItem("userId"),
        goldenPalmCount: 0,
        tagline: '',
        genre: '',
        allowAdminEdit: false
    });



    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [showDirectorSelect, setShowDirectorSelect] = useState(false);
    const [showScreenwriterSelect, setShowScreenwriterSelect] = useState(false);
    const [showOperatorSelect, setShowOperatorSelect] = useState(false);
    const [showCoordinatesSelect, setShowCoordinatesSelect] = useState(false);
    const navigate = useNavigate();  // For redirecting after creation
    
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    useEffect(() => {
        if(!isLoggedIn) {
            navigate("/login")
        }
    }, [isLoggedIn]);

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

    const handlePersonSelect = (person, role) => {
        setMovie(prevState => ({ ...prevState, [role]: person }));
        setShowDirectorSelect(false);
        setShowScreenwriterSelect(false);
        setShowOperatorSelect(false);
    };

    const handleCoordinatesSelect = (coordinates) => {
        setMovie(prevState => ({ ...prevState, coordinates: coordinates }));
        setShowCoordinatesSelect(false);
    };

    const handleSubmit = () => {
        if (!movie.screenwriter) {
            setError('Screenwriter is required.');
            setError('Screenwriter is required.');
            return;
        }

        if (movie.coordinates === null) {
            setError('Coordinates are required.');
            setError('Coordinates are required.');
            return;
        }

        if (!movie.tagline) {
            setError('Tagline is required.');
            setError('Tagline is required.');
            return;
        }

        if (!movie.genre) {
            setError('Genre is required.');
            setError('Genre is required.');
            return;
        }

        if (!movie.mpaaRating) {
            setError('MPAA Rating is required.');
            setError('MPAA Rating is required.');
            return;
        }

        if (!movie.name) {
            setError('Movie name is required.');
            setError('Movie name is required.');
            return;
        }

        if (movie.oscarsCount <= 1 || (movie.oscarsCount + "").includes(".")) {
            setError('Oscars count must be greater than 1 and int');
            return;
        }

        if (movie.budget <= 1) {
            setError('Budget must be greater than 1.');
            setError('Budget must be greater than 1.');
            return;
        }

        if (movie.totalBoxOffice <= 1) {
            setError('Total box office must be greater than 1.');
            setError('Total box office must be greater than 1.');
            return;
        }

        if (!movie.director) {
            setError('Director is required.');
            setError('Director is required.');
            return;
        }

        if (!movie.operator) {
            setError('Operator is required.');
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

        apiService.post(navigate, '/movies', movie)
            .then(() => {
                setError('Movie created successfully');
               navigate('/');
            })
            .catch(err => setError('Error creating movie'));
    };

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
            <h3>Create New Movie</h3>

            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <div style={{marginBottom: '20px'}}>
                <label>
                    Movie Name:
                    <input
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
                        min={1}
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
                        min={1}
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
                        min={1}
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
                    Length (in minutes):
                    <input
                        min={1}
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
                        min={1}
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
                    Rating:
                    <select
                        name="mpaaRating"
                        value={movie.mpaaRating}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    >
                        <option value="">Select</option>
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="R">R</option>
                        <option value="NC_17">NC-17</option>
                    </select>
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Tagline:
                    <input
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
                    Allow admin edit:
                    <input
                        type="checkbox"
                        name="allowAdminEdit"
                        value={movie.allowAdminEdit}
                        onChange={handleInputChange}
                        style={{width:'30px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Director:
                    <input
                        type="text"
                        name="director"
                        value={movie.director?.name || ""}
                        onClick={() => setShowDirectorSelect(true)}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Operator:
                    <input
                        type="text"
                        name="director"
                        value={movie.operator?.name || ""}
                        onClick={() => setShowOperatorSelect(true)}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Screenwriter:
                    <input
                        type="text"
                        name="screenwriter"
                        value={movie.screenwriter?.name || ""}
                        onClick={() => setShowScreenwriterSelect(true)}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Coordinates:
                    <input
                        type="text"
                        value={`x: ${movie.coordinates?.x}, y: ${movie.coordinates?.y}`}
                        readOnly
                        onClick={() => setShowCoordinatesSelect(true)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            margin: '10px 0',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    />
                </label>
            </div>

            {showDirectorSelect && (
                <SelectPerson
                    onSelected={(person) => handlePersonSelect(person, 'director')}
                    cw={() => setShowDirectorSelect(false)}
                />
            )}
            {showScreenwriterSelect && (
                <SelectPerson
                    onSelected={(person) => handlePersonSelect(person, 'screenwriter')}
                    cw={() => setShowScreenwriterSelect(false)}
                />
            )}
            {showOperatorSelect && (
                <SelectPerson
                    onSelected={(person) => handlePersonSelect(person, 'operator')}
                    cw={() => setShowOperatorSelect(false)}
                />
            )}
            {showCoordinatesSelect && (
                <SelectCoordinates onSelected={handleCoordinatesSelect} cw={() => setShowCoordinatesSelect(false)}/>
            )}

            <button
                onClick={handleSubmit}
                style={{
                    background: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Create Movie
            </button>
        </div>
    );
};

export default CreateMovie;
