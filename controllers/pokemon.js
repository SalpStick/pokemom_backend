const validator = require("validator");
const Pokemon = require("../models/pokemon");
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { ERROR_MESSAGES } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, imageUrl, number } = req.body;

  if (!validator.isURL(imageUrl)) {
    return next(new BadRequestError('Not a valid URL'));
  }

  return Pokemon.create({
    name,
    imageUrl,
    number,
  })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const getItem = (req, res, next) => {
  const { itemId } = req.params;

  Pokemon.findById(itemId)
    .orFail(() => new NotFoundError('Item not Found'))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(err.message));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  Pokemon.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err));
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Pokemon.findById(itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      return item.deleteOne().then(() => res.status(200).send({ message: "Item successfully deleted" }));
    })
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  Pokemon.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  Pokemon.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND ));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID ));
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
};
