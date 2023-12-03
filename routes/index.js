const express = require('express');
const router = express.Router();
const homeController = require('../controller/home_controller');
const projectController = require('../controller/project_controller');
const issueController = require('../controller/issue_controller');

router.get('/', homeController.home);
router.get('/projectForm', projectController.projectForm);
router.get('/issueLogs', issueController.issueLogs);
router.post('/createProject', projectController.createProject);
router.get('/project', projectController.project);
router.post('/createIssue', issueController.createIssue);
router.get('/filterIssues', issueController.filterIssues);
router.get('/searchIssues', issueController.searchIssues);
router.get('/deleteIssue', issueController.deleteIssue);

module.exports = router;