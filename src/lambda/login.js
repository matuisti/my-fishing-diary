import faunadb from 'faunadb';
import { FAUNA_SECRET } from '../../config';
const q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_SECRET
});

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  return client.query(q.Login(q.Match(q.Index("users_by_name"), data.username), { password: data.password }))
  .then(response => {
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({message: 'authentication success', secret: response.secret})
    }
  })
  .catch(error => {
    console.log('error', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: error.message })
    };
  });
};