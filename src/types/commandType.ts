import { RobotFaceDirectionEnum } from './robotFaceDirectionEnum'

export interface CommandType {
  baseCommand: string
  faceDirection?: RobotFaceDirectionEnum
  fullString: string
  error: string | null
  xcoordinate?: number
  ycoordinate?: number
}
