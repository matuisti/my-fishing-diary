import faunadb from 'faunadb';
import { FAUNA_SECRET } from '../../config';
const q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_SECRET
});

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  return client.query(q.Create(q.Collection('shop_items'), {
    data
  })).then((ret) => { 
    return { ...ret.data, id: ret.ref.id }
  }).then((res) => {
    console.log("success", res)
    return {
      statusCode: 200,
      body: JSON.stringify(res)
    }
  }).catch((error) => {
    console.log("error", error)
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  })
};