// src/services/authService.js
import axios from 'axios';
import qs from 'qs';

export const loginUser = async (username, password) => {
  const data = qs.stringify({ username, password });

  const response = await axios.post('https://itcen-sistema.onrender.com/api/v1/auth/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data; // access_token, token_type y user
};
