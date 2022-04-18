import { query } from "./db";
import { Transaction, TransactionStatus } from "../types";
import TransactionsModel from "./model/transactions";

type getTransactionFilter = {
  email?: string;
  year?: number;
  month?: number;
  description?: string;
};

// export const getTransactions = async ({
//   email,
//   year,
//   month,
//   description,
// }: getTransactionFilter) => {
//   let where = [`"status" = 0`];
//   let params = [];
//   if (email) {
//     params.push(email);
//     where.push(`email = $${params.length}`);
//   }
//   if (year) {
//     params.push(year);
//     where.push(`DATE_PART('year',"time") = $${params.length}`);
//   }
//   if (month) {
//     params.push(month);
//     where.push(`DATE_PART('month',"time") = $${params.length}`);
//   }
//   if (description) {
//     description = `%${description}%`;
//     params.push(description);
//     where.push(`LOWER("description") LIKE LOWER($${params.length})`)
//   }
//   const whereClause = !where.length ? "" : "WHERE " + where.join(" AND ");
//   const sqlQuery = `SELECT * FROM (SELECT id, email, "time", amount, description, status, SUM(amount) OVER ( PARTITION BY email ORDER BY "time", id ) FROM public.transactions) AllTransactions ${whereClause}`;
//   return await query(sqlQuery, params);
// };

export const getTransactions = async ({ email, year, month, description }: getTransactionFilter) => {
  let queries = {};
  
  if (email) {
      queries ['email'] = email
  }
  if (year && !month) {
      queries['time'] = {$gt: new Date (year, 0, 1), 
        $lt: new Date (Number(year)+1, 0, 1)}
  }
  if (month && year) {
      queries ['time'] = {$gt: new Date(year, month-1, 1), $lt: new Date(year, month, 1)}
  }
  if (description) {
      queries ['description'] = {"$regex" : description, "$options" : "i"}
  }

  const transactions = await TransactionsModel.find({...queries})
  return transactions.map(transaction => ({...transaction.toJSON(), 
    id: transaction._id.toString()}))
}

// export const getTransactionById = async (transactionId: number) => {
//   const sqlQuery = `SELECT * FROM public.transactions WHERE id = $1`;
//   const result = await query(sqlQuery, [transactionId]);
//   return result['length'] === 0 ? null : result[0];
// };

export const getTransactionById = async (id: String) => {
  return await TransactionsModel.findById({"_id": id})
}

// export const deleteTransactionById = async (transactionId: number) => {
//   const sqlQuery = `DELETE FROM public.transactions WHERE id = $1`;
//   await query(sqlQuery, [transactionId]);
// };

export const deleteTransactionById = async (transactionId: String) => {
  await TransactionsModel.deleteOne({"id": transactionId})
}

// export const getTransactionsMeta = async (email: string) => {
//   const sqlQuery = `SELECT
//                       EXTRACT(year from time) as year,
//                       EXTRACT(month from time) as month
//                     FROM
//                       (SELECT * FROM transactions WHERE email = $1 AND status = 0) as nested
//                     GROUP BY EXTRACT(month from time), EXTRACT(year from time)
//                     ORDER BY year, month`;
//   const res: any = await query(sqlQuery, [email]);
//   return res.map(meta => ({ year: Number(meta.year), month: Number(meta.month) }));
// };

export const getTransactionsMeta = async (email: string) => {

  const res = await TransactionsModel.aggregate([ 
    {$match: {"email": email}},
    { $group: {_id: { year: { $year: "$time" }, month: { $month: "$time" }}}}
  ]).exec()
  return res.map(meta => ({year:Number(meta._id.year), month: Number(meta._id.month) }))
}

// export const addTransaction = (transaction: Transaction) => {
//   return query(
//     'INSERT INTO public.transactions(email, "time", amount, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//     [
//       transaction.email,
//       transaction.time,
//       transaction.amount,
//       transaction.description,
//       TransactionStatus.Final
//     ]
//   ).then((res) => res);
// };


export const addTransaction = async (transaction: Transaction) => {
  const newTransaction = new TransactionsModel(transaction)
  await newTransaction.save()
  console.log("add transaction", newTransaction)
  return newTransaction
}

export const filterOutExistingTransactions = async (transactions: Transaction[]): Promise<Transaction[]> => {
  if (transactions.length === 0) {
    return [];
  }
  const sqlQuery = `SELECT source_reference FROM "transactions" WHERE source_reference in (${transactions.map((transaction, index) => "$" + (index + 1)).join(", ")})`;
  const params = transactions.map(transaction => transaction.sourceReference);
  const existingTransactionSourceReferences = (await query(sqlQuery, params) as any[])
    .map(existingTransaction => existingTransaction.source_reference);
  return transactions.filter(transaction => existingTransactionSourceReferences.indexOf(transaction.sourceReference) === -1);
}