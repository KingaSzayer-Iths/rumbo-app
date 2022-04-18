//  import Mongoose from "mongoose"
 
//  export const Schema = Mongoose.Schema

//  const empSchema = new Schema({
//      name: 
//  })


//  import Mongoose from 'mongoose';

// export interface employee {
//     name: string, 
// }

// export const schema = new Mongoose.Schema ({
//     name: {type: String, required: true}  
// })

// export const Employee = Mongoose.model('employee', schema).find()

import { Schema, model } from 'mongoose';

export interface EmployeeType {
    email: string,
    firstname: string,
    lastname: string,
    fullname: string,
}

const schema = new Schema <EmployeeType>({
    email: { type:String, required: true },
    firstname: { type:String, required: true },
    lastname: { type:String, required: true },
    fullname: { type:String, requred: true }
})

const EmployeeModel = model <EmployeeType> ('employee', schema)

export default EmployeeModel;