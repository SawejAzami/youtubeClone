
import {app} from "./app.js"
import dotenv from "dotenv"
import connectionDB from "./db/index.js"
dotenv.config({
  path:'./env'
})



connectionDB()
.then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log("server is running")
  })
})
.catch((error)=>{
  console.log("mongo db connecion fail")
})

