const express = require("express");
const router = express.Router(); //Router method use
const controller = require("../controllers/user.controller");
const { varifyTokenFn } = require("../config/jwt");

router.post("/addUser", controller.addUser);
router.put("/varifyUser", controller.varify);
router.post("/login", controller.login);
router.put("/editUser", varifyTokenFn, controller.editUser);
router.delete("/deleteUser", varifyTokenFn, controller.deleteUser);

module.exports = router;
