import faunadb from 'faunadb';
import { FAUNA_SECRET } from '../../config';

export const client = new faunadb.Client({
  secret: FAUNA_SECRET
});

export const authClient = (secret) => {
  return new faunadb.Client({
    secret
  });
};