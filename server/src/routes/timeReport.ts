import express from 'express';
import { getTimeReport, addTimeReport, updateTimeReport, getTimeReportById, deleteTimeReportById } from "../db/timereport";
// import { addTimeReport, getTimeReport } from "../db/timereport";
import { validationResult } from "express-validator";
import { TimeReport } from '../types';
import { TimereportsType } from '../db/model/timereports';

const router = express.Router();

// router.get('/project/:id/timereport', (req, res) => {
//   if (req["isAdmin"]) {
//     res.send(401).end();
//   }
//   else {
//     let filter: any = {
//       project: req.params.id
//     }
//     if (req.query.year) {
//       filter.year = req.query.year;
//     }
//     if (req.query.month) {
//       filter.month = req.query.month;
//     }
//     getTimeReport(filter).then((timereport) => res.json(timereport));
//   }
// });

router.get('/project/:id/timereport', (req, res) => {
  if (req["isAdmin"]) {
    res.send(401).end();
  }
  else {
    let filter: any = {
      project: req.params.id
    }
    if (req.query.year) {
      filter.year = req.query.year;
    }
    if (req.query.month) {
      filter.month = req.query.month;
    }
    getTimeReport(filter).then((timereport) => res.status(200).json(timereport));
    // getTimeReport(filter).then((timereport) => res.json(timereport));
  }
});

router.post("/timereport", async (req, res) => {
  if (req.body.email != req["user"] && !req["isAdmin"]) {
    res.sendStatus(401).end();
  } else {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newTimeReport = await addTimeReport({
      email: req.body.email,
      time: req.body.time,
      description: req.body.description,
      hours: req.body.hours,
      project_id: req.body.project_id
    }) as TimereportsType;

    // const mapTimeReportData = { ...newTimeReport[0], hours: Number(newTimeReport[0].hours) };
    // delete mapTimeReportData.created_at;
    res.json(newTimeReport);
  }
});
// router.post("/timereport", async (req, res) => {
//   if (req.body.email != req["user"] && !req["isAdmin"]) {
//     res.sendStatus(401).end();
//   } else {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const newTimeReport = await addTimeReport({
//       email: req.body.email,
//       time: req.body.time,
//       description: req.body.description,
//       hours: req.body.hours,
//       project_id: req.body.project_id
//     }) as TimeReport;

//     const mapTimeReportData = { ...newTimeReport[0], hours: Number(newTimeReport[0].hours) };
//     delete mapTimeReportData.created_at;
//     res.json(mapTimeReportData);
//   }
// });

router.put("/:email/timereport/:id", async (req, res) => {

  if (req.body.email != req["user"] && req["isAdmin"]) {
    res.sendStatus(401).end();
  } else {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedTimeReport = await updateTimeReport({
      email: req.body.email,
      time: req.body.time,
      hours: req.body.hours,
      description: req.body.description,
      project_id: req.body.project_id,
      id: req.body.id
    });

    res.json(updatedTimeReport);
  }
});

router.delete("/:email/timereport/:timeReportId", async (req, res) => {
  if (req.params.email != req["user"] && !req["isAdmin"]) {
    res.sendStatus(401).end();
    console.log("Loggar params", req.params);
  } else {

    const timeReportId = String(req.params.timeReportId);
    console.log('timereportId',timeReportId);
    console.log('req params',req.params);
    

    if (!timeReportId) {
      return res.sendStatus(400);
    } else {
      const timeReport = await getTimeReportById(timeReportId);
      console.log(timeReport);
      if (!timeReport._id) {
        console.log('im in here');
        
        res.sendStatus(404);
      } else {
        console.log('im in here number1')
        await deleteTimeReportById(timeReportId);
        res.json(timeReport);
        
      }
    }
    res.json();
  }
});

export default router;