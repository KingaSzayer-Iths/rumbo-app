import { Schema, model } from 'mongoose';
import {v4 as uuidv4} from 'uuid'

export interface TransactionsType {
    email: string,
    time: Date,
    amount: number,
    description: string,
    sum: number,
    status: number,
    source_reference: string
}

const schema = new Schema <TransactionsType>({
    email: { type:String, required: true },
    time: { type:Date, required: true },
    amount: { type:Number, required: true },
    description: { type:String, requred: true },
    sum: {type: Number},
    status: { type:Number, requred: true },
    source_reference: { type:String }
},
{
    timestamps: true
})

const TransactionsModel = model <TransactionsType> ('transactions', schema)

export default TransactionsModel;
