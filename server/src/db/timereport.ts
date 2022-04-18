import { query } from "./db";
import { TimeReport } from "../types";
import TimereportsModel from "./model/timereports";
import {Request, Response} from "express"

type getTimeReportFilter = {
    email?: string;
    year?: number;
    month?: number;
    project?: string;
};
export const getTimeReport = async ({
    email,
    year,
    month,
    project,
}: getTimeReportFilter) => {
    let match: any = {};
    // let params = [];
    if (email) {
        match.email = email;
    }
    if (year) {
        match.year = year
    }
    if (month) {
        match.month = Number(month) > 10 ? month : `0${month}`;
    }
    if (project) {
        match.project_id = project;
    }

    return await TimereportsModel.aggregate([
        {
            $project: {
                id: 1,
                email: 1,
                year: { $substr: ['$time', 0, 4] },
                month: { $substr: ['$time', 5, 2] },
                time: 1,
                description: 1,
                hours: 1,
                project_id: 1,
            }
        },
        {
            $match: match
        },
    ])
};
// export const getTimeReport = async (req:Request, res:Response) => {
//     const timereports = await TimereportsModel.find()
//     return res.status(200)timereports
//   }

  

// export const getTimeReport = async ({
//     email,
//     year,
//     month,
//     project,
// }: getTimeReportFilter) => {
//     let where = [];
//     let params = [];
//     if (email) {
//         params.push(email);
//         where.push(`email = $${params.length}`);
//     }
//     if (year) {
//         params.push(year);
//         where.push(`DATE_PART('year',"time") = $${params.length}`);
//     }
//     if (month) {
//         params.push(month);
//         where.push(`DATE_PART('month',"time") = $${params.length}`);
//     }
//     if (project) {
//         params.push(project);
//         where.push(`project_id = $${params.length}`);
//     }

//     const whereClause = !where.length ? "" : "WHERE " + where.join(" AND ");
//     const sqlQuery = `SELECT * FROM (SELECT id, email, time, description, hours, project_id FROM public.time_reports) AllTimeReports ${whereClause}`;
//     return query(sqlQuery, params).then(res => res as TimeReport[]);
// };

// export const getTimeReportById = async (timereportId: number) => {
//     const sqlQuery = `SELECT * FROM public.time_reports WHERE id = $1`;
//     const result = await query(sqlQuery, [timereportId]);
//     return result['length'] === 0 ? null : result[0];
// };
export const getTimeReportById = async (timeReportId: string) => {
    console.log("get time by i")
    const result = TimereportsModel.findOne({_id: timeReportId})    
    return await result;

};

// export const deleteTimeReportById = async (timeReportId: number) => {
//     const sqlQuery = `DELETE FROM public.time_reports WHERE id = $1`;
//     await query(sqlQuery, [timeReportId]);
// };

export const deleteTimeReportById = async (timeReportId: String) => {
    const deleteTimeReport =  TimereportsModel.deleteOne({ id: timeReportId });
	return deleteTimeReport
};
// export const getTimeReportMeta = async (email: string) => {
//     const sqlQuery = `SELECT
//                         EXTRACT(year from time) as year,
//                         EXTRACT(month from time) as month
//                     FROM
//                         ((SELECT time FROM time_reports WHERE email = 
//                         $1)
//                         UNION (SELECT NOW() as time)) as nested
//                     GROUP BY EXTRACT(month from time), EXTRACT(year from time)
//                     ORDER BY year, month`;
//     const res: any = await query(sqlQuery, [email]);
//     return res.map(meta => ({ year: Number(meta.year), month: Number(meta.month) }));

// };
export const getTimeReportMeta = async (email: string) => {
    const res = await TimereportsModel.aggregate([ {$match: {'email': email}}, {$group: { _id: {year: {$year: "$time" }, month: {$month: "$time"}}}}])
    return (res).map(meta => ({year: Number(meta._id.year), month: Number(meta._id.month)}))
}

// export const addTimeReport = (timeReport: TimeReport) => {

//     return query(
//         'INSERT INTO public.time_reports(email, "time", description, hours, project_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//         [
//             timeReport.email,
//             timeReport.time,
//             timeReport.description,
//             timeReport.hours,
//             timeReport.project_id,
//         ]
//     );
// };

export const addTimeReport = async (timereports: TimeReport) => {
        const timeReport = new TimereportsModel(timereports)
        await timeReport.save()
        console.log("add time report", timeReport)
        return timeReport
}

// export const addTimeReport = async (timeReport: TimeReport) => {
//     console.log("hej");
//     const newTimeReport =  new TimereportsModel(timeReport);
//     await newTimeReport.save();
//     return newTimeReport;
// }

// export const updateTimeReport = (timeReport: TimeReport) => {

//     return query(
//         'UPDATE public.time_reports SET email = $1, time = $2, description = $3, hours = $4, project_id = $5 WHERE id = $6 RETURNING *',
//         [
//             timeReport.email,
//             timeReport.time,
//             timeReport.description,
//             timeReport.hours,
//             timeReport.project_id,
//             timeReport.id,
//         ]
//     );
// };
export const updateTimeReport = async (timeReportId, timereports?: TimeReport) => {
    await TimereportsModel.findByIdAndUpdate(timeReportId, timereports)
    return await getTimeReportById(timeReportId)
}