import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import SelectLocation from '../location/SelectLocation';
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const CreatePerson = () => {
    const [person, setPerson] = useState({
        name: '',
        eyeColor: '',
        hairColor: '',
        location: null,
        height: '',
        nationality: '',
        allowAdminEdit: false,
        creatorId: localStorage.getItem("userId")
    });

    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [showLocationSelect, setShowLocationSelect] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    

    useEffect(() => {
        if(!isLoggedIn) {
            navigate("/login")
        }
    }, [isLoggedIn]);

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

    const handleLocationSelect = (location) => {
        setPerson(prevState => ({ ...prevState, location: location }));
        setShowLocationSelect(false);
    };

    const handleSubmit = () => {
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

        apiService.post(navigate, '/persons', person)
            .then(() => {
                setError('Person created successfully');
                navigate('/person/list');
            })
            .catch(err => setError('Error creating person'));
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
            <h3>Create New Person</h3>

            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <div style={{marginBottom: '20px'}}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={person.name}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Height:
                    <input
                        type="number"
                        min={1}
                        name="height"
                        value={person.height}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Eye Color:
                    <select
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
                    Nationality:
                    <select
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

            <div style={{marginBottom: '20px'}}>
                <label>
                    Allow admin edit:
                    <input
                        type="checkbox"
                        name="allowAdminEdit"
                        value={person.allowAdminEdit}
                        onChange={handleInputChange}
                        style={{width:'30px'}}
                    />
                </label>
            </div>

            {
                person.location && <div style={{marginBottom: '20px'}}>
                    <h3>location: </h3> x: {person.location.x}, y: {person.location.y}, name: {person.location.name}
                </div>
            }

            <button
                onClick={() => setShowLocationSelect(true)}
                style={{
                    background: '#2196F3',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    marginRight: '10px',
                    cursor: 'pointer',
                }}
            >
                Select Location
            </button>


            {showLocationSelect && (
                <SelectLocation onSelected={handleLocationSelect} cw={() => setShowLocationSelect(false)}/>
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
                Create Person
            </button>
        </div>
    );
};

export default CreatePerson;
