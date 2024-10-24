import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import { useWebSocket } from "../../socket";
import SelectLocation from "./SelectLocation";
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const EditLocation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { upd } = useWebSocket();
    const userInfo = useSelector((state) => state.user.userInfo);
    
    
    const [location, setLocation] = useState({ x: '', y: '', z: '', name: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [showSelect, setShowSelect] = useState(false);

    const allowEdit = ()=> {
        return location.creatorId === +userInfo.userId || (userInfo.role === "Admin" && location.allowAdminEdit)
    }


    useEffect(() => {
        apiService.get(navigate, `/locations/${id}`)
            .then(data => {
                setLocation(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error loading location');
                setLoading(false);
            });
    }, [id, upd]);

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

    const handleUpdate = () => {
        if (location.x === '') {
            setError('X coordinate is required.');
            setError('X coordinate is required.');
            return;
        } else if (isNaN(location.x) || !(location.x + "").includes(".")) {
            setError('X coordinate must be a valid number (Double).');
            setError('X coordinate must be a valid number (Double).');
            return;
        }

        if (location.y === '') {
            setError('Y coordinate is required.');
            setError('Y coordinate is required.');
            return;
        } else if (!Number.isInteger(Number(location.y))) {
            setError('Y coordinate must be a valid integer (Long).');
            setError('Y coordinate must be a valid integer (Long).');
            return;
        }

        if (location.z === '') {
            setError('Z coordinate is required.');
            setError('Z coordinate is required.');
            return;
        } else if (!Number.isInteger(Number(location.z)) || (location.z + "").includes(".")) {
            setError('Z coordinate must be a valid integer (Integer).');
            setError('Z coordinate must be a valid integer (Integer).');
            return;
        }


        apiService.put(navigate, `/locations/${id}`, location)
            .then(() => {
                setError('Location updated successfully');
                navigate('/location/list');
            })
            .catch(err => setError('Error updating location'));
    };

    const handleDelete = (replaceLocation) => {
        if (window.confirm('Are you sure you want to replace this location and delete the previous?')) {
            apiService.delete(navigate, `/locations/${id}?replaceId=${replaceLocation.id}`)
                .then(() => {
                    setError('Location deleted successfully');
                    navigate('/location/list');
                })
                .catch(err => setError('Error deleting location'));
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
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <h3>Edit Location</h3>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    X Coordinate:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="x"
                        value={location.x}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px' }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Y Coordinate:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="y"
                        value={location.y}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px' }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Z Coordinate:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="z"
                        value={location.z}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px' }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Location Name:
                    <input
                        disabled={!allowEdit()}
                        type="text"
                        name="name"
                        value={location.name}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', margin: '10px 0', borderRadius: '5px' }}
                    />
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
                onClick={() => { setError("To delete, you should replace by another one"); setShowSelect(true); }}
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
            {showSelect && <SelectLocation cw={() => setShowSelect(false)}
                                           onSelected={handleDelete} />}
        </div>
    );
};

export default EditLocation;
