const graphDB = require("../app");

function formatResponse(resultObj) {
  const result = [];

  if (resultObj.records.length > 0) {
    resultObj.records.map((record) => {
      // obj.start = record._fields[0].start;
      // obj.end = record._fields[0].end;
      // obj.relation = record._fields[0].relation;
      record._fields[0].segments.map((segment) => {
        const obj = {
          start: "",
          end: "",
          relation: "",
        };
        obj.start = segment.start.properties.name;
        obj.end = segment.end.properties.name;
        obj.relation = segment.relationship.properties.type;
        result.push(obj);
      });

      // result.push(record._fields[0].segments);
    });
  }
  return result;
}

function formatResponseGetRelations(resultObj) {
  const result = [];
  if (resultObj.records.length > 0) {
    resultObj.records.map((record) => {
      const obj = {
        start: "",
        end: "",
        relation: "",
      };
      obj.start = record._fields[0];
      obj.end = record._fields[1];
      obj.relation = record._fields[2];
      result.push(obj);
    });
  }
  return result;
}

exports.addRelation = async (req, res) => {
  const relation = req.body;
  const query = `MATCH
  (a:Person),
  (b:Person)
WHERE a.name = $name1 AND b.name = $name2
CREATE (a)-[r:IS_RELATED_TO {type:$relation}]->(b)`;
  const params = {
    name1: relation.person,
    name2: relation.relatedTo,
    relation: relation.relation,
  };
  const resultObj = await graphDB.executeCypherQuery(query, params);
  res.json(resultObj);
};

exports.getRelation = async (req, res) => {
  // const relation = req.body;
  const query = `MATCH (A:Person)-[R:IS_RELATED_TO]->(B:Person)
RETURN A.name,B.name,R.type`;
  const params = {};
  const resultObj = await graphDB.executeCypherQuery(query, params);
  const result = formatResponseGetRelations(resultObj);

  res.json(result);
};

exports.getConnection = async (req, res) => {
  const relation = req.body;
  console.log(relation);
  const query = `MATCH
  (A:Person {name: $name1}),
  (B:Person {name: $name2}),
  p = shortestPath((A)-[*..15]-(B))
RETURN p`;
  const params = {
    name1: relation.person,
    name2: relation.connectedTo,
  };
  const resultObj = await graphDB.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);

  res.send(result);
  console.log(result);
};

exports.updateRelation = async (req, res) => {
  const relation = req.body;
  console.log(relation);
  const query = `MATCH (:Person {name: $name1})-[rel:IS_RELATED_TO]-(:Person {name: $name2})
SET rel.type = $relation
RETURN rel`;
  const params = {
    name1: relation.person,
    name2: relation.relatedTo,
    relation: relation.relation,
  };
  const resultObj = await graphDB.executeCypherQuery(query, params);
  // const result = formatResponse(resultObj);

  res.send(resultObj);
  // console.log(result);
};

exports.deleteRelation = async (req, res) => {
  const relation = req.body;
  console.log(relation);
  const query = `MATCH (j:Person {name: $name1})-[r:IS_RELATED_TO]->(m:Person {name: $name2})
DELETE r`;
  const params = {
    name1: relation.person,
    name2: relation.relatedTo,
    relation: relation.relation,
  };
  const resultObj = await graphDB.executeCypherQuery(query, params);
  // const result = formatResponse(resultObj);

  res.send(resultObj);
  // console.log(result);
};
