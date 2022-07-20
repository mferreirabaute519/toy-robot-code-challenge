import update from 'immutability-helper'
import React, { useState } from 'react'
import { BaseCommandEnum, RobotFaceDirectionEnum, CommandType, TableStateType } from '../../types'
import { CommandLineInputHandler } from './CommandLineInputHandler'
import { CommandLineStyled } from './CommandLineStyles'

interface PropsType {
  onCommand: (command: CommandType, newTableState: TableStateType) => void
  tableState: TableStateType
}

export const CommandLine: React.FC<PropsType> = (props) => {
  const { onCommand, tableState } = props
  const [error, setError] = useState<string | null>(null)

  const tryPlaceRobot = (command: CommandType): void => {
    const { baseCommand, faceDirection, fullString, xcoordinate, ycoordinate } = command

    let placeError = null

    if (faceDirection === undefined || xcoordinate === undefined || ycoordinate === undefined) {
      placeError = 'Bad Command: expected 4 arguments'
    } else {
      if (!Number.isInteger(xcoordinate) || !Number.isInteger(ycoordinate)) {
        placeError = 'Bad Command: X and Y coordinates must be integers'
      }

      if (
        xcoordinate < 0 ||
        ycoordinate < 0 ||
        xcoordinate >= tableState.gridSize ||
        ycoordinate >= tableState.gridSize
      ) {
        placeError = 'Bad Command: coordinates are off the table'
      }

      const allowedDirections = Object.values(RobotFaceDirectionEnum) as string[]
      if (!faceDirection || !allowedDirections.includes(faceDirection)) {
        placeError = `Bad Command: direction must be one of ${Object.values(allowedDirections).join(', ')}`
      }
    }

    setError(placeError)
    onCommand(
      {
        baseCommand,
        error: placeError,
        faceDirection: !placeError ? (faceDirection as RobotFaceDirectionEnum) : undefined,
        fullString,
        xcoordinate,
        ycoordinate,
      },
      update(tableState, {
        faceDirection: { $set: !placeError ? (faceDirection as RobotFaceDirectionEnum) : tableState.faceDirection },
        reportPosition: { $set: false },
        robotIsPlaced: { $set: !placeError ? true : tableState.robotIsPlaced },
        xcoordinate: { $set: !placeError ? xcoordinate : tableState.xcoordinate },
        ycoordinate: { $set: !placeError ? ycoordinate : tableState.ycoordinate },
      })
    )
  }

  const tryMoveRobot = (command: CommandType): void => {
    const { faceDirection, gridSize, robotIsPlaced, xcoordinate, ycoordinate } = tableState

    let moveError = null
    let x = xcoordinate
    let y = ycoordinate

    if (!robotIsPlaced || x === undefined || y === undefined) {
      moveError = 'Cannot move unplaced robot'
    } else {
      if (faceDirection === RobotFaceDirectionEnum.EAST) {
        x = x >= gridSize - 1 ? x : x + 1
      } else if (faceDirection === RobotFaceDirectionEnum.NORTH) {
        y = y >= gridSize - 1 ? y : y + 1
      } else if (faceDirection === RobotFaceDirectionEnum.SOUTH) {
        y = y === 0 ? y : y - 1
      } else if (faceDirection === RobotFaceDirectionEnum.WEST) {
        x = x === 0 ? x : x - 1
      }
      moveError = x === xcoordinate && y === ycoordinate ? 'Cannot move robot off the table' : null
    }

    setError(moveError)
    onCommand(
      {
        baseCommand: 'MOVE',
        error: moveError,
        fullString: command.fullString,
      },
      update(tableState, {
        reportPosition: { $set: false },
        xcoordinate: { $set: x },
        ycoordinate: { $set: y },
      })
    )
  }

  const tryTurnRobot = (command: CommandType): void => {
    const { faceDirection, robotIsPlaced } = tableState
    const { baseCommand, fullString } = command

    let turnError = null
    let newDir: RobotFaceDirectionEnum | undefined = faceDirection

    if (robotIsPlaced && faceDirection) {
      if (faceDirection === RobotFaceDirectionEnum.EAST) {
        newDir = baseCommand === BaseCommandEnum.LEFT ? RobotFaceDirectionEnum.NORTH : RobotFaceDirectionEnum.SOUTH
      }
      if (faceDirection === RobotFaceDirectionEnum.NORTH) {
        newDir = baseCommand === BaseCommandEnum.LEFT ? RobotFaceDirectionEnum.WEST : RobotFaceDirectionEnum.EAST
      }
      if (faceDirection === RobotFaceDirectionEnum.SOUTH) {
        newDir = baseCommand === BaseCommandEnum.LEFT ? RobotFaceDirectionEnum.EAST : RobotFaceDirectionEnum.WEST
      }
      if (faceDirection === RobotFaceDirectionEnum.WEST) {
        newDir = baseCommand === BaseCommandEnum.LEFT ? RobotFaceDirectionEnum.SOUTH : RobotFaceDirectionEnum.NORTH
      }
    } else {
      turnError = 'Cannot turn unplaced robot'
    }

    setError(turnError)
    onCommand(
      {
        baseCommand,
        error: turnError,
        fullString,
      },
      update(tableState, {
        faceDirection: { $set: newDir },
        reportPosition: { $set: false },
      })
    )
  }

  const tryReportPosition = (command: CommandType): void => {
    const { faceDirection, robotIsPlaced, xcoordinate, ycoordinate } = tableState

    let reportError = null
    if (!robotIsPlaced) {
      reportError = 'Cannot report position of unplaced robot'
      setError(reportError)
    }

    setError(reportError)
    onCommand(
      {
        baseCommand: 'REPORT',
        error: reportError,
        faceDirection,
        fullString: command.fullString,
        xcoordinate,
        ycoordinate,
      },
      update(tableState, {
        reportPosition: { $set: !reportError },
      })
    )
  }

  const handleCommand = (command: CommandType): void => {
    const { baseCommand, fullString } = command
    const allowedCommands = Object.values(BaseCommandEnum) as string[]

    let cmdError = null
    if (allowedCommands.includes(baseCommand)) {
      switch (baseCommand) {
        case BaseCommandEnum.PLACE:
          tryPlaceRobot(command)
          break
        case BaseCommandEnum.MOVE:
          tryMoveRobot(command)
          break
        case BaseCommandEnum.LEFT:
        case BaseCommandEnum.RIGHT:
          tryTurnRobot(command)
          break
        case BaseCommandEnum.REPORT:
          tryReportPosition(command)
          break
        default:
          setError(`Unhandled base command type ${baseCommand}`)
          break
      }
    } else {
      cmdError = `Bad command, Please use one of: ${Object.values(BaseCommandEnum).join(', ')}`
      setError(cmdError)
      onCommand(
        { baseCommand, error: cmdError, fullString },
        update(tableState, {
          reportPosition: { $set: false },
        })
      )
    }
  }

  return (
    <CommandLineStyled>
      <CommandLineInputHandler error={error} onCommand={handleCommand} />
    </CommandLineStyled>
  )
}
