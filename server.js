const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.render("index", {
    title: "VLS Login",
    userCount: 178,
    totalCount: 830,
  });
});

app.get("/token", (req, res) => {
  res.render("token", {
    title: "Aide - Obtenir votre token",
  });
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page non trouvée",
  });
});

app.listen(PORT, () => {
  const timestamp = new Date().toLocaleTimeString("fr-FR");
  console.log(`[${timestamp}] Serveur => http://localhost:${PORT}`);
});
