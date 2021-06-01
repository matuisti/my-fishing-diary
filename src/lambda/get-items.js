import faunadb from 'faunadb';
import { FAUNA_SECRET } from '../../config';
const q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_SECRET
});

exports.handler = async (event, context) => {
  return client.query(q.Paginate(q.Match(q.Ref('indexes/items'))))
  .then(response => {
    const itemRefs = response.data.map(ref => q.Get(ref));
    return client.query(itemRefs)
      .then((ret) => ret.map(x => ({ ...x.data, id: x.ref.id })))
      .then((wellformedData) => {
      return {
        statusCode: 200,
        body: JSON.stringify(wellformedData)
      };
    });
  })
  .catch(error => {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  });
};