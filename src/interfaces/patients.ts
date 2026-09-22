export interface CreatePatientInput {
  name: string
  phone: string
  email: string
  birthDate: string
  gender: string
  heightCm: number
  weightGrams: number
}

export interface Patient extends CreatePatientInput {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface UpdatePatientInput {
  name?: string
  phone?: string
  email?: string
  birthDate?: string
  gender?: string
  heightCm?: number
  weightGrams?: number
}