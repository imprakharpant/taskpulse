const { Router } = require('express');
const taskController = require('../controllers/task.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdParamSchema
} = require('../validators/task.schema');

const router = Router();

// All task routes require authentication
router.use(authenticate);

router
  .route('/')
  .get(validate(taskQuerySchema, 'query'), taskController.getTasks)
  .post(validate(createTaskSchema, 'body'), taskController.createTask);

router
  .route('/:id')
  .get(validate(taskIdParamSchema, 'params'), taskController.getTaskById)
  .put(
    validate(taskIdParamSchema, 'params'),
    validate(updateTaskSchema, 'body'),
    taskController.updateTask
  )
  .delete(validate(taskIdParamSchema, 'params'), taskController.deleteTask);

module.exports = router;
