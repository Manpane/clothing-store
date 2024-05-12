const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index.route");
const { createSuperAdmin } = require("./controllers/auth/superadmin.init");

const corsOptions = {
  origin: [
      'http://localhost:5501',
      'http://localhost:5500',
      'http://127.0.0.1:5501',
      'http://127.0.0.1:5500',
      'http://0.0.0.0:5501',
      'http://0.0.0.0:5500',
      'http://localhost:5502',
      'http://127.0.0.1:5502',
      'http://0.0.0.0:5502',
  ],
  credentials: true,
};


const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors(corsOptions));


app.use(express.json());

createSuperAdmin();

app.use("/api", mainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: "Internal server error", message: err.message });  
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
