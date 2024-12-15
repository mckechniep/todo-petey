import api from './api';

/* signup function takes one input: userData, which is an object 
passed in the request body, think of it like a container holding
info that we get the user submitting a form in the frontend */
export const signup = async (userData, onSuccess) => {
    const res = await api.post('/users/signup', userData);

    localStorage.setItem('token', res.data.token);
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(res.data)); // Store the user object
    if (onSuccess) {
        onSuccess(res.data); // Call the callback with user data
      }
    return res.data;
};

export const login = async (userData) => {
    const res = await api.post('/users/signin', userData);

    localStorage.setItem('token', res.data.token);
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(res.data)); // Store the user object

    return res.data;
};