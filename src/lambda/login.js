import faunadb from 'faunadb';
import { client } from './client';
const q = faunadb.query;

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  try {
    const response = await client.query(q.Login(q.Match(q.Index("users_by_name"), body.username), {
      password: body.password
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'authentication success',
        username: body.username,
        token: response.secret,
        userId: response.instance.id
      })
    }
  } catch (error) {
    return {
      statusCode: error.requestResult.statusCode,
      body: JSON.stringify({ message: error.message })
    };
  }
};