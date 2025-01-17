const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/pokemon");
const { validateId, validateCardBody } = require('../middlewares/validation');

router.get("/", getItems);

router.post("/", createItem);

router.use(auth)

router.delete("/:itemId",  deleteItem);

router.get("/:itemId", getItem);

router.put("/:itemId/likes", validateId,  likeItem);

router.delete("/:itemId/likes", validateId,  dislikeItem);

module.exports = router;
