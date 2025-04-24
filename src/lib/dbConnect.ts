import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number // ? use to say it is optional
}

const connection: ConnectionObject = {}

async function dbConnect() : Promise<void> { // here in typescript null means i doesn't care about which type of data come, and other language void means blank

    if (connection.isConnected){
        // next follow on demand request (means here code run when user request, assume a user request and after it a new user also request than we chuck the program by demand multiple db request , so check is connected than don't try again), next run each request but other hand complete server deticated code run continuouly whan it start thsn this type of application well know db connected or not like express
        // This code ensures that the database connection is established only on demand. 
        // If a user requests a connection and another user makes a request afterward, 
        // the program checks if the database is already connected to avoid multiple redundant connection attempts. 
        // For applications like Express, which run continuously, this approach ensures that the server knows 
        // whether the database is connected or not before processing further requests.
        console.log("Aleady connected to database");
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        console.log("db : ",db);
        console.log("db.connections : ",db.connections);
        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully.");
    } catch (error) {
        console.log("Database connection failed, due to: ",error);
        process.exit();
    }
}

export default dbConnect;