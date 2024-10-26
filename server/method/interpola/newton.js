import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
const port =5200;
app.use(cors());

//  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Abc810254795342320121448';

//  https://www.youtube.com/watch?v=G-MWE7_8dnA


const db= mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "Abc810254795342320121448",
    database: "interpola"
})
 
app.get('/', (req, res) => {  
    res.json('this is newton');
});


app.get("/newton", (req,res) =>{
    const a = "SELECT id FROM newton";

    db.query(a,(err,data) =>{

        if(err) return res.json(err);
        const ids = data.map(row => row.id);
        return res.json(ids);
    })
})


app.get("/newton/id", (req,res) =>{
    const selectedId = req.query.selectedId;

    const response = {
        selectedId: selectedId
    };

    //
    const a = `SELECT * FROM newton WHERE id = ?`;
    db.query(a,[selectedId],(err,data) =>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
 

app.listen(port,() => {console.log(`port ${port}(server) is updated/started`)})

