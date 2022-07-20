import { RobotFaceDirectionEnum } from './robotFaceDirectionEnum'

export interface TableStateType {
  gridSize: number
  faceDirection?: RobotFaceDirectionEnum
  reportPosition?: boolean
  robotIsPlaced: boolean
  xcoordinate?: number
  ycoordinate?: number
}
