import React from 'react'
import { BaseCommandEnum, CommandHistoryType } from '../../types'
import { ErrorItemStyled, ItemStyled } from './CommandHistoryStyles'

interface PropsType {
  commands?: CommandHistoryType[]
}

export const CommandHistory: React.FC<PropsType> = (props) => {
  const { commands } = props

  return (
    <div className="history">
      <h3>Command history:</h3>

      {(!commands || commands.length === 0) && <p>No History</p>}
      {commands && (
        <ol>
          {commands.map((command: CommandHistoryType) => {
            return command.error ? (
              <ErrorItemStyled key={command.order}>{`${command.fullString} (${command.error})`}</ErrorItemStyled>
            ) : (
              <ItemStyled key={command.order}>
                {command.fullString}{' '}
                {command.baseCommand === BaseCommandEnum.REPORT &&
                  `(${command.xcoordinate},${command.ycoordinate},${command.faceDirection})`}
              </ItemStyled>
            )
          })}
        </ol>
      )}
    </div>
  )
}
