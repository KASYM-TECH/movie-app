import React, { useEffect, useState } from 'react';
import { useWebSocket } from "../../socket";
import { apiService } from "../../api";
import {useNavigate} from "react-router-dom";
import {useError} from "../../../ErrorProvider";

const SelectLocation = ({ onSelected, cw }) => {
    const [list, setList] = useState([]);
    const { upd } = useWebSocket();
    const navigate = useNavigate();
    

    useEffect(() => {
        apiService.get(navigate, "/locations?pageSize=100000000&sortBy=id")
            .then(data => setList(data))
            .catch(err => console.error("Error loading locations", err));
    }, [upd]);

    const select = (id) => {
        cw();
        debugger
        onSelected(list.find(l => +l.id === +id));
    };

    return (
        <div style={{
            position: 'absolute',
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
        }}>
            <h3>Select Location</h3>
            <form>
                <div>
                    <label>Locations: </label>
                    <select onChange={(event) => select(event.target.value)} required>
                        <option value={null}>SELECT</option>
                        {list.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                Name: {loc.name}, X: {loc.x}, Y: {loc.y}, Z: {loc.z}
                            </option>
                        ))}
                    </select>
                </div>
                <br />
                <button type="button" onClick={() => { cw(); }}>Cancel</button>
            </form>
        </div>
    );
};

export default SelectLocation;
