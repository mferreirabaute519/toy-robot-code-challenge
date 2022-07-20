import { CommandType } from './commandType'

export interface CommandHistoryType extends CommandType {
  order: number
}
