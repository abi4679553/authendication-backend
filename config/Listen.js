const Listen = async(app)=>{

    try{
     const port = process.env.PORT
     if(!app){
        console.log("app is verified successfully ")
     } 
     if(!port){
        console.log("port is verified successfully")
     } 
     app.listen(process.env.PORT,()=>{
        console.log(`server running on port : ${port}`);
     })  
    }
    catch(err){
        console.log("network error ",err.message)
    }
}
module.exports = Listen;