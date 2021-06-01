import faunadb from 'faunadb';
import bcrypt from 'bcryptjs';
import { FAUNA_SECRET } from '../../config';
const q = faunadb.query;

const client = new faunadb.Client({
  secret: FAUNA_SECRET
});

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(data.password.toString(), salt);
  const newUser = { name: data.name, password: hashedPass };
  return client.query(q.Create(q.Collection('shop_user'), {
    data: newUser
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

// Create(
//   Collection("shop_users"),
//   {
//     credentials: { password: "passukka" },
//     data: {
//       name: "marjo&matu",
//     },
//   }
// )