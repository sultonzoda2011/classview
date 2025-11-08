import type { JwtPayload } from 'jwt-decode'

export interface CustomJwtPayload extends JwtPayload {
  centerId: string
  classRoomId: string
  nameid: string
  unique_name: string
  role: 'Admin' | 'SuperAdmin' | 'User'
}
