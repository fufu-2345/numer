import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
const port =5000;
app.use(cors());

//  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Abc810254795342320121448';

//  https://www.youtube.com/watch?v=G-MWE7_8dnA


// http://localhost:5320/diff?method=diff
 
app.get('/', (req, res) => {  
    res.json('11111111');
});


app.get("/getTableid", (req,res) =>{
    const tableName = req.query.tableName;
    const getShema = req.query.getShema;

    const db= mysql.createConnection({  
        host: "localhost",
        user: "root",
        password: "Abc810254795342320121448",
        database: `${getShema}`
    })

    const a = `SELECT id FROM ${tableName}`;
    db.query(a,(err,data) =>{

        if(err) return res.json(err);
        const ids = data.map(row => row.id);
        return res.json(ids);
    })
})


app.get("/getData", (req,res) =>{
    const selectedId = req.query.selectedId;
    const tableName = req.query.tableName;
    const getShema = req.query.getShema;

    const db= mysql.createConnection({  
        host: "localhost",
        user: "root",
        password: "Abc810254795342320121448",
        database: `${getShema}`
    })

    const response = {
        selectedId: selectedId
    };
    

    const a = `SELECT * FROM ${tableName} WHERE id = ?`;
    db.query(a,[selectedId],(err,data) =>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
 

app.listen(port,() => {console.log(`port ${port}(server) is updated/started`)})

