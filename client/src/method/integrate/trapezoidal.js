import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import '../../style.css';
import axios from 'axios';

const Trapezoidal = () => {
    const [Equation, setEquation] = useState("(4x^5-3x^4+x^3-6x+2)");
    const [result, setResult] = useState(0);
    const [precis, setPrecis] = useState(7);
    const [selectedOption, setSelectedOption] = useState(1);
    const [a, setA] = useState(2);
    const [b, setB] = useState(8);
    const [n, setN] = useState(2);
    const [selectedId, setSelectedId] = useState("");
    const [ids, setIds] = useState([]);
    const getShema="diff/inte";
    const tableName="Trapezoidal";


    const handleTEST=function(event){
        axios.get('http://localhost:5000/getData' ,{
            params: { selectedId ,
                tableName,
                getShema
        }
        })
        .then((response) => {
            console.log("API response:", response.data);

            const fromAPI = response.data.map(function(item) {
                return [item.equation, item.a, item.b];
            });

            console.log("/////////////");

            setEquation(fromAPI[0][0]);
            setA(fromAPI[0][1]);
            setB(fromAPI[0][2]);
        })
        .catch((error) => {
            console.error('เกิดข้อผิดพลาด:', error); 
        });
    }

    useEffect(() => {
        const fetchIds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getTableid',{
                params: {tableName,
                        getShema
                    }
                })
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


    const calcu = function ( a,b){
        let temp=0;
        let h=(b-a)/n;

        if(selectedOption==2){
            for(let i=a+h;i<b;i+=h){
                temp+=evaluate(Equation,{x: i});
            }
            h/=2;
            temp*=2;
        }

        temp+=evaluate(Equation,{x: b});
        temp+=evaluate(Equation,{x: a});
        setResult(temp*(h).toFixed(precis));    
    };

    const inputEquation=function(event){
        setEquation(event.target.value);
    };

    const inputA=function(event){
        setA(event.target.value);
    };
    
    const inputB=function(event){
        setB(event.target.value);
    };

    const inputN=function(event){
        setN(event.target.value);
    };


    const handlePrecis=function(event){
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

    const handleCal = function(){
        calcu(parseFloat(a), parseFloat(b));
    };

    const handleOptionChange = (event) => {
        if(event.target.value==1){
            setN(2);
        }
        setSelectedOption(event.target.value);
    };

    return (
        <Container>
            <div><Link to="/">back</Link></div>
            <br/><br/>

            <div>

                <label>
                    <input
                        type="radio"
                        value="1"
                        checked={selectedOption == '1'}
                        onChange={handleOptionChange}
                    />
                    Single Trapezoidal Rule
                </label>
                <br/>
                <label>
                    <input
                        type="radio"
                        value="2"
                        checked={selectedOption == '2'}
                        onChange={handleOptionChange}
                    />
                    Composite Trapezoidal Rule
                </label>
                <br/><br/><br/>
            </div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Input f(x)</Form.Label>
                    <input
                        type="text"
                        value={Equation}
                        onChange={inputEquation}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                        placeholder="Enter value for f(x)" 
                    />
                    <Form.Label>Input a</Form.Label>
                    <input
                        type="number"
                        value={a}
                        onChange={inputA}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                        placeholder="Enter value for f(x)" 
                    />
                    <Form.Label>Input b</Form.Label>
                    <input
                        type="number"
                        value={b}
                        onChange={inputB}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                    />
                </Form.Group>

                {selectedOption==2 && (
                    <div>
                        <Form.Label>Input n</Form.Label>
                        <input
                            type="number"
                            value={n}
                            onChange={inputN}
                            style={{ width: "20%", margin: "0 auto" }}
                            className="form-control"
                        />
                    </div>
                )}
      
                <div style={{ fontSize: '2em', marginTop: '20px' }}>
                    <BlockMath math={`\\int_{\\scriptsize ${a}}^{\\scriptsize ${b}} ${Equation} \\, dx`} />
                </div>

                <Form.Group>

                    <Form.Label>Input Precision</Form.Label>
                    <input type="number" value={precis} onChange={handlePrecis} style={{ width: "20%", margin: "0 auto" }}/>
                    

                
                </Form.Group>
    
                <Button variant="dark" onClick={handleCal}>
                    Calculate
                </Button>
            </Form>
            <br/>
            <select value={selectedId} onChange={handleSelect}>
                <option value="">Select ID</option>
                {ids.map(id => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
            <button onClick={handleTEST}>Copy</button> 
    
            <br/><br/><br/>
    
            <h5>Answer = {result}</h5>
        </Container>
    );
    
}

export default Trapezoidal;
