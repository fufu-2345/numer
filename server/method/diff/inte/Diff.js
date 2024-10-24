import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
const port =5320;
app.use(cors());

//  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Abc810254795342320121448';

//  https://www.youtube.com/watch?v=G-MWE7_8dnA


// http://localhost:5320/diff?method=diff

const db= mysql.createConnection({  
    host: "localhost",
    user: "root",
    password: "Abc810254795342320121448",
    database: "diff/inte"
})
 
app.get('/', (req, res) => {  
    res.json('this is diff');
});


app.get("/diff", (req,res) =>{
    const a = "SELECT id FROM diff";

    db.query(a,(err,data) =>{

        if(err) return res.json(err);
        const ids = data.map(row => row.id);
        return res.json(ids);
    })
})


app.get("/diff/id", (req,res) =>{
    const selectedId = req.query.selectedId;

    const response = {
        selectedId: selectedId
    };

    const a = `SELECT * FROM diff WHERE id = ?`;
    db.query(a,[selectedId],(err,data) =>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
 

app.listen(port,() => {console.log(`port ${port}(server) is updated/started`)})

