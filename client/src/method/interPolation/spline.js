import React, { useState, useEffect, useRef  } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import '../../style.css';

const Spline = () => {
  const [matrixSize, setMatrixSize] = useState({ rows: 2, columns: 2 });
  const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
  const [checkboxVal, setCheckboxVal] = useState(Array(matrixSize.rows).fill(false));
  const [find, setFind] = useState("");
  const [result, setResult] = useState("");
  const [precis, setPrecis] = useState(7);
  
  const oldMat = useRef([]);
  const memo = useRef([]);

  useEffect(() => {
    setCheckboxVal(Array(matrixSize.rows).fill(false));
  }, [matrixSize]);

  const handleMatrixSizeChange=(e)=>{
    let val=2;
    if(e.target.value<2){
      val=2;
    }
    else if(e.target.value>8){
      val=8;
    }
    else{
      val=e.target.value;
    } 

    e.target.value=val;
    const rows = parseInt(val);
    setMatrixSize((prevSize) => ({ ...prevSize, rows: rows }));
    memo.current=[];
    console.log(memo.current);
  };


  const handleCheckbox = (index) => {
    const temp = [...checkboxVal];
    temp[index] = !temp[index];
    setCheckboxVal(temp);
    memo.current=[];
    console.log("memo reseted");
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

  const arraysEqual=(arr1, arr2)=>{
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].length !== arr2[i].length) return false;
      for (let j = 0; j < arr1[i].length; j++) {
        if (arr1[i][j] !== arr2[i][j]) return false;
      }
    }
    return true;
  };

  const handleSubmit=(event)=>{

    event.preventDefault();
    let count = 0;
    const matrix=Array.from({length: matrixSize.rows},()=>Array(matrixSize.columns).fill(0));

    for(let i=0;i<matrixSize.rows;i++){
      for(let j=0;j<matrixSize.columns;j++) {
        matrix[i][j] =
          !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
        count += 1;
      }
    }
    if (!arraysEqual(oldMat.current, matrix)) {
      memo.current=[];
      console.log("memo reseted");
      oldMat.current = matrix;
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
    let term=0;

    for (let i=0;i<matrixSize.rows+1;i++) {
      if (checkboxVal[i]) {
        arr.push(i);
        n++;
      }
    }
    
    /////  find term;
    for(let i=0;i<matrixSize.rows-1;i++){  
      if(find > matrix[i][0]  &&   find < matrix[i+1][0]){
        term=i;
        break;
      }
    }
  

    if(arr.length==2){

      console.log("linear");
      if(memo.current[term]==undefined){
        m=slope( matrix[arr[1]][1]  , matrix[arr[0]][1]  , matrix[arr[1]][0]  , matrix[arr[0]][0] );
        memo.current[term]=m;
        console.log("calculated m");
      }
      else{
        console.log("m from array");
      }
      a= matrix[arr[0]][1] +    (memo.current[term]*(find-matrix[arr[0]][0]));

    }


    else {
      console.log("not linear");
    }
    



    setResult(a.toFixed(precis));
    console.log("result: "+a.toFixed(precis));
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

        {Array.from({ length: matrixSize.rows }, (_, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={checkboxVal[index]}
              onChange={() => handleCheckbox(index)}
            />
          </div>
        ))}

        <input type="number" value={precis} onChange={handleSetPrecis}/><br/>
        <button type="submit">Calculated</button>
      </form>

      

      <input type="text" value={find} onChange={handleSetFind} />
      <br /><br />
      <div>{result}</div>

      <BlockMath math={"A = " + renderLatexMatrix(matrix)} />
    </div>
  );
};

export default Spline;
