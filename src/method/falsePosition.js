import React, {useState,} from 'react';
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../style.css';

const falsePosition = () => {
    const [data, setData] = useState([]);
    const [Equation, setEquation] = useState("(x^4)-13");
    const [X, setX] = useState(0);
    const [XL, setXL] = useState(0);
    const [XR, setXR] = useState(0);
    const [precis, setPrecis] = useState(7);

    const error = function (xold, xnew) {
        return Math.abs((xnew - xold) / xnew) * 100;
    };

    const Calbisection = function (xl, xr) {
        let xm, fXm, fXr, ea;
        let iter = 0;
        const MAX = 50;
        const e = 0.00001;

        const newData=[];

        do {
            xm = (xl + xr) / 2.0;

            const fXr = evaluate(Equation, { x: xr });
            const fXm = evaluate(Equation, { x: xm });

            iter++;
            if (fXm * fXr > 0) {
                ea = error(xr, xm);
                newData.push({iteration: iter,Xl: xl,Xm: xm,Xr: xr});
                xr = xm;
            } else if (fXm * fXr < 0) {
                ea = error(xl, xm);
                newData.push({iteration: iter,Xl: xl,Xm: xm,Xr: xr});
                xl = xm;
            }
        } while (ea > e && iter < MAX);
        
        setData(newData);
        setX(xm);
    };

    const inputEquation = function (event) {
        setEquation(event.target.value);
    };
    
    const inputXL = function (event) {
        setXL(event.target.value);
    };
    
    const inputXR = function (event) {
        setXR(event.target.value);
    };

    const handlePrecis = function (event) {
        if(event.target.value>-1 && event.target.value<100){
            setPrecis(event.target.value);
        }
    };


    const calculateRoot = function () {
        const xlnum = parseFloat(XL);
        const xrnum = parseFloat(XR);
        Calbisection(xlnum, xrnum);
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
                    <Form.Label>Input XL</Form.Label>
                    <input
                        type="number"
                        id="XL"
                        value={XL}
                        onChange={inputXL}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                    />
                    <Form.Label>Input XR</Form.Label>
                    <input
                        type="number"
                        id="XR"
                        value={XR}
                        onChange={inputXR}
                        style={{ width: "20%", margin: "0 auto" }}
                    />
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
                    <Line type="monotone" dataKey="Xm" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>

            <br/><br/><br/>
            
            <div>
            <Form.Label>Input Precision</Form.Label>
                <input type="number" value={precis} onChange={handlePrecis} style={{ width: "20%", margin: "0 auto" }}/>
            </div>
            
            <br />
            <h5>Answer = {X.toFixed(precis)}</h5>
            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">XL</th>
                            <th width="30%">XM</th>
                            <th width="30%">XR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function (element, index) {
                            return (
                                <tr key={index}>
                                    <td className="center">{element.iteration}</td>
                                    <td className="center">{element.Xl.toFixed(precis)}</td>
                                    <td className="center">{element.Xm.toFixed(precis)}</td>
                                    <td className="center">{element.Xr.toFixed(precis)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
}

export default falsePosition;



