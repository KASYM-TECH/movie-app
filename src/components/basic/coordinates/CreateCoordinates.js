import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import {useSelector} from "react-redux";

const CreateCoordinate = () => {
    const [coordinate, setCoordinate] = useState(
        { x: '', y: '', allowAdminEdit: false, creatorId: localStorage.getItem("userId")});

    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

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
            setCoordinate((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setCoordinate((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = () => {
        if (coordinate.x === '') {
            setError('X coordinate is required.');
            return;
        } else if (!Number.isInteger(Number(coordinate.x)) || (coordinate.x + "").includes(".")) {
            setError('Y coordinate must be a valid integer (Long).');
            return;
        }

        if (coordinate.y === '') {
            setError('Y coordinate is required.');
            return;
        } else if (isNaN(coordinate.y) || !(coordinate.y + "").includes(".")) {
            setError('Y coordinate must be a valid number (Double).');
            return;
        }

        apiService.post(navigate, '/coordinates', coordinate)
            .then(() => {
                setInfo('Coordinate created successfully');
                navigate('/coordinates/list');
            })
            .catch(err =>  setError('Error creating coordinate'));
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
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <h3>Create New Coordinate</h3>

            <div style={{marginBottom: '20px'}}>
                <label>
                    X Coordinate:
                    <input
                        type="number"
                        name="x"
                        value={coordinate.x}
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
                        value={coordinate.y}
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
                        value={coordinate.allowAdminEdit}
                        onClick={handleInputChange}
                        style={{width:'30px'}}
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
                Create Coordinate
            </button>
        </div>
    );
};

export default CreateCoordinate;
