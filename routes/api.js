'use strict';

var expect       = require('chai').expect;
var MongoClient  = require('mongodb');
var ObjectId     = require('mongodb').ObjectID;
const Project    = require('../models/project.js');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){ 
      Project.search(req.query)
      .then(result => {
        res.send(result)
      })
      .catch(error => {
        throw error;
      })
    })
    
    .post(function (req, res){
      let project = new Project(
        req.body.issue_title,
        req.body.issue_text,
        req.body.created_by,
        req.body.assigned_to,
        req.body.status_text,
      );
      if (!project.isRequiredFieldsEntered()) {
        res.json({
          message: 'required fields not entered'
        });
        return;
      }
      project.save()
      .then(result => {
        let insertedProj = result.ops[0];
        res.json({
          ...insertedProj
        });
      })
      .catch(error => {
        console.error(error);
        throw error;
      })
    })
    
    .put(function (req, res){
      let project = new Project(
        req.body.issue_title,
        req.body.issue_text,
        req.body.created_by,
        req.body.assigned_to,
        req.body.status_text
      );
      

      if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && 
          !req.body.assigned_to && !req.body.status_text) {
        return res.send({
          message: `could not update id: ${req.body.id}`
        });
      }
    
      project.update(req.body.id)
      .then(result => {
        if (result.result.n > 0) {
          return res.json({
            message: 'successfully updated'
          });
        }
      })
      .catch(error => {
        res.json({
          message: `could not update ${req.body.id}`
        })
      })
    })
    
    .delete(function (req, res){
      Project.delete(req.body._id)
      .then(result => {
        if (result.result.n > 0) {
          return res.send({
            message: `deleted ${req.body._id}`
          })
        }
        return res.send({
          message: `_id error`
        })
      })
      .catch(error => {
        throw error;
      })
    });
};