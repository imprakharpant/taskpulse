const { Router } = require('express');
const projectController = require('../controllers/project.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
  projectIdParamSchema
} = require('../validators/project.schema');

const router = Router();

// All project routes require authentication
router.use(authenticate);

router
  .route('/')
  .get(validate(projectQuerySchema, 'query'), projectController.getProjects)
  .post(validate(createProjectSchema, 'body'), projectController.createProject);

router
  .route('/:id')
  .get(validate(projectIdParamSchema, 'params'), projectController.getProjectById)
  .put(
    validate(projectIdParamSchema, 'params'),
    validate(updateProjectSchema, 'body'),
    projectController.updateProject
  )
  .delete(validate(projectIdParamSchema, 'params'), projectController.deleteProject);

module.exports = router;
