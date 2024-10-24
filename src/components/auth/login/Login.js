import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {login, logout} from '../../storage/UserSlice';
import { apiService } from '../../api';
import './Login.css'; // Import the CSS for styling

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout());
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiService.post(navigate, '/auth/login', {
                username: username,
                password: password,
            })

            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('username', response.username);
            localStorage.setItem('role', response.role);

            dispatch(login(response));
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Login</h1>
                {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                {info && <div style={{marginBottom: '10px'}}>{info}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="login-button">Login</button>
                        <button type="button" className="signup-button" onClick={() => navigate("/signup")}>Signup</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
