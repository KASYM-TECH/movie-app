import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

function isTokenExpired(token) {
    if (!token) {
        return true;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) {
        return false;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}

const get = async (navigate, url, params = {}) => {
    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('token')}`;

    if(localStorage.getItem("token") && isTokenExpired(localStorage.getItem('token'))){
        navigate("/login")
        return
    }
    try {
        const response = await axios.get(`${BASE_URL}${url}`, { params });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const post = async (navigate, url, data) => {
    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('token')}`;

    if(localStorage.getItem("token") && isTokenExpired(localStorage.getItem('token'))){
        navigate("/login")
        return
    }
    try {
        const response = await axios.post(`${BASE_URL}${url}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const put = async (navigate, url, data) => {
    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('token')}`;

    if(localStorage.getItem("token") && isTokenExpired(localStorage.getItem('token'))){
        navigate("/login")
        return
    }
    try {
        const response = await axios.put(`${BASE_URL}${url}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const del = async (navigate, url) => {
    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('token')}`;

    if(localStorage.getItem("token") && isTokenExpired(localStorage.getItem('token'))){
        navigate("/login")
        return
    }
    try {
        const response = await axios.delete(`${BASE_URL}${url}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const handleError = (error) => {

};

export const apiService = {
    get,
    post,
    put,
    delete: del,
};
