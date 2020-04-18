const express = require('express');
const actionDB= require('../data/helpers/actionModel.js');
const projectDB= require('../data/helpers/projectModel.js');

const router = express.Router();

router.get('/actions', async (req, res) =>{
    try{
        const actions= await actionDB.get(req.params.id);
        res.json(actions);
    } catch(err){
        console.log('Error getting actions:', err);
        next(err);
    }
})

router.get('/actions/:id', validateActionId(), async (req, res) =>{
    try{
        const action= await actionDB.get(req.params.id);
        res.json(action);
    } catch(err){
        console.log('Error getting actions:', err);
        next(err);
    }
})

router.post('/projects/:id/actions', validateAction(), validateProjectId(), async (req, res) =>{
    try{
        const newAction= await actionDB.insert({
            project_id: req.params.id,
            description: req.body.description,
            notes: req.body.notes
        });
        res.status(201).json(newAction);
    } catch(err){
        console.log('Error creating action:', err);
        next(err);
    }
})

router.put('/projects/:id/actions/:actionsid', validateAction(), validateProjectId(), validateActionId(), async (req, res) =>{
    try{
        const updatedAction= await actionDB.update(req.params.id, req.body);
        res.json(updatedAction);
    } catch(err){
        console.log('Error updating action:', err);
        next(err);
    }
})

router.delete('/projects/:id/actions/:actionsid', validateProjectId(), validateActionId(), async (req, res) =>{
    try{
        await actionDB.remove(req.params.id);
        res.status(204).end();
    } catch(err){
        console.log('Error deleting action:', err);
        next(err);
    }
})


// validates if action data is formatted and sent correctly
function validateAction() {
    return (req, res, next) => {
      if(!req.body){
        return res.status(400).json({
          error_message: 'Missing action data',
        })
      } else if(!req.body.notes){
        return res.status(400).json({
          error_message: 'Missing required notes field',
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

// validate action/id exist
function validateActionId() {
    return async (req, res, next) =>{
      try{
        const actionById= await actionDB.get(req.params.id);
        if(actionById){
          req.action= actionById;
          next();
        } else{
          res.status(404).json({
            request_errorMessage: 'Invalid action id or action does not exist'
          })
        }
      } catch(err){
        console.log(err);
        next(err);
      }
    }
}


module.exports= router;