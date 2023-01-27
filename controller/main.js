const express = require('express')

exports.getDashboard = (req,res,next) => {
    res.render('dashboard.ejs')
}


exports.getCardTable = (req,res,next) => {
    res.render('cards.ejs')
}