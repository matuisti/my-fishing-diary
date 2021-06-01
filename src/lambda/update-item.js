import faunadb from 'faunadb';
import { FAUNA_SECRET } from '../../config';
const q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_SECRET
});

exports.handler = async (event, context) => {
  const id = event.path.match(/([^\/]*)\/*$/)[0]
  const data = JSON.parse(event.body);
  return client.query(
    q.Update(
      q.Ref(q.Collection('shop_items'), id),
      { data: { checked: data.checked }}
    )
  ).then((ret) => { 
    return { ...ret.data, id: ret.ref.id }
  })
  .then(response => {
    console.log('removed', response);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  })
  .catch(error => {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  });
};