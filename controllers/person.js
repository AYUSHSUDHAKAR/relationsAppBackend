const graphDB = require("../app");

function formatResponse(resultObj) {
  const result = [];
  if (resultObj.records.length > 0) {
    resultObj.records.map((record) => {
      result.push(record._fields[0]);
    });
  }
  return result;
}

exports.addPerson = async (req, res) => {
  const person = req.body;
  console.log(person.name);

  const query = `CREATE (p:Person{
    name:$name
  }) RETURN p`;
  const params = {
    name: person.name,
  };
  const resultObj = await graphDB.executeCypherQuery(query, params);
  res.json({ name: resultObj });
};

exports.updatePerson = async (req, res) => {
  const person = req.body;
  console.log(person);

  const query = `MATCH (p:Person {name: $oldName})
SET p.name = $name
RETURN p`;
  const params = {
    oldName: person.oldName,
    name: person.name,
  };
  const resultObj = await graphDB.executeCypherQuery(query, params);
  res.json(resultObj);
};

exports.deletePerson = async (req, res) => {
  const person = req.body;
  console.log(person);

  const query = `MATCH (m:Person {name: $name})
DELETE m`;
  const params = {
    nam: person.name,
  };
  const resultObj = await graphDB.executeCypherQuery(query, params);
  res.json(resultObj);
};

exports.getAllPersons = async (req, res) => {
  const query = `MATCH (n:Person) RETURN n.name LIMIT 25`;
  const params = {};
  const resultObj = await graphDB.executeCypherQuery(query, params);
  // resultObj.records.forEach((record) => {
  //   // res.send(record._fields[0]);
  //   console.log(record._fields[0]);
  // });
  const result = formatResponse(resultObj);
  console.log(resultObj);
  res.send(result);
};
