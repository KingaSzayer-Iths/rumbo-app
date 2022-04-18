// import { query } from "./db";
// // import Mongoose from "mongoose"

// export const getDescriptionsByEmail = async (email: string) => {
//     const sqlQuery = `SELECT DISTINCT description FROM public.transactions WHERE email LIKE $1`;

//     return await query(sqlQuery, [ email ]);
//     // return Mongoose.model('email').find()
// }

import TransactionsModel from "./model/transactions"

export const getDescriptionsByEmail = async (email: string) => {  
  let queries = {};
    
  if (email) {
      queries ['email'] = email
  }
  const description = await TransactionsModel.distinct("description",{...queries})

  return description.map(description => ({description}))
}
