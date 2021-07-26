import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [column, setColumn] = useState(5);
  const [row, setRow] = useState(5);

  const [state, setState] = useState([[false]]);
  const [table, setTable] = useState((<div></div>));

  useEffect(() => {
    var actualState = state;

    //adapting row number
    while(actualState.length < row) {
      actualState.push([]);
    }

    while(actualState.length > row) {
      actualState.splice(-1,1);
    }

    for(var i =0; i < row; i++){
      var consideredRow = actualState[i];
      while(consideredRow.length < column){
        consideredRow.push(false);
      }

      while(consideredRow.length > column){
        consideredRow.splice(-1,1);
      }
    }

    setState(actualState);
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
  
    function changeState(rowNumber: number, columnNumber: number) {
      //cloning to force refresh
      var newState:boolean[][] = [];
      state.forEach( row => newState.push(Object.assign([], row)))
      newState[rowNumber][columnNumber] = !newState[rowNumber][columnNumber];
      console.log(`newState ${newState}`)
      setState(newState);
    }

    function renderRow(row: boolean[], rowNumber: number) {
      console.log(`state ${state}`);
      return (
        <tr>
          {row.map((cell: boolean, columnNumber: number) => (
            <td className={`AltCell ${cell ? " alive" : ""}`} id={`cell${rowNumber}${columnNumber}`} onClick={() => {
              console.log("ici "+rowNumber+columnNumber);
              changeState(rowNumber, columnNumber);}
            }>
              <div className="internalCell"/>
            </td>))}
        </tr>
      );
    }  

    setTable(renderTable());
  }, [column, row, state]);

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
            <Form.Control placeholder="Zip" />
          </Col>
        </Row>
      </Form>
      <Table striped bordered>
          {table}
      </Table>
    </div>
  );
}
  
export default App;
