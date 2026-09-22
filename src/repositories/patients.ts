import { database } from '../config/database'
import {
  CreatePatientInput,
  Patient
} from '../interfaces/patients'

export const createPatient = async (
  patient: CreatePatientInput
): Promise<Patient> => {
  const result = await database.query(
    `
      INSERT INTO patients (
        name,
        phone,
        email,
        birth_date,
        gender,
        height,
        weight
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        phone,
        email,
        TO_CHAR(birth_date, 'YYYY-MM-DD') AS "birthDate",
        gender,
        height AS "heightCm",
        weight AS "weightGrams",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      patient.name,
      patient.phone,
      patient.email,
      patient.birthDate,
      patient.gender,
      patient.heightCm,
      patient.weightGrams
    ]
  )

  return result.rows[0] as Patient
}

export const getPatients = async (): Promise<Patient[]> => {
  const result = await database.query(
    `
      SELECT
        id,
        name,
        phone,
        email,
        TO_CHAR(birth_date, 'YYYY-MM-DD') AS "birthDate",
        gender,
        height AS "heightCm",
        weight AS "weightGrams",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM patients
      WHERE deleted_at IS NULL
      ORDER BY name
    `
  )

  return result.rows as Patient[]
}

export const getPatientById = async (
  id: string
): Promise<Patient | null> => {
  const result = await database.query(
    `
      SELECT
        id,
        name,
        phone,
        email,
        TO_CHAR(birth_date, 'YYYY-MM-DD') AS "birthDate",
        gender,
        height AS "heightCm",
        weight AS "weightGrams",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM patients
      WHERE id = $1
        AND deleted_at IS NULL
      LIMIT 1
    `,
    [id]
  )

  if (result.rowCount === 0) {
    return null
  }

  return result.rows[0] as Patient
}