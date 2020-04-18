const express = require('express');
const projectDB= require('../data/helpers/projectModel.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try{
      const projects= await projectDB.get(req.params.id);
      res.json(projects);
    } catch(err){
      console.log('Error with request:', err);
      next(err);
    }
})

router.get('/:id', validateProjectId(), async (req, res) => {
  try{
    const project= await projectDB.get(req.params.id);
    res.json(project);
  } catch(err){
    console.log('Error with request:', err);
    next(err);
  }
})

router.get('/:id/actions', validateProjectId(), async (req, res) => {
  try{
    const projectAction= await projectDB.getProjectActions(req.params.id);
    res.json(projectAction);
  } catch(err){
    console.log('Error requesting project actions:', err);
    next(err);
  }
})

router.post('/', validateProject(), async (req, res) => {
    try{
        const createdProject= await projectDB.insert(req.body);
        res.status(201).json(createdProject);
    } catch(err){
        console.log('Error creating project:', err);
        next(err);
    }
})

router.put('/:id', validateProject(), validateProjectId(), async (req, res) => {
    try{
        const updatedProject= await projectDB.update(req.params.id, req.body);
        res.json(updatedProject);
    } catch(err){
        console.log('Error updating project:', err);
        next(err);
    }
})

router.delete('/:id', validateProjectId(), async (req, res) => {
    try{
        await projectDB.remove(req.params.id);
        res.status(204).end();
    } catch(err){
        console.log('Error deleting project:', err);
        next(err);
    }
})

// validates project/id exists
function validateProjectId() {
    return async (req, res, next) =>{
      try{
        const projectById= await projectDB.get(req.params.id);
        if(projectById){
          req.project= projectById;
          next();
        } else{
          res.status(404).json({
            request_errorMessage: 'Invalid project id or project does not exist'
          })
        }
      } catch(err){
        console.log(err);
        next(err);
      }
    }
}

// validates if project data is formatted and sent correctly
function validateProject() {
    return (req, res, next) => {
      if(!req.body){
        return res.status(400).json({
          error_message: 'Missing post data',
        })
      } else if(!req.body.name){
        return res.status(400).json({
          error_message: 'Missing required name field',
        })
      } else if(!req.body.description){
        return res.status(400).json({
          error_message: 'Missing required description field',
        })
      } else{
        next();
      }
    }
}

module.exports= router;