const path = require('path')
const express = require('express');

const mainController = require('../controller/main.js')

const router = express.Router()

router.get('/',mainController.getDashboard)

router.get('/IDcards',mainController.getCardTable)

module.exports = router