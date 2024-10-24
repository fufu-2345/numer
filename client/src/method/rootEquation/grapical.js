import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../style.css';
import axios from 'axios';

const Grapical = () => {
    const [Equation, setEquation] = useState("(x^4)-13");
    const [precis, setPrecis] = useState(7);
    const [result, setResult] = useState(0);
    const [e ,setError] = useState(0.000001);
    const [checkboxVal, setCheckboxVal] = useState(Array(2).fill(true));
    const [selectedId, setSelectedId] = useState("");
    const [ids, setIds] = useState([]);


    const handleCheckbox = (index) => {
        const temp = [...checkboxVal];
        temp[index] = !temp[index];
        setCheckboxVal(temp);
    };


    const handleTEST=function(event){
        axios.get('http://localhost:5000/grapical/id' ,{
            params: { selectedId }
        })
        .then((response) => {
            console.log("API response:", response.data);
            
            const fromAPI = response.data.map(function(item) {
                return [item.equation];
            });

            console.log("/////////////");

            setEquation(fromAPI[0][0]);
            //setMatrix(parseInt(fromAPI[0][0]));  
        })
        .catch((error) => {
            console.error('เกิดข้อผิดพลาด:', error); 
        });
    }
  
    useEffect(() => {
        const fetchIds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/grapical');
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


    const error = function (xold, xnew){
        return Math.abs(    (xnew - xold)    /xnew)       *100;
    };

    const Calcu = function (){
        let x=0;
        let y= evaluate(Equation,{x: x});

        if(y>0 && y!=0){
            while(y>0){
                x--;
                y= evaluate(Equation,{x: x});
            }
        }
        else if(y<0 && y!=0){
            while(y<0){
                x++;
                y= evaluate(Equation,{x: x});
            }
        }

        for(let j=0;j<1+parseInt(precis) ;j++){
            const temp=(1*Math.pow(10, -j));
            if(y>0 && y!=0){
                while(y>0){ 
                    x-=temp;
                    y= evaluate(Equation,{x: x});
                }
            }
            else if(y<0 && y!=0){
                while(y<0){
                    x+=temp;
                    y= evaluate(Equation,{x: x});
                }
            }
        }
    
        setResult(x);
    };

    const inputEquation=function(event){
        setEquation(event.target.value);
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

    
    const handleError = function(event){
        if(event.target.value>-1 && event.target.value<100){
            setError(event.target.value);
        }
    };


    const calculateRoot = function(){
        Calcu();
    };


    //////////////////  https://recharts.org/en-US/

    const TooltipDisplay = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="tooltipDis">
                <p className="label">{`Iteration: ${label}`}</p>
                <p className="intro">{`Value: ${payload[0]?.value || "N/A"}`}</p>
                <p className="intro">{`Error: ${payload[1]?.value || "N/A"}%`}</p>
            </div>
          );
        }
        return null;
      };


    return (
        <Container>
            <div><Link to="/">back</Link></div>
            <br/><br/><br/><br/><br/>
    
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Input f(x)</Form.Label>
                    <input
                        type="text"
                        value={Equation}
                        onChange={inputEquation}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                    />
                </Form.Group>
    
                <Form.Group>

                    <Form.Label>Input Precision</Form.Label>
                    <input type="number" value={precis} onChange={handlePrecis} style={{ width: "20%", margin: "0 auto" }}/>
                    
                    <Form.Label>Input Error</Form.Label>
                    <input type="number" value={e} onChange={handleError} style={{ width: "20%", margin: "0 auto" }}/>
                
                </Form.Group>
    
                <Button variant="dark" onClick={calculateRoot}>
                    Calculate
                </Button>
            </Form>
    
            <br/><br/><br/>

            <h5>Answer = {result.toFixed(precis)}</h5>

            

            <select value={selectedId} onChange={handleSelect}>
                <option value="">Select ID</option>
                {ids.map(id => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
            <button onClick={handleTEST}>Copy</button>
        </Container>
    );
    
}

export default Grapical;
