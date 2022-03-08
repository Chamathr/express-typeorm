const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const authJwt = require("../middleware/authJwt");

router.get('/', [authJwt.authenticateToken], [authJwt.authenticateUserRole], userController.allUsers);
router.post('/signup/', userController.addUsers);
router.post('/signin/', userController.signinUsers)
router.put('/:name', [authJwt.authenticateToken], [authJwt.authenticateUserRole], userController.updateUsers);
router.delete('/:name', [authJwt.authenticateToken], [authJwt.authenticateUserRole], userController.deleteUsers);

module.exports = router;
