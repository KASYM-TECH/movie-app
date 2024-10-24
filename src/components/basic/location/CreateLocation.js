import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import {useSelector} from "react-redux";

const CreateLocation = () => {
    const [location, setLocation] = useState({ x: '', y: '', z: '', name: '', allowAdminEdit: false,
        creatorId: localStorage.getItem("userId")});
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
        if (type === 'checkbox') {
            setLocation((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setLocation((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    useEffect(() => {
        if(!isLoggedIn) {
            navigate("/login")
        }
    }, [isLoggedIn]);

    const handleSubmit = () => {
        if (location.x === '') {
            setError('X coordinate is required.');
            return;
        } else if (isNaN(location.x) || !(location.x + "").includes(".")) {
            setError('X coordinate must be a valid number (Double).');
            return;
        }

        if (location.y === '') {
            setError('Y coordinate is required.');
            return;
        } else if (!Number.isInteger(Number(location.y))) {
            setError('Y coordinate must be a valid integer (Long).');
            return;
        }

        if (location.z === '') {
            setError('Z coordinate is required.');
            return;
        } else if (!Number.isInteger(Number(location.z)) || (location.z + "").includes(".")) {
            setError('Z coordinate must be a valid integer (Integer).');
            return;
        }

        if (location.name === '') {
            setError('Location name is required.');
            return;
        }

        apiService.post(navigate, '/locations', location)
            .then(() => {
                navigate('/location/list');
            })
            .catch(err => setError('Error creating location'));
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
            <h3>Create New Location</h3>

            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <div style={{marginBottom: '20px'}}>
                <label>
                    X Coordinate:
                    <input
                        type="number"
                        name="x"
                        value={location.x}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>
            <div style={{marginBottom: '20px'}}>
                <label>
                    Y Coordinate:
                    <input
                        type="number"
                        name="y"
                        value={location.y}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>
            <div style={{marginBottom: '20px'}}>
                <label>
                    Z Coordinate:
                    <input
                        type="number"
                        name="z"
                        value={location.z}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>
            <div style={{marginBottom: '20px'}}>
                <label>
                    Location Name:
                    <input
                        type="text"
                        name="name"
                        value={location.name}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px'}}
                    />
                </label>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label>
                    Allow admin edit:
                    <input
                        type="checkbox"
                        name="allowAdminEdit"
                        value={location.allowAdminEdit}
                        onChange={handleInputChange}
                        style={{width: '30px'}}
                    />
                </label>
            </div>


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
                Create Location
            </button>
        </div>
    );
};

export default CreateLocation;
