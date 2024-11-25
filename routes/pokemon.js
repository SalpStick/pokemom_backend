const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getItems,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/pokemon");
const { validateId } = require('../middlewares/validation');

router.get("/", getItems);

router.use(auth)

router.get("/:itemId", getItem);

router.delete("/:itemId", validateId,  deleteItem);

router.put("/:itemId/likes", validateId,  likeItem);

router.delete("/:itemId/likes", validateId,  dislikeItem);

module.exports = router;
