const express= require('express');

const router= express.Router();

router.get('/', (req, res) => {
    res.send(`<h4 align='center'>Welcome to my server! :)</h4>`);
});
  
module.exports= router;