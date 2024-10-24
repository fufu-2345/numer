import React, { useState , useEffect} from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import { Button } from 'react-bootstrap';
import '../../style.css';
import { det } from 'mathjs';
import axios from 'axios';

const CramerRule = () => {
    const [matrixSize, setMatrixSize] = useState(2);
    const [matrix, setMatrix] = useState([[null, null], [null, null]]);
    const [matrixB, setMatrixB] = useState([null, null]);
    const [result, setResult] = useState("");
    const [precis, setPrecis] = useState(7);
    const [result2, setResult2] = useState("");
    const [ids, setIds] = useState([]);
    const [selectedId, setSelectedId] = useState("");

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
        const B=Array(matrixSize).fill(0);

        for(let i=0;i< matrixSize;i++) {
            for(let j=0;j<matrixSize;j++){
                matrix[i][j]=!isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
                count+=1;
            }
        }

        for(let i=0;i< matrixSize;i++) {
            B[i]=!isNaN(parseFloat(event.target[count].value)) ? parseFloat(event.target[count].value) : 0;
            count+=1;
        }

        //setB(B);
        setMatrix(matrix);
        setMatrixB(B);
        callar(matrix,B);
    };

    const callar=(matrix,B)=>{
        let a = 0;
        let re=[];
        let temp;
        a=det(matrix);

        if(a=="0"){
            console.log("divide by 0");
        }

        console.log(matrixSize);
        for(let i=0;i<matrixSize;i++){
            temp = matrix.map(row => [...row]);

            for(let j=0;j<matrixSize;j++){
                temp[j][i]=parseInt(B[j]);
            }
            re.push(`a${i}: ${((det(temp)/a)).toFixed(precis)} `);
        }

        setResult2((
            <div>
                <p>result:</p>
                {re.join(", ")}
            </div>
        ));
        
        console.log(B);
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

    const handleTEST=function(event){
        axios.get('http://localhost:5100/cramerRule/id' ,{
            params: { selectedId }
        })
        .then((response) => {
            console.log("API response:", response.data);
            
            const fromAPI = response.data.map(function(item) {
                return [item.matrixVal, item.matSize];
            });

            console.log("/////////////");
            console.log(fromAPI[0][0]);
            console.log(fromAPI[0][1]);

            setMatrixSize(parseInt(fromAPI[0][1]));
            //setMatrix(parseInt(fromAPI[0][0]));   
        })
        .catch((error) => {
            console.error('เกิดข้อผิดพลาด:', error); 
        });
    }


    useEffect(() => {
        const fetchIds = async () => {
            try {
                const response = await axios.get('http://localhost:5100/cramerrule');
                setIds(response.data);
            } catch (error) {
                console.error('Error fetching idCramer:', error);
            }
        };

        fetchIds();
    }, []);

    const handleSelect = (event) => {
        setSelectedId(event.target.value);
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
            <h1>CramerRule</h1>

            <input
                type="number"
                value={matrixSize}
                onChange={handleMatrixSize}
            />

            <form onSubmit={handleSubmit}>
                {Array.from({ length: matrixSize }, (_, indexRow) => (
                    <div style={{ display: 'flex' }} key={indexRow}>
                        {Array.from({ length: matrixSize }, (_, indexColumn) => (
                            <input
                                key={`${indexRow}-${indexColumn}`}
                                type="text"
                                value={matrix[indexRow] ? matrix[indexRow][indexColumn] : ''}
                                name={`matrix${indexRow}-${indexColumn}`}
                                onChange={(e) => {
                                    const newMatrix = [...matrix];
                                    newMatrix[indexRow][indexColumn] = e.target.value;
                                    setMatrix(newMatrix);
                                }}
                            />
                        ))}
                    </div>
                ))}

                <br />
                {Array.from({ length: matrixSize }, (_, indexRow) => (
                    <div style={{ display: 'flex'}} key={indexRow}>
                        <input
                        key={`secondMatrix${indexRow}-0`}
                        type="text"
                        defaultValue={null}
                        name={`secondMatrix${indexRow}`}
                        />
                    </div>
                ))}

                <br/>
                <input type="number" value={precis} onChange={handleSetPrecis} /><br/>

                <button type="submit">Calculated</button>
            </form>
            

            <select value={selectedId} onChange={handleSelect}>
                <option value="">Select ID</option>
                {ids.map(id => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
            <button onClick={handleTEST}>Copy</button>
            
            <br/>
            {selectedId && <p>selected: {selectedId}</p>}

            <br/><br/>
            <div>{result}</div>

            <BlockMath math={"A = " + renderLatexMatrix(matrix)} />
            <br/>
            <BlockMath math={"B = " + renderLatexmatrixB(matrixB)} />
            <br/>
            <div>{result2}</div>
            <br/>
            <br/>
            
        </div>
    );
};

export default CramerRule;
