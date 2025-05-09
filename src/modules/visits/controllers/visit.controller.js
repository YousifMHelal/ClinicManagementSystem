import xlsx from 'xlsx'
import { run } from '../../../utils/database.utils.js'
import * as logger from '../../../utils/console.logger.js'

export const printVisits = async (request, response) => {
  const { patientId, degreeId, visitTypeId, specialId, fromDay, toDay } =
    request.query;

  const conditions = [];

  try {
    // TODO: validation
    if (patientId) {
      conditions.push({
        column: "p.id",
        operator: "=",
        value: "?",
        params: [patientId],
      });
    }
    if (degreeId) {
      conditions.push({
        column: "d.id",
        operator: "=",
        value: "?",
        params: [degreeId],
      });
    }
    if (visitTypeId) {
      conditions.push({
        column: "vt.id",
        operator: "=",
        value: "?",
        params: [visitTypeId],
      });
    }
    if (specialId) {
      conditions.push({
        column: "s.id",
        operator: "=",
        value: "?",
        params: [specialId],
      });
    }
    if (fromDay) {
      conditions.push({
        column: "substr(v.timestamp, 0, 11)",
        operator: ">=",
        value: "?",
        params: [fromDay],
      });
    }
    if (toDay) {
      conditions.push({
        column: "substr(v.timestamp, 0, 11)",
        operator: "<=",
        value: "?",
        params: [toDay],
      });
    }
  } catch (error) {
    logger.error(error.message);
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }

  let params = [];
  let whereStatement = "";

  if (conditions.length > 0) {
    whereStatement = conditions.reduce((statement, condition, index) => {
      const prefix = index === 0 ? "" : "AND";
      params = params.concat(condition.params);
      return `${statement} ${prefix} ${condition.column} ${condition.operator} ${condition.value}`;
    }, "WHERE");
  }

  const data = await run(
    `
        SELECT
        p.name AS 'اسم المريض',
        d.name AS 'الدرجة',
        vt.name AS 'نوع العيادة',
        s.name AS 'التخصص',
        v.openion AS 'التشخيص',
        v.doctor_name AS 'اسم الطبيب',
        v.timestamp AS 'التاريخ والوقت',
        v.second_visit_at AS 'موعد زيارة اخري'
        FROM patients_visits AS v
        INNER JOIN specials AS s ON s.id = v.special_id
        INNER JOIN visits_types AS vt ON vt.id = v.type_id
        INNER JOIN patients AS p ON p.id = v.patient_id
        INNER JOIN degrees AS d ON d.id = p.degree_id
        ${whereStatement}`,
    params
  );

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();

  xlsx.utils.book_append_sheet(workbook, worksheet, "الزيارات");
  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

  response.setHeader(
    "Content-Disposition",
    'attachment; filename="visits.xlsx"'
  );
  response.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  response.send(buffer);
};

export const getVisits = (request, response) => {
  const { patientId, degreeId, visitTypeId, specialId, fromDay, toDay } =
    request.query;

  const conditions = [];

  try {
    // TODO: validation
    if (patientId) {
      conditions.push({
        column: "p.id",
        operator: "=",
        value: "?",
        params: [patientId],
      });
    }
    if (degreeId) {
      conditions.push({
        column: "d.id",
        operator: "=",
        value: "?",
        params: [degreeId],
      });
    }
    if (visitTypeId) {
      conditions.push({
        column: "vt.id",
        operator: "=",
        value: "?",
        params: [visitTypeId],
      });
    }
    if (specialId) {
      conditions.push({
        column: "s.id",
        operator: "=",
        value: "?",
        params: [specialId],
      });
    }
    if (fromDay) {
      conditions.push({
        column: "substr(v.timestamp, 0, 11)",
        operator: ">=",
        value: "?",
        params: [fromDay],
      });
    }
    if (toDay) {
      conditions.push({
        column: "substr(v.timestamp, 0, 11)",
        operator: "<=",
        value: "?",
        params: [toDay],
      });
    }
  } catch (error) {
    logger.error(error.message);
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }

  let params = [];
  let whereStatement = "";

  if (conditions.length > 0) {
    whereStatement = conditions.reduce((statement, condition, index) => {
      const prefix = index === 0 ? "" : "AND";
      params = params.concat(condition.params);
      return `${statement} ${prefix} ${condition.column} ${condition.operator} ${condition.value}`;
    }, "WHERE");
  }

  // TODO: pagination
  run(
    `
        SELECT v.id, v.type_id, vt.name AS type, v.timestamp, s.name AS special, v.openion, v.special_id, v.second_visit_at, v.doctor_name, v.patient_id, p.name AS patient_name, d.name AS degree_name
        FROM patients_visits AS v
        INNER JOIN specials AS s ON s.id = v.special_id
        INNER JOIN visits_types AS vt ON vt.id = v.type_id
        INNER JOIN patients AS p ON p.id = v.patient_id
        INNER JOIN degrees AS d ON d.id = p.degree_id
        ${whereStatement}
    `,
    params
  )
    .then((visits) => {
      response.status(200).json({
        success: true,
        message: "",
        data: { content: visits, total: visits.length },
      });
    })
    .catch((error) => {
      logger.error(error.message);
      response
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
};

export const getVisit = (request, response) => {
  const { id } = request.params;

  try {
    // TODO: validation
  } catch (error) {
    logger.error(error.message);
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }

  run(
    `
        SELECT v.id, v.type_id, vt.name AS type, v.timestamp, s.name AS special, v.openion, v.special_id, v.second_visit_at, v.doctor_name, v.patient_id
        FROM patients_visits AS v
        INNER JOIN specials AS s ON s.id = v.special_id
        INNER JOIN visits_types AS vt ON vt.id = v.type_id
        WHERE v.id = ?
    `,
    [id]
  )
    .then((visits) => {
      response
        .status(200)
        .json({ success: true, message: "", data: visits[0] });
    })
    .catch((error) => {
      logger.error(error.message);
      response
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
};

export const viewVisitPage = (request, response) => {

    // TODO: validate id
    response.render('../src/modules/visits/views/visit.view.ejs')

}

export const viewVisitsPage = (request, response) => {

    response.render('../src/modules/visits/views/visits.view.ejs')

}

export const addVisit = (request, response) => {

    const { openion, timestamp, doctorName, secondVisitAt, typeId, specialId, patientId } = request.body

    run(
        'INSERT INTO patients_visits (patient_id, type_id, special_id, timestamp, openion, doctor_name, second_visit_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [ patientId, typeId, specialId, timestamp, openion, doctorName, secondVisitAt ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const updateVisit = (request, response) => {

    const { id } = request.params
    const { openion, timestamp, doctorName, secondVisitAt, typeId, specialId } = request.body

    run(
        'UPDATE patients_visits SET type_id = ?, special_id = ?, timestamp = ?, openion = ?, doctor_name = ?, second_visit_at = ? WHERE id = ?',
        [ typeId, specialId, timestamp, openion, doctorName, secondVisitAt, id ]
    ).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}

export const deleteVisit = (request, response) => {

    const { id } = request.params

    Promise.all([
        run('DELETE FROM patients_visits WHERE id = ?', [ id ]),
        run('DELETE FROM patients_medicine WHERE visit_id = ?', [ id ]),
        run('DELETE FROM patients_permissions WHERE visit_id = ?', [ id ]),
    ]).then(() => {
        response.status(200).json({ success: true, message: '' })
    }).catch((error) => {
        logger.error(error.message)
        response.status(500).json({ success: false, message: 'Internal server error' })
    })

}
