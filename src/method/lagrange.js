import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';

const MatrixInputSize = ({ setMatrixSize }) => {
  return (
    <input
      type="number"
      defaultValue={2}
      onChange={(e) => {

        let min=2,max=8;
        if(e.target.value<min){
          e.target.value=min;
        }
        else if(e.target.value>max){
          e.target.value=max;
        }

        const rows = parseInt(e.target.value);
        if (min <= rows && rows <= max) {
          setMatrixSize((prevSize) => ({
            ...prevSize,
            rows: rows,
          }));
        }
      }}
    />
  );
};

const MatrixRow = ({ children }) => {
  return <div style={{ display: 'flex' }}>{children}</div>;
};

const MatrixInput = ({ matrixSize, setMatrix }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    let count = 0;
    const matrix = Array(matrixSize.rows)
      .fill(0)
      .map(() => Array(matrixSize.columns).fill(0));

    for (let i = 0; i < matrixSize.rows; i++) {
      for (let j = 0; j < matrixSize.columns; j++) {
        matrix[i][j] =
          !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
        count += 1;
        
      }
    }
    setMatrix(matrix);
  };

  let matrix = Array.from({ length: matrixSize.rows }, () =>
    new Array(matrixSize.columns).fill(0)
  );


  function  calLar(x){
    let a=0,n=matrixSize;
    for(let i=0;i<n;i++){
      let temp=1;
      for(let j=0;j<n;j++){
        if(j!=i){
          temp*=(matrix[0][j]-x)/(matrix[0][j]-matrix[0][i]);
        }
      }
      a+=temp*x[1][i];
    }
    console.log(a);
    return a;
  }


  return (
    <form onSubmit={handleSubmit}>
      {matrix.map((row, indexRow) => (
        <MatrixRow key={indexRow}>
          {row.map((item, indexColumn) => (
            <input
              key={`${indexRow}-${indexColumn}`}
              type="text"
              defaultValue={null}
              name={`${indexRow},${indexColumn}`}
            />
          ))}
        </MatrixRow>
      ))}
      <button type="submit" /*onClick="callar(42000)"*/>{"Calculated"}</button>
    </form>
  );
};




const App = () => {
  const [matrixSize, setMatrixSize] = useState({ rows: 2, columns: 2 });
  const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
  const [checkboxVal, setcheckboxVal]=useState(Array({matrixSize}).fill(false));
  const [latexMatrix, setLatexMatrix] = useState(
    "\\begin{pmatrix}\n 0 & 0\\\\\n 0 & 0\n \\end{pmatrix}"
  );
  let index;

  useEffect(() => {
    setcheckboxVal(Array(matrixSize.rows).fill(false));
  }, [matrixSize]);

  const handleCheckbox = (index) => {
    const temp = [...checkboxVal];
    temp[index] = !temp[index];
    setcheckboxVal(temp);
  };

  

  const renderLatexMatrix = (matrix) => {
    return (
      "\\begin{pmatrix}\n" +
      matrix
        .map((row, index) => row.join(" & ") + (index == matrix.length - 1 ? "\n" : "\\\\\n"))
        .join("") +
      "\\end{pmatrix}"
    );
  };

  const TEST = () => {
    console.log(checkboxVal);
  };

  return (
    <div>

      <div><Link to="/">back</Link></div>
      <br/><br/><br/><br/><br/>


      <h1>Matrix Input</h1>
      <MatrixInputSize setMatrixSize={setMatrixSize} />
      <MatrixInput matrixSize={matrixSize} setMatrix={setMatrix} />

      {Array.from({ length: matrixSize.rows }, (_, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={checkboxVal[index]}
            onChange={() => handleCheckbox(index)}
          /> 
          </div>
        ))}
        
      <BlockMath math={"A = " + latexMatrix} />
      <button onClick={TEST}>test</button> 

    </div>
  );
};

export default App;
