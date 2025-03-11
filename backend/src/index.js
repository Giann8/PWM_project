MONGO_URI=process.env.MONGO_URI;

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/',(req,res)=>{
res.send('Hello World');
})



app.listen(3001,()=>{
    console.log('Server up and running, listening on port 3001');
})