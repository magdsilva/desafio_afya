export interface CreateAppointmentInput {
  userId: string
  patientId: string
  date: string
  time: string
}

export interface Appointment {
  id: string
  userId: string
  patientId: string
  date: string
  time: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface UpdateAppointmentInput {
  date?: string
  time?: string
  status?: string
}