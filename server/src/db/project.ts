// import { query } from "./db";
// // import ProjectModel from "./model/projects"
// // import ProjectModel  from "./model/projects";

// // export const getEmployees = async () => {

// //   const employees = await ProjectModel.find()
// //   return employees
// // };


// export const getProjects = async (email?: string) => {
//     let whereClause = '';
//     if (email) {
//         whereClause = `WHERE public.employees.email = '${email}'`;
    
//     }
//     const sqlQuery = `SELECT public.projects.id, public.projects.project_name FROM public.projects
//     JOIN public.project_employee on public.projects.id = public.project_employee.project_id
//     JOIN public.employees on public.project_employee.employee_id = public.employees.id ${whereClause} GROUP BY public.projects.id, public.projects.project_name`;
    
//     return query(sqlQuery);
// }
// import { query } from "./db";
// import Mongoose from "mongoose";
// import ProjectModel from "./model/projects"
import ProjectModel  from "./model/projects";


// export const getProjects = async (email?: string) => {
//     const employees = await projectModel.find()
//     return employees
//     // let whereClause = '';
//     // let params = [];
//     // if (email) {
//     //     whereClause = `WHERE public.employees.email = $1`;
//     //     params = [ email ]
//     // }

//     // const sqlQuery = `SELECT public.projects.id, public.projects.project_name FROM public.projects`;
    
//     // return query(sqlQuery, params);
// }

export const getProjects = async () => {
    // const newEmployee = new EmployeeModel(employee);
    // await newEmployee.save()
//   return newEmployee
  const project = await ProjectModel.find()
  return project
};