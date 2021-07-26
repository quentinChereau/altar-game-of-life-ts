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

  const [state, setState] = useState([[0]]);
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
        consideredRow.push(0);
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
  
    function renderRow(row: number[], rowNumber: number) {
      return (
        <tr>
          {row.map((cell: number, columnNumber: number) => (
            <td className="AltCell" id={`cell${rowNumber}${columnNumber}`}>
              <div className={`internalCell ${cell === 1 ? " alive" : ""}`}/>
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
