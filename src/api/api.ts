import axios from 'axios';

export interface Ilogin {
  username: string,
  password: string
}

const getItemsApi = async (token: string, userId: string) => {
  return axios.get('.netlify/functions/get-items', {
    params: {
      userId: userId
    },
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  }).then((response) => {
    return response.data
  })
  .catch((error) => {
    throw error;
  });
}

const createItemApi = async (token: string, item: any) => {
  return axios.post('.netlify/functions/create-item', {
    ...item
  }, {
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  }).then((response) => {
    return response.data
  })
  .catch((error) => {
    throw error;
  })
}

const deleteItemApi = async (id: string) => {
  return axios.post(`.netlify/functions/delete-item/${id}`)
  .then((response) => {
    return response.data;
  }).catch((error) => {
    throw error;
  })
}

const updateItemApi = async (token: string, item: any) => {
  return axios.post(`.netlify/functions/update-item/${item.id}`, {
    ...item
  },{
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    console.log(error);
  })
}

const createUserApi = async (user: Ilogin) => {
  return axios.post('.netlify/functions/create-user', {
    ...user
  }).then((response) => {
    return response.data
  })
  .catch((error) => {
    throw error;
  })
}

const loginApi = async (user: Ilogin) => {
  return axios.post('.netlify/functions/login', {
    ...user
  }).then((response) => {
    return response.data
  })
  .catch((error) => {
    throw error;
  })
}

const logoutApi = async (token: string) => {
  return axios.post('.netlify/functions/logout', {
    token: token
  }).then((response) => {
    return response.data
  })
  .catch((error) => {
    throw error;
  })
}

const getUserApi = async (token: string) => {
  return axios.get('.netlify/functions/get-user', {
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  }).then((response) => {
    return response.data
  })
  .catch((error) => {
    throw error;
  })
}

export { 
  getItemsApi, 
  createItemApi, 
  deleteItemApi,
  updateItemApi,
  createUserApi,
  loginApi,
  logoutApi,
  getUserApi
};