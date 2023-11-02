import express from "express";
import calcRoutes from "./routes/calculate.js";
import storeRoutes from "./routes/storeFile.js";
const app = express();
const port = 6000;

app.use(express.json());

app.use('/calculate', calcRoutes);

app.use('/store-file', storeRoutes)

app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`);
})