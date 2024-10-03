import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import '../../style.css';
import CubicSpline from 'cubic-spline';

const Spline = () => {
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

  const handleSetPrecis=function(event){
    if(event.target.value<0){
        setPrecis(0);
    }
    else if(event.target.value>99){
        setPrecis(99);
    }
    else{
        setPrecis(event.target.value);
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

  function slope(y2,y1,x2,x1){
    return (  (y2-y1)  /  (x2-x1)  );
  }

  const callar=(matrix)=>{
    let a=0,n=0,m;
    let arr=[];
    const xVal=[],yVal=[];

    for (let i = 0; i < matrixSize.rows + 1; i++) {
      if (checkboxVal[i]) {
        arr.push(i);
        xVal.push(matrix[i][0]);
        yVal.push(matrix[i][1]);
        n++;
      }
    }
    
    console.log("xVal yVal");
    console.log(xVal);
    console.log(yVal);

    if(n==2){
        m=slope( matrix[arr[1]][1]  , matrix[arr[0]][1]  , matrix[arr[1]][0]  , matrix[arr[0]][0] );
        console.log(matrix[arr[0]][1]);
        a= matrix[arr[0]][1] +    (m*(find-matrix[arr[0]][0]));

    }
    else{
        console.log("good");
        const spline = new CubicSpline(xVal, yVal);
        a = spline.at(find);
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
      <h1>SplineInterpolation</h1>

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

export default Spline;
