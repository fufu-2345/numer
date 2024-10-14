import express from "express";
import mysql from "mysql";

const app = express();
const port =5000;

//  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Abc810254795342320121448';

const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Abc810254795342320121448",
    database: "linearAlgebra"
})
 
app.get('/', (req, res) => {  
    res.json('testtt123');
});

app.get("/cramerrule", (req,res) =>{
    const a="SELECT * FROM cramerrule";
    db.query(a,(err,data) =>{
        if(err) return res.json(err);
        return res.json(data);
    })

})
 
app.listen(port,() => {console.log(`port ${port} is updated/started`)})

