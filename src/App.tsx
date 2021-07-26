import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';

function App() {
  const [column, setColumn] = useState(50);
  const [row, setRow] = useState(50);

  const [state, setState] = useState([[false]]);
  const [table, setTable] = useState((<div></div>));
  const [running, setRunning] = useState(false);

  useEffect(() => {
    generateGridBasedOnSize();
  }, [column, row, state]);

  useEffect(() => {
    const renderTable = function(){
      return (
        <tbody>
          {
            state.map((row, index) => renderRow(row, index))
          }
        </tbody>
      );
    }

    function renderRow(row: boolean[], rowNumber: number) {
      return (
        <tr>
          {row.map((cell: boolean, columnNumber: number) => (
            <td className={`AltCell ${cell ? " alive" : ""}`} id={`cell${rowNumber}${columnNumber}`} onClick={() => {
              changeState(rowNumber, columnNumber);}
            }>
              <div className="internalCell"/>
            </td>))}
        </tr>
      );
    }  

    function changeState(rowNumber: number, columnNumber: number) {
      //cloning to force refresh
      var newState: boolean[][] = cloneState();
      newState[rowNumber][columnNumber] = !newState[rowNumber][columnNumber];
      setState(newState);
    }

    setTable(renderTable());
  }, [column, row, state]);

  const aGameOfLifeRound = function(){
    var newState = cloneState();

    newState.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
          const numberOfNeighbor = countNeighbor(rowIndex, cellIndex);
          if(cell) {
            newState[rowIndex][cellIndex] = numberOfNeighbor < 4 && numberOfNeighbor > 1;
          } else {
            newState[rowIndex][cellIndex] = numberOfNeighbor === 3;
          }
      })
    });

    setState(newState);
  }

  const MOVEMENT = [-1, 0, 1];
  const countNeighbor = function(rowIndex: number, columnIndex: number){
    return MOVEMENT.reduce((sum, horizontalMovement) => {
      const isCellValide = (verticalMovement: number): boolean => {
        if (horizontalMovement === 0 && verticalMovement === 0)
          return false;
        if (rowIndex + verticalMovement < 0 || rowIndex + verticalMovement >= row)
          return false;
        if (columnIndex + horizontalMovement < 0 || columnIndex + horizontalMovement >= column)
          return false;
        return true;
      };
      return sum += MOVEMENT.filter(isCellValide)
      .reduce((currentSum, verticalMovement) => {
        return currentSum + (state[rowIndex + verticalMovement][columnIndex + horizontalMovement] ? 1 : 0);
      }, 0)
    }, 0);
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      if(running) {
        aGameOfLifeRound();
      }
    }, 500);
    return () => clearInterval(intervalID);
  }, [running, state]);

  const changeRunStatus = function(){
    setRunning(!running);
  }

  return (
    <div className="App">
      <Form className="bg-secondary p-3">
        <Row>
          <Col xs={5}>
            <Form.Control placeholder="Number of column" value={column} onChange={(event) => {setColumn(parseInt(event.target.value) || 0); return true;}} type="int"/>
          </Col>
          <Col xs={5}>
            <Form.Control placeholder="Number of row" value={row} onChange={(event) => {setRow(parseInt(event.target.value) || 0); return true;}} type="int"/>
          </Col>
          <Col>
            <Button variant="primary" onClick={aGameOfLifeRound}>Run one round</Button>
            <Button variant="primary" onClick={changeRunStatus} className="mx-3">{running ? "Stop the run" : "Run"}</Button>
          </Col>
        </Row>
      </Form>
      <Table striped bordered>
          {table}
      </Table>
    </div>
  );

  function generateGridBasedOnSize() {
    var actualState = state;

    while (actualState.length < row) {
      actualState.push([]);
    }

    while (actualState.length > row) {
      actualState.splice(-1, 1);
    }

    for (var i = 0; i < row; i++) {
      var consideredRow = actualState[i];
      while (consideredRow.length < column) {
        consideredRow.push(false);
      }

      while (consideredRow.length > column) {
        consideredRow.splice(-1, 1);
      }
    }

    setState(actualState);
  }

  function cloneState() {
    var newState: boolean[][] = [];
    state.forEach(row => newState.push(Object.assign([], row)));
    return newState;
  }
}
  
export default App;
