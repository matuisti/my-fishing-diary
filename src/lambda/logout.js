import faunadb from 'faunadb';
import { authClient } from './client';
const q = faunadb.query;

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  try {
    await authClient(body.token).query(q.Logout(false));
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'logout success',
      })
    }
  } catch (error) {
    return {
      statusCode: error.requestResult.statusCode,
      body: JSON.stringify({ message: error.message })
    };
  }
};