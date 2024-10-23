import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { evaluate } from 'mathjs';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import '../../style.css';
import axios from 'axios';

const Diff = () => {
    const [Equation, setEquation] = useState("(e^x)");
    const [result, setResult] = useState(0);
    const [precis, setPrecis] = useState(7);
    const [selectedOption, setSelectedOption] = useState(1);
    const [selectedOption2, setSelectedOption2] = useState(1);
    const [x, setX] = useState(parseFloat(2));
    const [h, setH] = useState(parseFloat(0.25));
    const [n, setN] = useState(parseFloat(1));
    let tri1=[];
    let tri2=[];
    let tri3=[];
    const [selectedId, setSelectedId] = useState("");
    const [ids, setIds] = useState([]);


    const handleTEST=function(event){
        axios.get('http://localhost:5320/diff/id' ,{
            params: { selectedId }
        })
        .then((response) => {
            console.log("API response:", response.data);

            const fromAPI = response.data.map(function(item) {
                return [item.equation,item.n,item.x,item.h];
            });

            console.log("/////////////");

            setEquation(fromAPI[0][0]);
            setN(fromAPI[0][1]);
            setX(fromAPI[0][2]);
            setH(fromAPI[0][3]);

        })
        .catch((error) => {
            console.error('เกิดข้อผิดพลาด:', error); 
        });
    }

    useEffect(() => {
        const fetchIds = async () => {
            try {
                const response = await axios.get('http://localhost:5320/diff');
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


    const calcu = function (){
        console.log("//////");
        let temp=0;
        if(selectedOption==1){
            

            /// forward
            if(selectedOption2==1){
                let tempx=x+(h*n);
                let sign=1;
                newtri1(n);
                console.log(tri1);
                for(let i=0;i<parseInt(n)+1;i++){
                    let check=(  evaluate(Equation,{x: tempx-(h*i)})  )*sign*tri1[i];
                    console.log(check);
                    temp+=check;
                    sign*=-1;
                }
                temp/=Math.pow(h, n);
                setResult(temp.toFixed(precis));
            }


            else if(selectedOption2==2){
                let sign=1;
                newtri1(n);
                console.log(tri1);
                for(let i=0;i<parseInt(n)+1;i++){
                    let check=(  evaluate(Equation,{x: x-(h*i)})  )*sign*tri1[i];
                    console.log(check);
                    temp+=check;
                    sign*=-1;
                }
                temp/=Math.pow(h, n);
                setResult(temp.toFixed(precis));   
            }

        
            ///// central
            else if(selectedOption2==3){
                let tempx=x+(h*parseInt((n+1)/2));
                console.log("tempx: "+tempx);
                let sign=1;
                let check;
                newtri1(n);
                console.log("tri: "+tri1);
                for(let i=0;i<parseInt(n)+1;i++){
                    if(i==(parseInt(n)+1)/2 ){
                        tempx-=h;
                        console.log("I: "+i);
                    }

                    if(   (i==1 || i==n-1) && n%2==1 && n>1){
                        check=(  evaluate(Equation,{x: tempx-(h*i)})  )*sign*(tri1[i]-1);
                    }
                    else {
                        check=(  evaluate(Equation,{x: tempx-(h*i)})  )*sign*tri1[i];
                    }
                    console.log(check);
                    temp+=check;
                    sign*=-1;
                }

                console.log(temp);
                if(n%2==1){
                    temp/=(Math.pow(h, n)*2);
                }
                else{
                    temp/=(Math.pow(h, n));
                }
                setResult(temp.toFixed(precis));
            }


        }

        else if(selectedOption==2){


            /// forward
            if(selectedOption2==1){
                let sign=-1;
                let tempx=x+(h*(n+1));
                newtri2(n);
                for(let i=0;i<tri2.length;i++){
                    let check=(  evaluate(Equation,{x: tempx-(h*i)})  )*sign*tri2[i];
                    console.log(check);
                    temp+=check;
                    sign*=-1;
                }
                temp/=Math.pow(h, n);
                setResult(temp.toFixed(precis));
            }


            /// backward
            if(selectedOption2==2){
                let sign=1;
                let tempx=x-(h*(n+1));
                newtri2(n);
                for(let i=0;i<tri2.length;i++){
                    let check=(  evaluate(Equation,{x: tempx+(h*i)})  )*sign*tri2[i];
                    console.log(check);
                    temp+=check;
                    sign*=-1;
                }
                temp/=Math.pow(h, n);
                if(n%2==0){
                    temp*=-1;
                }
                setResult(temp.toFixed(precis));
            }


            /// central
            if(selectedOption2==3){
                newtri3(n);
                let sign=-1;
                console.log(tri3);
                let tempx=parseFloat(x)+(h*  parseInt(tri3.length/2)   );
                for(let i=0;i<parseInt(n)+3;i++){
                    if(  (n+3)/2==i){
                        //console.log("I: "+i);
                        tempx-=h;
                    }
                    let check=(  evaluate(Equation,{x: tempx-(h*i)})  )*sign*tri3[i];
                    sign*=-1;
                    console.log("i "+(tempx-(h*i))+" check "+check);
                    temp+=check;
                }
                //console.log(temp);
                temp/=Math.pow(h,n);
                
                setResult(temp.toFixed(precis));
            }

            
        }
    };

    function newtri1(n){
        let newtri=[1,1];
        
        for(let i=1;i<n;i++){
            let oldtri=newtri;
            newtri=[1];
            for(let j=1;j<i+1;j++){
                newtri.push(oldtri[j-1]+oldtri[j]);
            }
            newtri.push(1);
        }
        tri1=newtri;
    }


    function newtri2(n){
        let a=[];
        let b=[];
        let temp=[];
        newtri1(n);
        a=tri1;

        newtri1(n+1);

        for(let i=0;i<(tri1.length);i++){
            b.push(tri1[i]*(0.5*n));
        }
        
        temp.push(b[0]);
        for(let i=0;i<(tri1.length)-1;i++){
            temp.push(a[i]+b[i+1]);
        }
        tri2=temp;
    }


    function newtri3(n){
        if(n==1){
            tri3=[1/12,8/12,8/12,1/12];
        }
        else if(n==2){
            tri3=[1/12,16/12,30/12,16/12,1/12];
        }
        else if(n==3){
            tri3=[1/8,8/8,13/8,13/8,8/8,1/8];
        }
        else if(n==4){  
            tri3=[1/6,12/6,39/6,56/6,39/6,12/6,1/6];
        }
        else{
            console.log("ERROR");
            setResult("ERROR");
        }
        //console.log(tri3);
    }
    

    const inputX=function(event){
        setX(event.target.value);
    };
    
    const inputH=function(event){
        setH(event.target.value);
    };

    const inputN=function(event){
        if(event.target.value<1){
            setN(parseInt(1));
        }
        else {
            setN(parseInt(event.target.value));
        }
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

    const handleCal = function(){
        calcu();
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleOptionChange2 = (event) => {
        setSelectedOption2(event.target.value);
    };

    const MyComponent = ({ n, equation }) => {
        const primes = "'".repeat(n);
      
        return (
          <div style={{ fontSize: '2em', marginTop: '20px' }}>
            <BlockMath math={`f${primes}(x) = ${equation}`} />
          </div>
        );
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
                    High error
                </label>
                <br/>
                <label>
                    <input
                        type="radio"
                        value="2"
                        checked={selectedOption == '2'}
                        onChange={handleOptionChange}
                    />
                    Low error
                </label>
            </div>


            <div className="selectedOption2">
                <label>
                    <input
                        type="radio"
                        value="1"
                        checked={selectedOption2 == '1'}
                        onChange={handleOptionChange2}
                    />
                    Forward
                </label>
                <br/>
                <label>
                    <input
                        type="radio"
                        value="2"
                        checked={selectedOption2 == '2'}
                        onChange={handleOptionChange2}
                    />
                    Backward
                </label>
                <br/>
                <label>
                    <input
                        type="radio"
                        value="3"
                        checked={selectedOption2 == '3'}
                        onChange={handleOptionChange2}
                    />
                    Central
                </label>
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
                    <Form.Label>Input n</Form.Label>
                    <input
                        type="number"
                        value={n}
                        onChange={inputN}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                        placeholder="Enter value for f(x)" 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Input x</Form.Label>
                    <input
                        type="number"
                        value={x}
                        onChange={inputX}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                        placeholder="Enter value for f(x)" 
                    />
                    <Form.Label>Input h</Form.Label>
                    <input
                        type="number"
                        value={h}
                        onChange={inputH}
                        style={{ width: "20%", margin: "0 auto" }}
                        className="form-control"
                    />
                </Form.Group>
      
                <div style={{ fontSize: '2em', marginTop: '20px' }}>
                    <MyComponent n={n} equation={Equation} />
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

export default Diff;
