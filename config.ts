
require('dotenv').config();

export const FAUNA_SECRET = process.env.NODE_ENV === 'production' ? process.env.FAUNA_SECRET : process.env.REACT_APP_FAUNA_SECRET;