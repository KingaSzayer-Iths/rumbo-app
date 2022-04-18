import { Pool, PoolConfig } from "pg";

import { connect } from 'mongoose';
connect('mongodb://localhost:27017/rumbo')

export const pool = new Pool({
  ssl: false,
});

export const query = (query, values = null) => {
  return new Promise((resolutionFunc, rejectionFunc) => {
    pool.query({ text: query, values }, (err, res) => {
      if (err) {
        rejectionFunc(err);
      } else {
        resolutionFunc(res.rows);
      }
    });
  });
};