import axios from 'axios';

// creating an axios instance with default configurations
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export default api;

// This tells axios to automatically add http://localhost:5000/api to the beginning of any request URL you provide when using this specific api instance.

// So, if you later use this api object to make a request to /users, the actual request sent to the server will be http://localhost:5000/api/users