const express = require('express');
const router = express.Router();
const {getAllUsers, registerUser, loginUser } = require('../controllers/user_controller');

router.get('/get', getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
