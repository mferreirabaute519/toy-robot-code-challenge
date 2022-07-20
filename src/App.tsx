import React, { useState } from 'react'
import { CommandHistory } from './components/CommandHistory/CommandHistory'
import { CommandLine } from './components/CommandLine/CommandLine'
import type { CommandType, CommandHistoryType, TableStateType } from './types'
import './App.css'

const App: React.FC = () => {
  const initialState: TableStateType = {
    gridSize: 5,
    robotIsPlaced: false,
  }
  const [tableState, setTableState] = useState(initialState)
  const [history, setHistory] = useState<CommandHistoryType[]>([])

  const commandEnterHandler = (command: CommandType, newTableState: TableStateType): void => {
    setTableState(newTableState)
    setHistory([...history, { ...command, order: history.length++ }])
  }

  return (
    <div>
      <CommandLine onCommand={commandEnterHandler} tableState={tableState} />
      <CommandHistory commands={history} />
    </div>
  )
}

export default App
