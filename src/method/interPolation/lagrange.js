import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import '../../style.css';

const Lagrange = () => {
  const [matrixSize, setMatrixSize] = useState({ rows: 2, columns: 2 });
  const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
  const [checkboxVal, setCheckboxVal] = useState(Array(matrixSize.rows).fill(false));
  const [find, setFind] = useState("");
  const [result, setResult] = useState("");
  const [precis, setPrecis] = useState(7);

  useEffect(() => {
    setCheckboxVal(Array(matrixSize.rows).fill(false));
  }, [matrixSize]);

  const handleMatrixSizeChange = (e) => {
    const min=2, max=8;
    const value =Math.max(min, Math.min(max, e.target.value));
    e.target.value =value;
    const rows = parseInt(value);
    setMatrixSize((prevSize) => ({ ...prevSize, rows: rows }));
  };

  const handleCheckbox = (index) => {
    const temp = [...checkboxVal];
    temp[index] = !temp[index];
    setCheckboxVal(temp);
  };

  const handleSetFind = (e) => {
    setFind(e.target.value);
  };

  const handleSetPrecis = (e) => {
    if(e.target.value>-1 && e.target.value<100){
      setPrecis(e.target.value);
    }
    
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let count = 0;
    const matrix = Array.from({ length: matrixSize.rows }, () =>
      Array(matrixSize.columns).fill(0)
    );

    for (let i = 0; i < matrixSize.rows; i++) {
      for (let j = 0; j < matrixSize.columns; j++) {
        matrix[i][j] =
          !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
        count += 1;
      }
    }

    setMatrix(matrix);
    callar(matrix);
  };

  const callar=(matrix)=>{
    let a=0,n=0;
    let arr=[];

    for (let i = 0; i < matrixSize.rows + 1; i++) {
      if (checkboxVal[i]) {
        arr.push(i);
        n++;
      }
    }

    for (let i=0;i<n;i++) {
      let temp=1;
      for (let j=0;j<n;j++) {
        if(j !==i){
          temp *=(    matrix[arr[j]][0] - parseFloat(find)  )       /      (matrix[arr[j]][0]     -    matrix[arr[i]][0]    );
        }
      }
      a +=temp*matrix[arr[i]][1];
    }
    console.log(a);
    setResult(a.toFixed(precis));
  };

  const renderLatexMatrix =(matrix) => {
    return (
      "\\begin{pmatrix}\n" +
      matrix
        .map((row, index) => row.join(" & ") + (index === matrix.length - 1 ? "\n" : "\\\\\n"))
        .join("") +
      "\\end{pmatrix}"
    );
  };

  return (
    <div>
      <div><Link to="/">back</Link></div>
      <h1>LagrangeInterpolation</h1>

      <input
        type="number"
        defaultValue={2}
        onChange={handleMatrixSizeChange}
      />

      <form onSubmit={handleSubmit}>
        {Array.from({ length: matrixSize.rows }, (_, indexRow) => (
          <div style={{ display: 'flex' }} key={indexRow}>
            {Array.from({ length: matrixSize.columns }, (_, indexColumn) => (
              <input
                key={`${indexRow}-${indexColumn}`}
                type="text"
                defaultValue={null}
                name={`${indexRow},${indexColumn}`}
              />
            ))}
          </div>
        ))}
        <input type="number" value={precis} onChange={handleSetPrecis}/><br/>
        <button type="submit">Calculated</button>
      </form>

      {Array.from({ length: matrixSize.rows }, (_, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={checkboxVal[index]}
            onChange={() => handleCheckbox(index)}
          />
        </div>
      ))}

      <input type="text" value={find} onChange={handleSetFind} />
      <br /><br />
      <div>{result}</div>

      <BlockMath math={"A = " + renderLatexMatrix(matrix)} />
    </div>
  );
};

export default Lagrange;
