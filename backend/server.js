const express = require("express");
const cors = require("cors");

const marketplaceRoutes = require("./routes/marketplaceRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("DECO backend is running");
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});