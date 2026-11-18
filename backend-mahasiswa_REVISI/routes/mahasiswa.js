const router = require('express').Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  list, detail, create, update, remove, restore,
} = require('../controllers/mahasiswa');

router.use(auth);

router.get('/', list);
router.get('/:uuid', detail);
router.post('/', adminOnly, create);
router.patch('/:uuid/restore', adminOnly, restore);
router.patch('/:uuid', adminOnly, update);
router.put('/:uuid', adminOnly, update); // alias lama
router.delete('/:uuid', adminOnly, remove);

module.exports = router;
