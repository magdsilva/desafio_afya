export interface CreateConsultationNoteInput {
  appointmentId: string
  description: string
}

export interface ConsultationNote {
  id: string
  appointmentId: string
  description: string
  createdAt: Date
  updatedAt: Date
}