import { api } from '@/lib/axios'

export interface RegisterExamScheduleBody {
  examId: string
  patientId: string
  dateHour: string
}

export async function registerExamSchedule({
  examId,
  patientId,
  dateHour,
}: RegisterExamScheduleBody) {
  await api.post('/exam-schedules', { examId, patientId, dateHour })
}
