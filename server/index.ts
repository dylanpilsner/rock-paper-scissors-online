import * as express from "express";
const app = express();
// const dev = process.env.NODE_ENV == "development";
const port = 3000;

app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log("hola soy express y estoy corriendo en el puerto " + port);
});
