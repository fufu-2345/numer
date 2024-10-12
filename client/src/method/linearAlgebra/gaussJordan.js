import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import '../../style.css';
import { det } from 'mathjs';

const CramerRule = () => {
    const [matrixSize, setMatrixSize] = useState({ rows: 2, columns: 2 });
    const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
    const [B, setB] = useState(Array(matrixSize.rows).fill(0));
    const [result, setResult] = useState("");
    const [precis, setPrecis] = useState(7);


    const handleMatrixsizeRow = (e) => {
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
        setMatrixSize((prevSize) => ({ ...prevSize, rows: row }));
    };

    const handleMatrixsizeCollum = (e) => {
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
        const collum = parseInt(val);
        setMatrixSize((prevSize) => ({ ...prevSize, columns: collum }));
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
            <h1>CramerRule</h1>

            <input
                type="number"
                defaultValue={2}
                onChange={handleMatrixsizeRow}
            />

            <input
                type="number"
                defaultValue={2}
                onChange={handleMatrixsizeCollum}
            />

            <form onSubmit={handleSubmit}>
                {Array.from({ length: matrixSize.rows }, (_, indexRow)=>(
                <div style={{ display: 'flex' }} key={indexRow}>
                    {Array.from({ length: matrixSize.columns }, (_, indexColumn)=>(
                    <input
                        key={`${indexRow}-${indexColumn}`}
                        type="text"
                        defaultValue={null}
                        name={`${indexRow},${indexColumn}`}
                    />
                    ))}
                </div>
                ))}

                <br/>
                {Array.from({ length: matrixSize.rows }, (_, indexRow) => (
                    <div style={{ display: 'flex' }} key={indexRow}>
                        <input
                            key={`${indexRow}-0`}
                            type="text"
                            defaultValue={null}
                            name={`secondMatrix${indexRow}`}
                        />
                    </div>
                ))}
                <br/>
                <input type="number" value={precis} onChange={handleSetPrecis}/><br/>

                <button type="submit">Calculated</button>
            </form>

            <br /><br />
            <div>{result}</div>

            <BlockMath math={"A = " + renderLatexMatrix(matrix)} />
        </div>
        );
};

export default CramerRule;
