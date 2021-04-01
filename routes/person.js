const express = require("express");
const router = express.Router();

const {
  addPerson,
  getAllPersons,
  updatePerson,
  deletePerson,
} = require("../controllers/person");

router.post("/person/add", addPerson);

router.put("/person/update", updatePerson);
router.delete("/person/delete", deletePerson);

router.get("/person", getAllPersons);

module.exports = router;
