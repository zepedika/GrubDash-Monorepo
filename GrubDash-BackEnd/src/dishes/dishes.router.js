const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("./../errors/methodNotAllowed")

router.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed);

router.route("/:dishId")
.get(controller.read)
.put(controller.update)
.all(methodNotAllowed);

module.exports = router;



//add two routes /dishes and /dishes/:dishId and attach the handlers (create, read, update, and list exported from the dishes controller.)