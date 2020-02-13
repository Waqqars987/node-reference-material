const router = require('express').Router();

const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        posts:
        {
            title: 'my first post',
            description: 'some random data'
        }
    });
});

module.exports = router;