import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import { useWebSocket } from "../../socket";
import SelectLocation from "../location/SelectLocation";
import SelectPerson from "./SelectPerson";
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const EditPerson = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { upd } = useWebSocket();
    const userInfo = useSelector((state) => state.user.userInfo);

    const [person, setPerson] = useState({
        name: '',
        eyeColor: '',
        hairColor: '',
        location: null,
        height: 0,
        nationality: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [showLocationSelect, setShowLocationSelect] = useState(false);
    const [showPersonSelect, setShowPersonSelect] = useState(false);
    

    const allowEdit = ()=> {
        return person.creatorId === +userInfo.userId || (userInfo.role === "Admin" && person.allowAdminEdit)
    }

    useEffect(() => {
        apiService.get(navigate, `/persons/${id}`)
            .then(data => {
                setPerson(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error loading person');
                setLoading(false);
            });
    }, [id, upd]);

    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
        if (type === 'checkbox') {
            setPerson((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setPerson((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleUpdate = () => {
        if (person.name === '') {
            setError('Name is required.');
            setError('Name is required.');
            return;
        }

        if (person.height === '') {
            setError('Height is required.');
            setError('Height is required.');
            return;
        }

        if (person.location === null) {
            setError('Location is required.');
            setError('Location is required.');
            return;
        }

        if (person.height <= 0) {
            setError('Height must be greater than 0.');
            setError('Height must be greater than 0.');
            return;
        }

        if (person.hairColor === '') {
            setError('hairColor is required.');
            setError('hairColor is required.');
            return;
        }

        if (person.eyeColor === '') {
            setError('eyeColor is required.');
            setError('eyeColor is required.');
            return;
        }

        if (person.nationality === '') {
            setError('nationality is required.');
            setError('nationality is required.');
            return;
        }

        apiService.put(navigate, `/persons/${id}`, person)
            .then(() => {
                setError('Person updated successfully');
                navigate('/person/list');  // Redirect back to the persons list
            })
            .catch(err => setError('Error updating person'));
    };

    const handleDelete = (replacePerson) => {
        if (window.confirm('Are you sure you want to replace this person and delete the previous?')) {
            apiService.delete(navigate, `/persons/${id}?replaceId=${replacePerson.id}`)
                .then(() => {
                    setError('Person deleted successfully');
                    navigate('/person/list');  // Redirect back to the persons list
                })
                .catch(err => setError('Error deleting person'));
        }
    };

    const handleSelectLocation = (location) => {
        setPerson(prevState => ({ ...prevState, location: location }));
    }

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
            <h3>Edit Person</h3>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <div style={{marginBottom: '20px'}}>
                <label>
                    Name:
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="name"
                        value={person.name}
                        onChange={handleInputChange}
                        required
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Eye Color:
                    <select
                        disabled={!allowEdit()}
                        name="eyeColor"
                        value={person.eyeColor}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}>
                        <option value="">SELECT</option>
                        <option value="GREEN">GREEN</option>
                        <option value="RED">RED</option>
                        <option value="BLUE">BLUE</option>
                        <option value="YELLOW">YELLOW</option>
                        <option value="WHITE">WHITE</option>
                    </select>
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Hair Color:
                    <select
                        disabled={!allowEdit()}
                        name="hairColor"
                        value={person.hairColor}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    >
                        <option value="">SELECT</option>
                        <option value="GREEN">GREEN</option>
                        <option value="RED">RED</option>
                        <option value="BLUE">BLUE</option>
                        <option value="YELLOW">YELLOW</option>
                        <option value="WHITE">WHITE</option>
                    </select>
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Location: <button style={{backgroundColor: 'white', borderRadius: '5px'}}
                                      onClick={() => navigate("/location/edit/" + person.location.id)}>view</button>
                    <button
                        disabled={!allowEdit()}
                        onClick={() => setShowLocationSelect(true)}>Select Location
                    </button>
                    {person.location && (
                        <div>
                            Selected Location x: {person.location.x}, y: {person.location.y},
                            name: {person.location.name}
                        </div>
                    )}
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Height:
                    <input
                        disabled={!allowEdit()}
                        min={1}
                        type="number"
                        name="height"
                        value={person.height}
                        onChange={handleInputChange}
                        required
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Nationality:
                    <select
                        disabled={!allowEdit()}
                        name="nationality"
                        value={person.nationality}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}>
                        />
                        <option value="">SELECT</option>
                        <option value="RUSSIA">RUSSIA</option>
                        <option value="UNITED_KINGDOM">UNITED_KINGDOM</option>
                        <option value="SOUTH_KOREA">SOUTH_KOREA</option>
                    </select>
                </label>
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
                disabled={!allowEdit()}
                onClick={() => {
                    setError("To delete, you should replace by another one");
                    setShowPersonSelect(true);
                }}
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

            {showLocationSelect && <SelectLocation cw={() => setShowLocationSelect(false)}
                                           onSelected={handleSelectLocation}/>}

            {showPersonSelect && <SelectPerson cw={() => setShowPersonSelect(false)}
                                           onSelected={handleDelete}/>}
        </div>
    );
};

export default EditPerson;
