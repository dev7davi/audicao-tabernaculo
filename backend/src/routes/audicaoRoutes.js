const { Router } = require('express');
const { registerAudicao } = require('../controllers/audicaoController');

const router = Router();

router.post('/', registerAudicao);

module.exports = router;
