import { Appointment, PatientAppointmentHistory } from '../interfaces/appointments'
import { ConsultationNote } from '../interfaces/consultation-notes'
import { CreatePatientInput, Patient } from '../interfaces/patients'
import { User } from '../interfaces/users'

export const id = '11111111-1111-4111-8111-111111111111'
export const userId = '22222222-2222-4222-8222-222222222222'
export const patientInput: CreatePatientInput = {
  name: 'Maria Silva', phone: '85999999999', email: 'maria@example.com',
  birthDate: '1990-05-12', gender: 'female', heightCm: 165, weightGrams: 60000,
}
const timestamps = {
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
}
export const patient: Patient = { ...patientInput, id, ...timestamps }
export const appointmentInput = { patientId: id, userId, date: '2026-10-01', time: '09:30' }
export const appointment: Appointment = {
  ...appointmentInput, id, status: 'SCHEDULED', ...timestamps,
}
export const note: ConsultationNote = {
  id, appointmentId: id, description: 'Patient is recovering', ...timestamps,
}
export const history: PatientAppointmentHistory[] = [{ ...appointment, notes: [note] }]
export const user: User = {
  id: userId, name: 'Doctor', email: 'doctor@example.com', passwordHash: 'password-hash', ...timestamps,
}
