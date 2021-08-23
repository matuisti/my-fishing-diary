import faunadb from 'faunadb';
import { authClient } from './client';
const q = faunadb.query;

exports.handler = async (event, context) => {
  const { headers: { token } } = event;
  const { userId } = event.queryStringParameters;
  
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'give userId'
      })
    }
  }

  try {
    const { data } = await authClient(token).query(
      q.Map(
        q.Paginate(q.Match(q.Index('diary_items_by_id'), userId)),
        q.Lambda(x => q.Get(x))
      )
    );

    const finalData = data.map(obj => ({ id: obj.ref.id, ...obj.data }));

    return {
      statusCode: 200,
      body: JSON.stringify(finalData)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};