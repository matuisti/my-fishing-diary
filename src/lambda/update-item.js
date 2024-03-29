import faunadb from 'faunadb';
import { authClient } from './client';
const q = faunadb.query;

exports.handler = async (event, context) => {
  const id = event.path.match(/([^\/]*)\/*$/)[0]
  const { headers: { token } } = event;
  const body = JSON.parse(event.body);
  
  try {
    const { data } = await authClient(token).query(
      q.Update(
        q.Ref(q.Collection('diary_items'), id),
        { data: body }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};