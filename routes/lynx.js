const express = require('express');
const sqlite = require('../services/sqlite.services')
const router = express.Router();
/* GET users listing. */
router.get('/askpair', async function (req, res, next) {
    try {
        const ask_pair = await sqlite.getRequestToPair()
        console.log(ask_pair);
        res.json(ask_pair);
    } catch (error) {
        console.log(`Cannot get devives pair`, error);
        const errorResponse = {
            status: 'error',
            message: 'Cannot get devices pair',
            error: error
        }
        res.status(500).json(errorResponse)
    }
});
router.post('/askpair', async function (req, res, next) {
    try {
        const data ={
            device_id: req.body.device_id,
            response: req.body.response
        }
        const updateResponse = await sqlite.updateResponse(data)
        res.json(data);
    } catch (error) {
        console.log(`Cannot call back ask pair path`, error);
        const errorResponse = {
            status: 'error',
            message: 'Cannot call back ask pair path',
            error: error
        }
        res.status(500).json(errorResponse)
    }
});
router.get('/data', async function (req, res, next) {
    try {
        const device = await sqlite.getDataFromDevice()
        console.log(device);
        res.json(device);
    } catch (error) {
        console.log(`Cannot get devives pair`, error);
        const errorResponse = {
            status: 'error',
            message: 'Cannot get devices pair',
            error: error
        }
        res.status(500).json(errorResponse)
    }
});

module.exports = router;
