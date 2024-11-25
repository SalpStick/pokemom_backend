const router = require("express").Router();
const userRouter = require("./users");
const pokemonRouter = require("./pokemon");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require('../errors/NotFoundError');
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");


router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);
router.use("/items", pokemonRouter);


router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
