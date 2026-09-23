require("dotenv").config();
const express = require('express');
const cors = require("cors");
const leadRoutes = require("./controller/leadRoutes");
const notesRoutes = require("./controller/notesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/notes", notesRoutes);

const port = process.env.PORT || 3636;
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// Required for Vercel
module.exports = app;