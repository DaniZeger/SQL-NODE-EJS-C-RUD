const express = require("express");
const app = express();
const mysql = require("mysql");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { join } = require("path");
app.set("views", join(__dirname, "views"));
app.set("view engien", "ejs");

const port = 3000;

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "animal_shop",
});

let connectionFunc = (query) => {
  connection.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
  });
};

// Delete product
app.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  let query = `DELETE FROM products
  WHERE \`id\` = ${id};`;

  connection.query(query, (err, resulte) => {
    if (err) console.log(err);
    console.log(resulte);
  });
  res.redirect("/products");
});

//Update navegeation
app.get("/update/:id", async (req, res) => {
  let id = req.params.id;
  let query = `SELECT * FROM products
  WHERE \`id\` = ${id}
  `;
  connection.query(query, (err, resulte) => {
    if (err) console.log(err);

    res.render("updateProduct.ejs", { resulte });
  });
});

// Update product
app.post("/update/:id", (req, res) => {
  let id = req.params.id;
  let { title, animal, category, description, price, image } = req.body;
  let query = `UPDATE products
  SET \`title\` = "${title}", \`animal\` = "${animal}", \`category\` = "${category}", \`description\` = "${description}", \`price\` = ${price}, \`image\` = "${image}"
  WHERE \`id\` = ${id};`;

  connection.query(query, (err, resulte) => {
    if (err) console.log(err);
    console.log(resulte);
  });
  res.redirect("/products");
});

// Insert product
app.post("/addProduct", (req, res) => {
  let { title, animal, category, description, price, image } = req.body;
  let query = `INSERT INTO products (\`title\`, \`animal\`, \`category\`, \`description\`, \`price\`, \`image\`)
  VALUES ('${title}','${animal}','${category}','${description}',${price},'${image}');`;

  connectionFunc(query);
  res.redirect("/products");
});

// Render addProduct.ejs (Add Products page)
app.get("/addProduct", (req, res) => {
  res.render("addProduct.ejs");
});

// Render index.ejs (Products page)
app.get("/products", async (req, res) => {
  let query = `SELECT * FROM products`;
  await connection.query(query, (err, resulte) => {
    if (err) console.log(err);

    res.render("index.ejs", { resulte });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
