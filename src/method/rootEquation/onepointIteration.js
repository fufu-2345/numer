import React, {useState} from 'react';
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../style.css';

const OnepointIteration = () => {
    const [data, setData] = useState([{ iteration: 0, xnew: 0 }]);
    const [Equation, setEquation] = useState("((x^2)+7)/(x*2)");
    const [X, setX] = useState(0);
    const [Xin, setXin] = useState("");
    const [precis, setPrecis] = useState(7);
    const [e ,setError] = useState(0.000001);

    const error = function (xold, xnew){
        return Math.abs(    (xnew - xold)    /xnew)       *100;
    };

    const Cal = function(xin){
        let xnew,xold,ea;
        let iter = 0;
        const MAX = 50;

        const newData=[];

        xnew= evaluate(Equation,{x: xin});
        iter++;
        newData.push({iteration: iter,xnew: xnew});
        ea = error(xin, xnew);

        while(ea>e && iter<MAX){
            
            xold=xnew;
            xnew = evaluate(Equation, { x: xold });
            iter++;

            ea = error(xold, xnew);
            newData.push({iteration: iter,xnew: xnew});
        }

        console.log(newData);
        
        setData(newData);
        setX(xnew);
    };

    const inputEquation = function(event){
        setEquation(event.target.value);
    };
    
    const inputXin = function(event){
        setXin(event.target.value);
    };

    const handlePrecis = function(event){
        if(event.target.value>-1 && event.target.value<100){
            setPrecis(event.target.value);
        }
    };

    
    const handleError = function(event){
        if(event.target.value>-1 && event.target.value<100){
            setError(event.target.value);
        }
    };


    const calculateRoot = function(){
        Cal(parseFloat(Xin));
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
                        id="equation"
                        value={Equation}
                        onChange={inputEquation}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                    />
                    <Form.Label>Input Xin</Form.Label>
                    <input
                        type="number"
                        id="Xin"
                        value={Xin}
                        onChange={inputXin}
                        style={{ width: "20%", margin: "0 auto" }}
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
            <br/><br/>
            
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="iteration" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="xnew" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>

            <br/><br/><br/>
            
            <br />
            <h5>Answer = {X.toFixed(precis)}</h5>
            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        
                            <th width="10%">Iteration</th>
                            <th width="30%">X result</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function (element, index) {
                            return (
                                <tr key={index}>
                                    <td className="center">{element.iteration}</td>
                                    <td className="center">{element.xnew.toFixed(precis)}</td>  

                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
}

export default OnepointIteration;
