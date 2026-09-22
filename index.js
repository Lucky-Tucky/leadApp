const express = require('express');
const cors = require("cors");
const leadRoutes = require("./controller/leadRoutes");
const notesRoutes = require("./controller/notesRoutes");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/notes", notesRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})