The application is a simulation of a toy robot moving on a square table top, of dimensions 5 units x 5 units. There are no other obstructions on the table surface. The robot is free to roam around the surface of the table, but must be prevented from falling to destruction. Any movement that would result in the robot falling from the table must be prevented, however further valid movement commands must still be allowed.

Available commands:
PLACE X,Y,F
MOVE
LEFT
RIGHT
REPORT

- PLACE will put the toy robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST.
- The origin (0,0) can be considered to be the SOUTH WEST most corner.
- It is required that the first command to the robot is a PLACE command, after that, any sequence of commands may be issued, in any order, including another PLACE command.
- The application should discard all commands in the sequence until a valid PLACE command has been executed.
- MOVE will move the toy robot one unit forward in the direction it is currently facing.
- LEFT and RIGHT will rotate the robot 90 degrees in the specified direction without changing the position of the robot.
- REPORT will announce the X,Y and F of the robot.
- This can be in any form, but standard output is sufficient.
- A robot that is not on the table can choose to ignore the MOVE, LEFT, RIGHT and REPORT commands.
- Standard input provided for testing
- The application should handle error states appropriately and be robust to user input.

Steps to test the app:
1. Open the terminal and run `yarn install`
2. Run `yarn start`
3. Start testing the app typing the commands in the displayed

Note: To run the tests do `yarn test` in the terminal

1. TEST DATA - Place the robot at the bottom left of the grid:
PLACE 0 0 EAST
REPORT

2. TEST DATA - Error placing the robot off the grid:
PLACE 0 10 EAST

3. TEST DATA - Move the robot 3 spots in the grid
PLACE 0 0 EAST
MOVE
MOVE
MOVE
REPORT

4. TEST DATA - Rotate the robot to the right, move it and face an error. Then rotate it to the left twice and move it 2 spots in the grid
* After doing TEST DATA 3
RIGHT
MOVE
LEFT
LEFT
MOVE
MOVE
REPORT

5. TEST DATA - Insert a command not included within the available ones - it will ignore the command and display the error on top and also in the command history
PLACE 0 0 EAST
COMMAND