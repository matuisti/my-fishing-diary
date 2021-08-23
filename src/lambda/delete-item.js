import faunadb from 'faunadb';
import { client } from './client';
const q = faunadb.query;

exports.handler = async (event, context) => {
  const id = event.path.match(/([^\/]*)\/*$/)[0];

  try {
    const { data } = await client.query(
      q.Delete(
        q.Ref(q.Collection('diary_items'), id)
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
};