import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import '../../style.css';
import { det } from 'mathjs';

const CramerRule = () => {
    const [matrixSize, setMatrixSize] = useState(2);
    const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
    const [result, setResult] = useState("");
    const [precis, setPrecis] = useState(7);

    const handleMatrixSize = (e) => {
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
        setMatrixSize(parseInt(val));
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
        let count=0;
        const matrix=Array.from({ length: matrixSize },()=>Array(matrixSize).fill(0));
        const B=Array.from({ length: 1 }, ()=>Array(matrixSize).fill(0));

        for(let i=0;i< matrixSize;i++) {
            for(let j=0;j<matrixSize;j++){
                matrix[i][j]=!isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
                count+=1;
            }
        }

        for(let i=0;i< matrixSize;i++) {
            B[0][i]=!isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
            count+=1;
        }

        //setB(B);
        setMatrix(matrix);
        callar(matrix,B);
    };

    const callar=(matrix,B)=>{
        let a = 0;
        let temp;
        a=det(matrix);

        for(let i=0;i<matrixSize;i++){
            temp = matrix.map(row => [...row]);
            for(let j=0;j<matrixSize;j++){
                temp[j][i]=parseInt(B[0][j]);

            }
            //console.log("temp: "+temp);
            
        }

        setResult(a.toFixed(precis));
    };

    const renderLatexMatrix=(matrix)=>{
        return (
            "\\begin{pmatrix}\n" +
            matrix
                .map((row, index)=>row.join(" & ") + (index === matrix.length - 1 ? "\n" : "\\\\\n"))
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
                onChange={handleMatrixSize}
            />

            <form onSubmit={handleSubmit}>
                {Array.from({ length: matrixSize }, (_, indexRow) => (
                    <div style={{ display: 'flex' }} key={indexRow}>
                        {Array.from({ length: matrixSize }, (_, indexColumn) => (
                            <input
                                key={`${indexRow}-${indexColumn}`}
                                type="text"
                                defaultValue={null}
                                name={`matrix${indexRow}-${indexColumn}`}
                            />
                        ))}
                    </div>
                ))}

                <br />
                {Array.from({ length: 1 }, (_, indexRow) => (
                    <div style={{ display: 'flex' }} key={indexRow}>
                        {Array.from({ length: matrixSize }, (_, indexColumn) => (
                            <input
                                key={`secondMatrix${indexRow}-${indexColumn}`}
                                type="text"
                                defaultValue={null}
                                name={`secondMatrix${indexColumn}`}
                            />
                        ))}
                    </div>
                ))}
                <br/>
                <input type="number" value={precis} onChange={handleSetPrecis} /><br/>

                <button type="submit">Calculated</button>
            </form>

            <br/><br/>
            <div>{result}</div>

            <BlockMath math={"A = " + renderLatexMatrix(matrix)} />
        </div>
    );
};

export default CramerRule;
