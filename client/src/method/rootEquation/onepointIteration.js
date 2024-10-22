import React, {useState,useEffect} from 'react';
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../style.css';
import axios from 'axios';

const OnepointIteration = () => {
    const [data, setData] = useState([{ iteration: 0, Xm: 0 ,Error: 0 }]);
    const [Equation, setEquation] = useState("((x^2)+7)/(x*2)");
    const [X, setX] = useState(0);
    const [Xin, setXin] = useState("");
    const [precis, setPrecis] = useState(7);
    const [e ,setError] = useState(0.000001);
    const [checkboxVal, setCheckboxVal] = useState(Array(2).fill(true));
    let checktext = ["Xm", "Error"];
    const [selectedId, setSelectedId] = useState("");
    const [ids, setIds] = useState([]);


    const handleTEST=function(event){
        axios.get('http://localhost:5030/onepoint/id' ,{
            params: { selectedId }
        })
        .then((response) => {
            console.log("API response:", response.data);

            const fromAPI = response.data.map(function(item) {
                return [item.equation, item.xin];
            });

            console.log("/////////////");

            setEquation(fromAPI[0][0]);
            setXin(fromAPI[0][1]);
            //setMatrix(parseInt(fromAPI[0][0]));
        })
        .catch((error) => {
            console.error('เกิดข้อผิดพลาด:', error); 
        });
    }

    useEffect(() => {
        const fetchIds = async () => {
            try {
                const response = await axios.get('http://localhost:5030/onepoint');
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


    const handleCheckbox = (index) => {
        const temp = [...checkboxVal];
        temp[index] = !temp[index];
        setCheckboxVal(temp);
      };

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
        ea = error(xin, xnew);
        newData.push({iteration: iter,Xm: xnew,Error: ea});

        while(ea>e && iter<MAX){
            
            xold=xnew;
            xnew = evaluate(Equation, { x: xold });
            iter++;

            ea = error(xold, xnew);
            newData.push({iteration: iter,Xm: xnew,Error: ea});
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
        Cal(parseFloat(Xin));
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

            <select value={selectedId} onChange={handleSelect}>
                <option value="">Select ID</option>
                {ids.map(id => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
            <button onClick={handleTEST}>Copy</button>


            <Container>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        
                            <th width="10%">Iteration</th>
                            <th width="25%">X result</th>
                            <th width="25%">Error</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function (element, index) {
                            return (
                                <tr key={index}>
                                    <td className="center">{element.iteration}</td>
                                    <td className="center">{element.Xm.toFixed(precis)}</td>  
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

export default OnepointIteration;
