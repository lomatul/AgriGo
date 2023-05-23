// import express from "express";
// import {deleteUser} from "../controllers/user.controller.js";
// import { verifyToken } from "../middleware/jwt.js";

const express = require("express");
const { deleteUser, getUser } = require("../controllers/user.controller.js");
const { protect:verifyToken } = require("../middleware/auth.js");


const router = express.Router();

router.delete("/:id", verifyToken, deleteUser )
router.get("/:id",  getUser)

module.exports = router;
