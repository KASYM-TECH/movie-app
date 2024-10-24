import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../api';
import {useWebSocket} from "../../socket";
import SelectCoordinates from "./SelectCoordinates";
import {useSelector} from "react-redux";
import {useError} from "../../../ErrorProvider";

const EditCoordinate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { upd } = useWebSocket();
    const userInfo = useSelector((state) => state.user.userInfo);
    

    const [coordinate, setCoordinate] = useState({ x: '', y: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    const [showSelect, setShowSelect] = useState(false)

    useEffect(() => {
        apiService.get(navigate, `/coordinates/${id}`, null)
            .then(data => {
                setCoordinate(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error loading coordinate');
                setLoading(false);
            });
    }, [id, upd]);

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

    const allowEdit = ()=> {
        return coordinate.creatorId === +userInfo.userId || (userInfo.role === "Admin" && coordinate.allowAdminEdit)
    }

    const handleUpdate = () => {
        if (coordinate.x === '') {
            setError('X coordinate is required.');
            return;
        } else if (!Number.isInteger(Number(coordinate.x)) || (coordinate.x + "").includes(".")) {
            setError('X coordinate must be a valid integer (Long).');
            return;
        }

        if (coordinate.y === '') {
            setError('Y coordinate is required.');
            return;
        } else if (isNaN(coordinate.y) || !(coordinate.y + "").includes(".")) {
            setError('Y coordinate must be a valid Double.');
            return;
        }

        apiService.put(navigate, `/coordinates/${id}`, coordinate, navigate)
            .then(() => {
                setInfo('Coordinate updated successfully');
                navigate('/coordinates/list');
            })
            .catch(err => setError('Error updating coordinate'));
    };

    const handleDelete = (coordinates) => {
        if (window.confirm('Are you sure you want to replace this coordinate and delete the previous?')) {
            apiService.delete(navigate, `/coordinates/${id}?replaceId=${coordinates.id}`)
                .then(() => {
                    alert('Coordinate deleted successfully');
                    navigate('/coordinates/list');
                })
                .catch(err => setError('Error deleting coordinate'));
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
            <h3>Edit Coordinate</h3>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <div style={{ marginBottom: '20px' }}>
                <label>
                    X Coordinate:
                    <input
                        disabled={!allowEdit()}
                        type="number"
                        name="x"
                        value={coordinate.x}
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
                        value={coordinate.y}
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
                onClick={()=>{alert("to delete you should replace by another one"); setShowSelect(true)}}
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
            {showSelect && <SelectCoordinates cw={()=> setShowSelect(false)}
                                              onSelected={handleDelete}/>}
        </div>
    );
};

export default EditCoordinate;
