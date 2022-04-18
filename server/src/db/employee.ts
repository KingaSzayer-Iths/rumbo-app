// import { query } from "./db";



// export const getEmployees = async () => {
//     const sqlQuery = `SELECT * FROM public.employees`;
//     return await query(sqlQuery);
// };




// import Mongoose from "mongoose";
import EmployeeModel from "./model/employee";
// import EmployeeModel, {EmployeeType} from "./model/employee"
export const getEmployees = async () => {
    // const newEmployee = new EmployeeModel(employee);
    // await newEmployee.save()
//   return newEmployee
  const employees = await EmployeeModel.find()
  return employees
};

// import EmployeeModel from "./model/employee";
    
// export const getEmployees = async () => {
//     const employees = await EmployeeModel.find();
//     return employees;
// }