import faunadb from 'faunadb';
import { client } from './client';
const q = faunadb.query;

exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  return client.query(
    q.Let({
      userExists: q.Exists(
        q.Match(q.Index('users_by_name'), body.username)
      )
    },
    q.If(
      q.Var('userExists'),
      q.Abort('userExists'),
      q.Create(q.Collection('users'), {
        credentials: { 
          password: body.password 
        },
        data: {
          username: body.username
        }
      }))
    )
  ).then((ret) => { 
    return { ...ret.data, id: ret.ref.id }
  }).then((res) => {
    return {
      statusCode: 200,
      body: JSON.stringify(res)
    }
  }).catch((error) => {
    return {
      statusCode: error.requestResult.statusCode,
      body: JSON.stringify(error)
    }
  })
};