const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswa');

router.get('/', siswaController.list);
router.get('/:kode', siswaController.detail);
router.post('/', siswaController.create);
router.put('/:kode', siswaController.update);
router.delete('/:kode', siswaController.remove);

module.exports = router;
