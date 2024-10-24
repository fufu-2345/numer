import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import '../../style.css';
import { det } from 'mathjs';

const GaussJordan = () => {
    const [matrixSize, setMatrixSize] = useState({ rows: 2, columns: 2 });
    const [matrix, setMatrix] = useState(Array(matrixSize.rows).fill().map(() => Array(matrixSize.columns).fill(null)))
    const [B, setB] = useState(Array(matrixSize.rows).fill(null));
    const [result, setResult] = useState("");
    const [precis, setPrecis] = useState(7);


    const handleMatrixsize = (e) => {
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

        e.target.value =val;
        const row = parseInt(val);
        const col = parseInt(val);
        setMatrixSize((prevSize) => ({ rows: row, columns: col }));

        setMatrix(Array(row).fill().map(() => Array(col).fill(null)));
        setB(Array(row).fill(null));
    };

    const handlematA = (row, col, value) => {
        const newmatA = [...matrix];
        newmatA[row][col] = parseFloat(value);
        setMatrix(newmatA);
    }

    const handlematB = (row, value) => {
        const newmatB = [...B];
        newmatB[row] = parseFloat(value);
        setB(newmatB);
    }

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

    const handleSubmit=(event)=>{
        event.preventDefault();
        let count = 0;
        const matrix = Array.from({length: matrixSize.rows},()=>Array(matrixSize.columns).fill(0));
        const B = Array.from({length: matrixSize.rows},()=>[0]);

        for (let i=0;i<matrixSize.rows;i++){
            for (let j=0;j<matrixSize.columns;j++){
                matrix[i][j] =
                !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
                count += 1;
            }
        }


        for (let i = 0; i < matrixSize.rows; i++) {
            B[i][0] = !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
            count += 1;
        }

        setMatrix(matrix);
        setB(B);
        callar(matrix);
    };

    ////////  https://mathjs.org/docs/datatypes/matrices.html
    const callar=(matrix)=>{
        let a=0;
        console.log("B: "+B);

        console.log(matrix);
        a=det(matrix);
        setResult(a.toFixed(precis));
        
    };

    const renderLatexMatrix=(matrix)=>{
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
            <h1>GaussJordan</h1>

            <input
                type="number"
                defaultValue={2}
                onChange={handleMatrixsize}
            />

            <br/>
            
            {matrix.map((row, rowIndex) => (
                <div key={rowIndex}>
                    {row.map((value, colIndex) => (
                        <input
                            key={colIndex}
                            type="number"
                            value={matrix[rowIndex][colIndex]}
                            onChange={(e) => handlematA(rowIndex, colIndex, e.target.value)}
                        />
                    ))}          
                </div> 
            ))}

            {matrix.map((row, rowIndex) => (
                <div>
                    <input
                        type="number"
                        value={B[rowIndex]}
                        onChange={(e) => handlematB(rowIndex, e.target.value)}
                    />
                    <br/>
                </div>  
            ))}


            <br/>
            <input type="number" value={precis} onChange={handleSetPrecis}/><br/>

            <button type="submit">Calculated</button>

            <br /><br />
            <div>{result}</div>

            <BlockMath math={"A = " + renderLatexMatrix(matrix)} />
        </div>
        );
};

export default GaussJordan;
