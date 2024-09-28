import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {BlockMath} from 'react-katex';
import '../style.css';

const MatrixInputSize=({setMatrixSize})=>{
  return (
    <input
      type="number"
      defaultValue={2}
      onChange={(e)=>{
        const min=2,max=8;
        const value=Math.max(min,Math.min(max,e.target.value));
        e.target.value=value;

        const rows=parseInt(value);
        setMatrixSize((prevSize)=>({
          ...prevSize,
          rows: rows,
        }));
      }}
    />
  );
};

const MatrixRow=({children})=>{
  return <div style={{ display: 'flex' }}>{children}</div>;
};

const MatrixInput = ({ matrixSize, setMatrix, checkboxVal, find }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    let count = 0;
    const matrix = Array.from({ length: matrixSize.rows }, () =>
      Array(matrixSize.columns).fill(0)
    );

    for (let i=0;i<matrixSize.rows;i++) {
      for (let j=0;j<matrixSize.columns;j++) {
        matrix[i][j] =
          !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
        count += 1;
      }
    }

    setMatrix(matrix);
    callar(find,matrix);
  };

  const callar=(find,matrix) => {
    let a=0, n=0;
    let arr=[];

    for (let i=0;i<matrixSize.rows+1;i++) {
      if(checkboxVal[i]){
        arr.push(i);
        n++;
      }
    }

    for(let i=0;i<n;i++) {
      let temp=1;
      for(let j=0;j<n;j++) {
        if(j!==i) {
          
          temp*= (      matrix[arr[j]][0] - parseFloat(find) )   /   ( matrix[arr[j]][0]- matrix[arr[i]][0]    ); ///err
        }
        
      }

      a+=temp*matrix[arr[i]][1];
    }
    console.log(a);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Array.from({ length: matrixSize.rows }, (_, indexRow) => (
        <MatrixRow key={indexRow}>
          {Array.from({ length: matrixSize.columns }, (_, indexColumn) => (
            <input
              key={`${indexRow}-${indexColumn}`}
              type="text"
              defaultValue={null}
              name={`${indexRow},${indexColumn}`}
            />
          ))}
        </MatrixRow>
      ))}
      <button type="submit">{"Calculated"}</button>
    </form>
  );
};

const Lagrange = () => {
  const [matrixSize, setMatrixSize] = useState({ rows: 2, columns: 2 });
  const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
  const [checkboxVal, setCheckboxVal] = useState(Array(matrixSize.rows).fill(false));
  const [find, setfind] = useState("");
  const [result, setresult] = useState("");

  useEffect(() => {
    setCheckboxVal(Array(matrixSize.rows).fill(false));
  }, [matrixSize]);

  const handleCheckbox = (index) => {
    const temp = [...checkboxVal];
    temp[index] = !temp[index];
    setCheckboxVal(temp);
  };

  const handlesetfind = (event)=>{
    setfind(event.target.value);
  }


  const renderLatexMatrix = (matrix) => {
    return (
      "\\begin{pmatrix}\n" +
      matrix
        .map((row, index) => row.join(" & ")+(index === matrix.length - 1 ? "\n" : "\\\\\n"))
        .join("") +
      "\\end{pmatrix}"
    );
  };

  return (
    <div>
      <div><Link to="/">back</Link></div>
      <h1>Matrix Input</h1>
      <MatrixInputSize setMatrixSize={setMatrixSize} />
      <MatrixInput matrixSize={matrixSize} setMatrix={setMatrix} checkboxVal={checkboxVal} find={find}/>

      {Array.from({length: matrixSize.rows}, (_, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={checkboxVal[index]}
            onChange={()=>handleCheckbox(index)}
          />
        </div>
      ))}

      <input type="text" value={find} onChange={handlesetfind}/>

      <br/><br/>

      <div >{result}</div>


      <button onClick={()=>console.log(matrix[0][0]+matrix[4][0])  }>test</button>

      <BlockMath math={"A = "+renderLatexMatrix(matrix)} />

    </div>
  );
};

export default Lagrange;
