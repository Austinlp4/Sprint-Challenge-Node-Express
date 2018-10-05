const express = require('express');
const projects = require('./data/helpers/projectModel');
const actions = require('./data/helpers/actionModel');

const server = express();
server.use(express.json());


const errorHelper = (status, message, res) => {
    res.status(status).json({ error: message });
  };

const strLength = (req, res, next) => {
    console.log(req.body.name.length);
    if(req.body.name || req.body.description){
     if(req.body.name.length > 128){ 
         res.status(400).json({message: 'error'});
    }else if (req.body.description.length > 128){
        res.status(400).json({message: 'error'});
    } else {
    next();
    }
}
};

server.use(strLength);
// PROJECT ENPOINTS ======================

server.get('/projects', (req, res) => {
    projects.get()
      .then(projects => {
          res.json(projects);
      })
});

server.post('/projects', (req, res) => {
    const { name, description } = req.body;
    projects
      .insert({ name, description })
      .then(response => {
          res.json(response);
      })
      .catch(err => console.error(err));
});

server.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
    projects
      .remove(id)
      .then(projectRemoved => {
        if (projectRemoved === 0) {
          return errorHelper(404, 'No Project by that id');
        } else {
          res.json({ success: 'Project Removed' });
        }
      })
      .catch(err => {
        console.error(err)
      });
  });

server.put('/projects/:id', (req, res) => {
const { id } = req.params;
const { name, description } = req.body;
projects
    .update(id, { name, description })
    .then(response => {
    if (response === 0) {
        return errorHelper(404, 'No project by that id');
    } else {
        projects.get(id)
          .then(project => {
            res.json(project);
            });
    }
    })
    .catch(err => {
    console.error(err)
    });
});

// ACTIONS ENDPOINTS =============================

server.get('/actions', (req, res) => {
    actions.get()
      .then(actions => {
          res.json(actions);
      })
});

server.post('/actions', (req, res) => {
    const { project_id, description, notes } = req.body;
    actions
      .insert({ project_id, description, notes })
      .then(response => {
          res.json(response);
      })
      .catch(err => console.error(err));
});

server.delete('/actions/:id', (req, res) => {
    const { id } = req.params;
    actions.remove(id)
      .then(removeAction => {
         console.log(removeAction);
         res.status(200).json(removeAction);
      })
      .catch(err => console.error(err))
    res.send(req.params);
});

server.put('/actions/:id', (req, res) => {
    const { id } = req.params;
    const { description, notes } = req.body;
    actions
        .update(id, { description, notes })
        .then(response => {
        if (response === 0) {
            return errorHelper(404, 'No project by that id');
        } else {
            actions.get(id)
              .then(action => {
                res.json(action);
                });
        }
        })
        .catch(err => {
        console.error(err)
        });
    });

    server.get('/projects/actions/:projectId', (req, res) => {
        const { projectId } = req.params;
        projects
          .getProjectActions(projectId)
          .then(actions => {
              if(actions === 0) {
                return errorHelper(404, 'No actions for the project');
              }
              res.json(actions);
          })
          .catch(err => {
              console.error(err);
          });
    });


const port = 5000;
server.listen(port, () => console.log(`Server listening on ${port}`))