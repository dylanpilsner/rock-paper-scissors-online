import * as express from "express";
import * as path from "path";
const app = express();
// const dev = process.env.NODE_ENV == "development";
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log("hola soy express y estoy corriendo en el puerto " + port);
});
