import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import '../../style.css';
import { det } from 'mathjs';

const Regression = () => {
    const [matrixRow, setMatrixRow] = useState(2);
    const [matrixColumn, setMatrixColumn] = useState(1);
    const [matrix, setMatrix] = useState([[0, 0], [0, 0]]);
    const [matrixB, setMatrixB] = useState([0, 0]);
    const [result, setResult] = useState("");
    const [precis, setPrecis] = useState(7);
    const [m, setM] = useState(2);
    const [selectedOption, setSelectedOption] = useState(1);

    const handleOptionChange = (event) => {
        if(event.target.value!=3){
            setMatrixColumn(1);
        }
        setSelectedOption(event.target.value);
    };

    const handleMatrixRow = (e) => {
        let val = 2;
        if (e.target.value < 2) {
            val = 2;
        } 
        else if (e.target.value > 20) {
            val = 20;
        } else {
            val = e.target.value;
        }

        e.target.value = val;
        setMatrixRow(parseInt(val));
    };

    const handleMatrixColumn = (e) => {
        let val = 1;

        if(selectedOption==1 || selectedOption==2){
            val = 1;
        }
        else if (e.target.value < 1) {
            val = 1;
        } 
        else if (e.target.value > 8) {
            val = 8;
        } else {
            val = e.target.value;
        }

        e.target.value = val;
        setMatrixColumn(parseInt(val));
    };

    const handleSetPrecis = function (event) {
        if (event.target.value < 0) {
            setPrecis(0);
        } else if (event.target.value > 99) {
            setPrecis(99);
        } else {
            setPrecis(event.target.value);
        }
    };

    const handleSetM = function (event) {
        if (event.target.value < 1) {
            setM(1);
        } else if (event.target.value > 20) {
            setM(20);
        } else {
            setM(event.target.value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let count = 0;
        const matrix = Array.from({ length: matrixRow }, () => Array(matrixColumn).fill(0));
        const B = Array(matrixRow).fill(0);

        for (let i = 0; i < matrixRow; i++) {
            for (let j = 0; j < matrixColumn; j++) {
                matrix[i][j] = !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
                count += 1;
            }
        }

        for (let i = 0; i < matrixRow; i++) {
            B[i] = !isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
            count += 1;
        }

        setMatrix(matrix);
        setMatrixB(B);
        callar(matrix, B);
    };

    const callar = (matrix, B) => {
        let a = 0;
        let re = [];
        let temp;
        let size=0;
        
        if(selectedOption!=3 && matrixColumn==1){
            let memo=[];
            if(selectedOption==1){
                size=2;
            }
            else if(selectedOption==2){
                size=m+1;
            }
            let matA = Array.from({ length: size }, () => Array(size).fill(0));
            let matB = Array(size).fill(0);
            
            for(let i=0;i<size+size;i++){
                let sum=0;
                let sum2=0;
                //////  for b
                if(i<size){
                    for(let j=0;j<matrixRow;j++){
                        sum+=   (Math.pow(matrix[j], i)  *  B[j]    );
                    }
                    matB[i]=sum; 
                }

                /// memo for A
                for(let j=0;j<matrixRow;j++){
                    sum2+=  Math.pow(matrix[j], i);
                }
                memo.push(sum2); 
            }

            for(let i=0;i<size;i++){
                for(let j=0;j<size;j++){
                    let now=i+j;
                    matA[i][j]=memo[now];
                }
            }
            console.log(matA);
            console.log(matB);
        }



        else if(selectedOption==3){
            size=matrixColumn+1;
            let matA = Array.from({ length: size }, () => Array(size).fill(0));
            let matB = Array(size).fill(0);

            
            console.log("/////////////////");
            /*
            console.log(mat);
            console.log(matB);*/
            
            for(let i=0;i<size+size;i++){
                let sum=0;
                let sum2=0;

                //////  for b
                if(i<size){
                    for(let j=0;j<matrixRow;j++){
                        if(i==0){
                            sum+= B[j];
                        }
                        else{
                            sum+=   (matrix[j][i-1] *  B[j]    );
                        }
                    }
                    matB[i]=sum; 
                }

                
                for(let j=i;j<size;j++){
                    sum2=0;
                    if(i==0){
                        if(j==0){
                            sum2=matrixRow;
                        }
                        else{
                            for(let k=0;k<matrixRow;k++){
                                sum2+=matrix[k][j-1];
                            }
                        }
                        matA[i][j]=sum2;
                        matA[j][i]=sum2;
                    }
                    else{
                        if(i==j){
                            
                        }
                    }
                    
                }
 
            }

            console.log(matA);
            console.log(matB);
            
        }

        /*a = det(matrix);

        if (a == "0") {
            console.log("divide by 0");
        }

        for (let i = 0; i < matrixColumn; i++) {
            temp = matrix.map(row => [...row]);

            for (let j = 0; j < matrixRow; j++) {
                temp[j][i] = parseInt(B[j]);
            }
            re.push(`a${i}: ${((det(temp) / a)).toFixed(precis)} `);
        }

        setResult2((
            <div>
                <p>result:</p>
                {re.join(", ")}
            </div>
        ));

        setResult(a.toFixed(precis));*/
    };

    const renderLatexMatrix = (matrix) => {
        return (
            "\\begin{pmatrix}\n" +
            matrix
                .map((row, index) => row.join(" & ") + (index === matrix.length - 1 ? "\n" : "\\\\\n"))
                .join("") +
            "\\end{pmatrix}"
        );
    };

    const renderLatexmatrixB = (matrixB) => {
        return (
            "\\begin{pmatrix}\n" +
            matrixB
                .map((value, index) => value + (index === matrixB.length - 1 ? "\n" : "\\\\\n"))
                .join("") +
            "\\end{pmatrix}"
        );
    };

    return (
        <div>
            <div><Link to="/">back</Link></div>
            <h1>Regression</h1>

            <input
                type="number"
                defaultValue={2}
                onChange={handleMatrixRow}
            />

            <input
                type="number"
                defaultValue={1}
                onChange={handleMatrixColumn}
            />

            <form onSubmit={handleSubmit}>
                {Array.from({ length: matrixRow }, (_, indexRow) => (
                    <div style={{ display: 'flex' }} key={indexRow}>
                        {Array.from({ length: matrixColumn }, (_, indexColumn) => (
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
                {Array.from({ length: matrixRow }, (_, indexRow) => (
                    <div style={{ display: 'flex' }} key={indexRow}>
                        <input
                            key={`secondMatrix${indexRow}-0`}
                            type="text"
                            defaultValue={null}
                            name={`secondMatrix${indexRow}`}
                        />
                    </div>
                ))}

                <br />
                {selectedOption==2 && (
                    <div>
                        <input type="number" value={m} onChange={handleSetM} /><br />
                    </div>
                )}

                <input type="number" value={precis} onChange={handleSetPrecis} /><br />

                <button type="submit">Calculate</button>
            </form>

            <br /><br />
            <div>{result}</div>

            <BlockMath math={"A = " + renderLatexMatrix(matrix)} />
            <br />
            <BlockMath math={"B = " + renderLatexmatrixB(matrixB)} />
            <br />

            <br />

            <div>

            <label>
                <input
                    type="radio"
                    value="1"
                    checked={selectedOption == '1'}
                    onChange={handleOptionChange}
                />
                Linear Regression
            </label>
            <br />
            <label>
                <input
                    type="radio"
                    value="2"
                    checked={selectedOption == '2'}
                    onChange={handleOptionChange}
                />
                Polynomail Regression
            </label>
            <br />
            <label>
                <input
                    type="radio"
                    value="3"
                    checked={selectedOption == '3'}
                    onChange={handleOptionChange}
                />
                Multiple Linear Regression
            </label>
            <br />
            <p>{selectedOption}</p>
        </div>

        </div>
    );
};

export default Regression;
