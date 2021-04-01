const express = require("express");
const {
  addRelation,
  getRelation,
  getConnection,
  updateRelation,
  deleteRelation,
} = require("../controllers/relation");
const router = express.Router();

router.post("/relation/add", addRelation);
router.post("/relation/update", updateRelation);
router.delete("/relation/delete", deleteRelation);
router.get("/relation", getRelation);
router.post("/connection", getConnection);

module.exports = router;
