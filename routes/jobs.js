const express = require('express');
const router = express.Router();

const {getJob,getAllJobs,createJob,updateJob,deleteJob} = require('../controllers/jobs');

router.route('/').post(createJob).get(getAllJobs);
// router.route('/').post(createJob);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;