MATCH
  (a:Person),
  (b:Person)
WHERE a.name = "Ayush" AND b.name = "Prem"
CREATE (a)-[r:IS_RELATED_TO {type:'Friend'}]->(b)