import { Schema, model } from 'mongoose';

export interface EmployeeType {
    email: string,
    firstname: string,
    lastname: string,
    fullname: string,
}

export const schema = new Schema <EmployeeType>({
    email: { type:String, required: true },
    firstname: { type:String, required: true },
    lastname: { type:String, required: true },
    fullname: { type:String, required: true }
})

const EmployeeModel = model <EmployeeType> ('employee', schema)

export default EmployeeModel;