const express = require("express");
const dotenv = require("dotenv");
const cluster = require("cluster");
const os = require("os");
const process = require("process");
const connectDB = require("./config/db");
const likesRoutes = require("./routes/likeRoutes");
const responseTime = require("response-time");
const numCPU = os.cpus().length;
const app = express();

dotenv.config(); // To use .env file
connectDB(); // make a connection with Mongodb
app.use(responseTime());

const port = process.env.PORT || 3000;

// // This will reduce the load of the application by distributing workloads among their application threads
// if (cluster.isPrimary) {
//     console.log(`Primary ${process.pid} is running`);

//     // Fork workers.
//     for (let i = 0; i < numCPU; i++) {
//         cluster.fork();
//     }

//     cluster.on("exit", (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`);
//     });
// } else {


app.listen(port , console.log(`Server started at port ${port} and Worker ${process.pid} started`));
    // Like route
    app.use("/likes", likesRoutes);
// }
