import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {BlockMath} from 'react-katex';

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

const MatrixInput = ({ matrixSize, setMatrix, checkboxVal }) => {
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
    callar(42000,matrix);
  };

  const callar=(x,matrix) => {
    let a=0, n=0;
    let arr=[];

    for (let i=0;i<matrixSize.rows+1;i++) {
      if(checkboxVal[i]){
        arr.push(i);
        n++;
      }
    }
    /*
    console.log("arr/n");
    console.log(arr);
    console.log(n);
    
    console.log("check");
    console.log(matrix[0][0]);
    console.log(matrix[1][0]);
    console.log(matrix[2][0]);
    console.log(matrix[3][0]);
    console.log(matrix[4][0]);*/

    for(let i=0;i<n;i++) {
      let temp=1;
      for(let j=0;j<n;j++) {
        if(j!==i) {
          
          temp*= (      matrix[arr[j]][0] - x )   /   ( matrix[arr[j]][0]- matrix[arr[i]][0]    ); ///err
        }
        
      }

      a+=temp*matrix[arr[i]][1];
      console.log(a);
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

const App = () => {
  const [matrixSize, setMatrixSize] = useState({ rows: 2, columns: 2 });
  const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
  const [checkboxVal, setCheckboxVal] = useState(Array(matrixSize.rows).fill(false));

  useEffect(() => {
    setCheckboxVal(Array(matrixSize.rows).fill(false));
  }, [matrixSize]);

  const handleCheckbox = (index) => {
    const temp = [...checkboxVal];
    temp[index] = !temp[index];
    setCheckboxVal(temp);
  };

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
      <MatrixInput matrixSize={matrixSize} setMatrix={setMatrix} checkboxVal={checkboxVal} />

      {Array.from({length: matrixSize.rows}, (_, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={checkboxVal[index]}
            onChange={()=>handleCheckbox(index)}
          />
        </div>
      ))}

      <button onClick={()=>console.log(matrix[0][0]+matrix[4][0])  }>test</button>
      
      <BlockMath math={"A = "+renderLatexMatrix(matrix)} />
    </div>
  );
};



export default App;
