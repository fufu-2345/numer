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
    const [matrixX, setMatrixX] = useState([]);
    const [result, setResult] = useState("");
    const [precis, setPrecis] = useState(7);
    const [m, setM] = useState(2);
    const [selectedOption, setSelectedOption] = useState(1);
    const [x, setX] = useState(0);

    const handleInputChange = (index, event) => {
        const newmat = [...matrixX];
        newmat[index] = event.target.value;
        setMatrixX(newmat);
    };

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
        } 
        else if (event.target.value > 99) {
            setPrecis(99);
        } else {
            setPrecis(event.target.value);
        }
    };

    const handleSetM = function (event) {
        if (event.target.value < 1) {
            setM(1);
        } 
        else if (event.target.value > 20) {
            setM(20);
        } else {
            setM(event.target.value);
        }
    };

    const handleSetX = function (event) {
        setX(event.target.value);
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
        let matA;
        let matB;
        
        console.log(matrixX);
        if(selectedOption!=3 && matrixColumn==1){
            let memo=[];
            if(selectedOption==1){
                size=2;
            }
            else if(selectedOption==2){
                size=1+parseInt(m);
            }
            matA = Array.from({ length: size }, () => Array(size).fill(0));
            matB = Array(size).fill(0);
            
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
            matA = Array.from({ length: size }, () => Array(size).fill(0));
            matB = Array(size).fill(0);
            
            console.log("/////////////////");
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
                            for(let k=0;k<matrixRow;k++){
                                sum2+=matrix[k][i-1]*matrix[k][i-1];
                            }  
                        }
                        else {
                            for(let k=0;k<matrixRow;k++){
                                sum2+=matrix[k][i-1]*matrix[k][j-1];
                            }  
                        }
                        matA[i][j]=sum2;
                        matA[j][i]=sum2;
                    } 
                }
            }

            console.log(matA);
            console.log(matB);
        }

        a = det(matA);
        if (a == "0") {
            console.log("divide by 0");
        }

        for (let i = 0; i < size; i++) {
            temp = matA.map(row => [...row]);

            for (let j = 0; j < size; j++) {
                temp[j][i] = parseInt(matB[j]);
            }
            console.log(  (det(temp) / a).toFixed(precis));
            re[i]=(det(temp) / a).toFixed(precis);
        }

        console.log("re "+re);
        

        if(selectedOption!=3){
            let temp=0;
            for(let i=0;i<re.length;i++){
                temp+=parseFloat(re[i])*Math.pow(x,i);
            }
            re=temp;
        }
        else if(selectedOption==3){
            let temp=parseFloat(re[0]);
            for(let i=1;i<re.length;i++){
                temp+=parseFloat(re[i])*matrixX[i-1];
            }
            re=temp;
        }


        setResult((
            <div>
                <p>result:</p>
                {re}
            </div>
        ));
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
            {selectedOption==3 && (
            <input
                type="number"
                defaultValue={1}
                onChange={handleMatrixColumn}
            />
            )}
            <br/>
            <br/>
            set A
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
                set B
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
                        m:  <input type="number" value={m} onChange={handleSetM} /><br />
                        
                    </div>
                )}

                set precis: <input type="number" value={precis} onChange={handleSetPrecis} /><br />
                

                <br/>
                {selectedOption!=3 && (
                    <div>
                        set X: <input type="number" value={x} onChange={handleSetX} /><br />
                    </div>
                )}

                {selectedOption==3 && 
                    Array.from({ length: matrixColumn }, (_, indexRow) => (
                        <div style={{ display: 'flex' }} key={indexRow}>
                            {`set X${indexRow+1}: `}
                            <input
                                key={`secondMatrix${indexRow}-0`}
                                type="text"
                                value={matrixX[indexRow]}
                                onChange={(event) => handleInputChange(indexRow, event)}
                                name={`MatrixX${indexRow}`}
                            />
                        </div>
                    ))
                }
                

                <button type="submit">Calculate</button>     
            </form>

            <br /><br />
            <div>{result}</div>
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
                <br /><br /><br /><br /><br />
            </div>

        </div>
    );
};

export default Regression;
