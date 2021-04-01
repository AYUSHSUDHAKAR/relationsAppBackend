var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var neo4j = require("neo4j-driver");

var app = express();

//Routes
const personRoutes = require("./routes/person");
const relationRoutes = require("./routes/relation");

//DB connection
const driver = neo4j.driver(
  "bolt://107.23.71.192:7687",
  neo4j.auth.basic("neo4j", "intents-memorandum-property"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);



//View Engine
app.set("Views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/api", personRoutes);
app.use("/api", relationRoutes);

// const query = `
//   MATCH (n)
//   RETURN COUNT(n) AS count
//   LIMIT $limit
//   `;

// const params = { limit: 10 };

exports.executeCypherQuery = async (statement, params = {}) => {
  const session = driver.session({ database: "neo4j" });
  try {
    const result = await session.run(statement, params);

    // console.log(result);
    session.close();
    return result;
  } catch (error) {
    throw error; // we are logging this error at the time of calling this method
  }
};

const query = `MATCH (n:Person) RETURN n.name LIMIT 25`;

app.get("/", function (req, res) {
  session
    .run(query, (params = {}))
    .then((result) => {
      result.records.forEach((record) => {
        res.send(record._fields[0]);
        console.log(record._fields[0]);
      });
      session.close();
      driver.close();
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(3000);
console.log("Server Started on Port 3000");

// module.exports = { executeCypherQuery };
