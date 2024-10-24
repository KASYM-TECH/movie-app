import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { apiService } from '../../api';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            await apiService.post(navigate, '/auth/signup', {
                username: username,
                password: password,
                role: role,
            });
            navigate('/login');
        } catch (err) {
            setError('Error registering account');
        }
    };

    return (
        <div className="signup-container">
            <h1 className="signup-title">Sign Up</h1>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {info && <div style={{marginBottom: '10px'}}>{info}</div>}

            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="btn-container">
                    <button className="signup-button" type="submit">Sign Up</button>
                    <button className="login-button" type="button" onClick={() => navigate("/login")}>Log in</button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
