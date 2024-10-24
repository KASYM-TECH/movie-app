import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from "../storage/UserSlice";
import { apiService } from "../api";
import {useError} from "../../ErrorProvider";

const UserBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.user.userInfo);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    

    const zeroOscarCountByGenre = (event) => {
        if(!isLoggedIn) {
            alert("please log in")
            return
        }

        if (event.target.value==="") {
            alert('Please select a genre');
            return;
        }

        apiService.post(navigate, '/queries/zeroOscarCountByGenre?genre=' + event.target.value)
            .then(() => {
                alert('Movie updated successfully');
                navigate('/');
            })
            .catch(err => alert('Error occurred: ' + err.message));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div style={styles.topBar}>
            <div style={{padding: "10px"}}>
                {isLoggedIn ? (
                    <>
                        <span style={styles.welcomeText}>{userInfo.role === "Admin" ? "🥇 " : ""}Welcome, {userInfo.username}</span>
                        <button style={styles.logoutButton} onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <span style={styles.welcomeText} onClick={() => navigate("/login")}>LOGIN</span>
                )}
            </div>

            {isLoggedIn &&
                <div style={styles.buttonGroup}>
                    {userInfo.role === "Admin" && <button style={styles.navButton} onClick={() => navigate("/admin")}>User rights🤝</button>}
                    <button style={styles.navButton} onClick={() => navigate("/")}>Movies</button>
                    <button style={styles.navButton} onClick={() => navigate("/location/list")}>Location</button>
                    <button style={styles.navButton} onClick={() => navigate("/coordinates/list")}>Coordinates</button>
                    <button style={styles.navButton} onClick={() => navigate("/person/list")}>Person</button>
                    <button style={styles.navButton} onClick={() => navigate("/groupByTotalBoxOffice")}>Group By Total
                        BoxOffice
                    </button>
                    <button style={styles.navButton} onClick={() => navigate("/minTotalBoxOffice")}>Min Total
                        BoxOffice
                    </button>
                    <button style={styles.navButton} onClick={() => navigate("/moviesWithoutOscars")}>Movies without
                        oscars
                    </button>

                    <div className="zeroByGenre" style={styles.zeroByGenre}>
                        <div style={styles.label}>Zero director's film oscars</div>
                        <select onChange={zeroOscarCountByGenre} style={styles.selectBox}>
                            <option value="">Select Genre</option>
                            <option value="DRAMA">Drama</option>
                            <option value="COMEDY">Comedy</option>
                            <option value="THRILLER">Thriller</option>
                            <option value="TRAGEDY">Tragedy</option>
                        </select>
                    </div>
                </div>}
        </div>
    );
};

const styles = {
    topBar: {
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '10px 20px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    welcomeText: {
        marginRight: '20px',
        color: '#f5f5f5',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        cursor: 'pointer',
        borderRadius: '10px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    logoutButtonHover: {
        backgroundColor: '#d32f2f'
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        alignItems: 'center'
    },
    navButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '10px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        height: '30%'
    },
    navButtonHover: {
        backgroundColor: '#0056b3',
    },
    zeroByGenre: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
    },
    label: {
        marginBottom: '5px',
        fontSize: '14px',
        color: '#fff',
    },
    selectBox: {
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #0056b3',
        backgroundColor: '#0056b3',
        color: 'white'
    }
};

export default UserBar;
