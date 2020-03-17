/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var globalId = 0;
chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          globalId = res.body._id;
          assert.equal(res.status, 200, 'status must be 200');
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Myself',
        })
        .end(function(error, result) {
          assert.equal(result.status, 200, 'status must be 200');
          assert.equal(result.body.issue_title, 'Title');
          assert.equal(result.body.issue_text, 'text');
          assert.equal(result.body.created_by, 'Myself');
          assert.equal(result.body.assigned_to, '');
          assert.equal(result.body.assigned_to, '');
          done();
        })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          created_by: 'Me'
        })
        .end(function(error, result) {
          assert.equal(result.status, 200, 'status must be 200');
          assert.equal(result.body.message, 'required fields not entered');
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          id: globalId
        })
        .end(function(error, result){
          assert.equal(result.status, 200);
          assert.equal(result.body.message, `could not update id: ${globalId}`, 'message must equal no updated fields sent');
          done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          id: globalId,
          issue_title: 'New Title'
        })
        .end(function(error, result){
          assert.equal(result.status, 200, 'status must be 200');
          assert.equal(result.body.message, 'successfully updated');
          done();
        })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          id: globalId,
          issue_title: 'Another new title',
          issue_text: 'New issue text'
        })
        .end(function(error, result) {
          assert.equal(result.body.message, 'successfully updated');
          assert.equal(result.body.message, 'successfully updated');
          done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200, 'status must be 200');
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title: 'Another new title'
        })
        .end(function(err, res){
          assert.equal(res.body[0].issue_title, 'Another new title');
          assert.equal(res.body[0].issue_text, 'New issue text');
          done();
        })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title: 'Another new title'
        })
        .end(function(err, res){
          assert.equal(res.body[0].issue_title, 'Another new title');
          assert.equal(res.body[0].issue_text, 'New issue text');
          done();
        })
      });
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ })
        .end(function(err, res){
          assert.equal(res.body.message, '_id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: globalId
        })
        .end(function(err, res){
          assert.equal(res.body.message, `deleted ${globalId}`);
          done();
        });
      });
      
    });

});
