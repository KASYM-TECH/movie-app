import React, { useEffect, useState } from 'react';
import { useWebSocket } from "../../socket";
import { apiService } from "../../api";
import {useNavigate} from "react-router-dom";
import {useError} from "../../../ErrorProvider";

const SelectPerson = ({ onSelected, cw }) => {
    const [list, setList] = useState([]);
    const { upd } = useWebSocket();
    const navigate = useNavigate(); // For navigating after actions
    

    useEffect(() => {
        apiService.get(navigate, "/persons?pageSize=100000000&sortBy=id") // Assuming the API endpoint is "/persons"
            .then(data => setList(data))
            .catch(err => console.error("Error loading persons", err));
    }, [upd]);

    const select = (id) => {
        cw();
        onSelected(list.find(p => +p.id === +id));
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
            <h3>Select Person</h3>
            <form>
                <div>
                    <label>Persons: </label>
                    <select onChange={(event) => select(event.target.value)} required>
                        <option value={null}>SELECT</option>
                        {list.map(person => (
                            <option key={person.id} value={person.id}>
                                Name: {person.name}, Eye Color: {person.eyeColor}, Hair Color: {person.hairColor},
                                Height: {person.height}, Nationality: {person.nationality}
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

export default SelectPerson;
