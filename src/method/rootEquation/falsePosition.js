import React, {useState} from 'react';
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../style.css';

const FalsePosition = () => {
    const [data, setData] = useState([{ iteration: 0, Xl: 0, Xm: 0, Xr: 0 ,Error: 0}]);
    const [Equation, setEquation] = useState("(x^4)-13");
    const [X, setX] = useState(0);
    const [XL, setXL] = useState("");
    const [XR, setXR] = useState("");
    const [precis, setPrecis] = useState(7);
    const [e ,setError] = useState(0.000001);
    const [checkboxVal, setCheckboxVal] = useState(Array(2).fill(true));
    let checktext = ["Xm", "Error"];

    const error = function (xold, xnew){
        return Math.abs(    (xnew - xold)    /xnew)       *100;
    };

    const handleCheckbox = (index) => {
        const temp = [...checkboxVal];
        temp[index] = !temp[index];
        setCheckboxVal(temp);
      };

    const Cal = function (xl, xr) {
        let xm, ea;
        let iter = 0;
        const MAX = 50;

        const newData=[];

        do {

            const fXr = evaluate(Equation, { x: xr });
            const fXl = evaluate(Equation, { x: xl });

            xm =   (  (xl*fXr)  -   (xr*fXl)  )      /    (fXr-fXl);
            
            const fXm = evaluate(Equation, { x: xm });

            iter++;
            if (fXm*fXr > 0) {
                ea = error(xr, xm);
                newData.push({iteration: iter,Xl: xl,Xm: xm,Xr: xr,Error: ea});
                xr = xm;
            } else if (fXm*fXr < 0) {
                ea = error(xl, xm);
                newData.push({iteration: iter,Xl: xl,Xm: xm,Xr: xr,Error: ea});
                xl = xm;
            }
        } while (ea>e && iter<MAX);
        
        setData(newData);
        setX(xm);
    };

    const inputEquation = function(event){
        setEquation(event.target.value);
    };
    
    const inputXL = function(event){
        setXL(event.target.value);
    };
    
    const inputXR = function(event){
        setXR(event.target.value);
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
        Cal(parseFloat(XL), parseFloat(XR));
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
            
            <div className="rootGraph">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="iteration" />
                        <YAxis />
                        <Tooltip content={<TooltipDisplay />} />
                        <Legend />
                        

                        {checkboxVal[0] && <Line type="monotone" dataKey="Xm" stroke="#0018f9" />}
                        {checkboxVal[1] && <Line type="monotone" dataKey="Error" stroke="#ff2800" />}

                    </LineChart>
                </ResponsiveContainer>
            </div>

            {Array.from({ length: 2 }, (_, index) => (
                <Form.Group style={{ display: "flex"}}>
                    <div key={index}>
                        <input
                            type="checkbox"
                            checked={checkboxVal[index]}
                            onChange={() => handleCheckbox(index)}
                        />
                    </div>
                    <Form.Label>{checktext[index]}</Form.Label>
                </Form.Group>
            ))}

            <br/><br/><br/>
            
            <br />
            <h5>Answer = {X.toFixed(precis)}</h5>
            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="25%">XL</th>
                            <th width="25%">XM</th>
                            <th width="25%">XR</th>
                            <th width="25%">Error</th>
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
                                    <td className="center">{element.Error.toFixed(precis)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
}

export default FalsePosition;
