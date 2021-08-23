import faunadb from 'faunadb';
import { authClient } from './client';
const q = faunadb.query;

exports.handler = async (event, context) => {

  const { headers: { token } } = event;
  
  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'give valid token'
      })
    }
  }

  try {
    const body = JSON.parse(event.body);
    const { ref, data } = await authClient(token).query(
      q.Create(q.Collection('diary_items'), {
        data: body
      })
    );
    return { 
      statusCode: 200,
      body: JSON.stringify({
        ...data, 
        id: ref.id 
      })
    }
  } catch (error) {
    return {
      statusCode: error.requestResult.statusCode,
      body: JSON.stringify({ message: error.message })
    }
  }
};