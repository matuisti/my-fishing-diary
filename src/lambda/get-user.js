import faunadb from 'faunadb';
import { authClient } from './client';
const q = faunadb.query;

exports.handler = async (event, context) => {
  const { headers: { token } } = event;
  try {
    const { data } = await authClient(token).query(
      q.Get(q.CurrentIdentity())
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: error.requestResult.statusCode,
      body: JSON.stringify({ message: error.message })
    };
  }
};