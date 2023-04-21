const app=require('./app');
const dotenv=require('dotenv');
const connectDatabase=require('./config/database');
const cors = require('cors');
// app.use(cors())
// const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
});
//Config
dotenv.config({path:"backend/config/config.env"})
connectDatabase();
app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})
//Unhandled Promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })

})
