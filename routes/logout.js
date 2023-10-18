const express = require("express");

const router = express.Router();

router.post('/logout', async (req, res, next) => {
    req.session.destroy((err) => {
        // console.log(err);
        return res.redirect('/');
    });
})

module.exports = router;