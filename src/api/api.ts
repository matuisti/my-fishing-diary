import axios from 'axios';

interface Ilogin {
  user: string,
  password: string
}

const login = async (credentials: Ilogin) => {
  return axios.get('', {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(response => {
    return Promise.resolve(response);
  }).catch(error => {
    console.error(error);
    return Promise.reject(error);
  })
};

const logout = async () => {
  return axios.get('', {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(response => {
    return Promise.resolve(response);
  }).catch(error => {
    console.error(error);
    return Promise.reject(error);
  })
};

export default {
  login,
  logout
}