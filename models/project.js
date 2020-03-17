const database  = require('../database.js');
const mongodb = require('mongodb');

class Project {
  
  constructor(
    issue_title,
    issue_text,
    created_by,
    assigned_to = '',
    status_text = ''
  ) {
    this.issue_title = issue_title,
    this.issue_text = issue_text,
    this.created_by = created_by,
    this.assigned_to = assigned_to,
    this.status_text = status_text,
    this.updated_on = null,
    this.open = true
  }
  
  async save() {
    let db = database.getDb();
    let dbResult;
    this.created_on = new Date();
    try {
      dbResult = await db.collection('projects').insertOne(this);
    } catch(err) {
      throw err;
    }
    
    return dbResult;  
  }
  
  async update(idToUpdate) {
    let db = database.getDb();
    let dbResult;
    this.updated_on = new Date();
    let projectKeys = Object.keys(this);
    let updateObj = {};
    
    projectKeys.forEach((key) => {
      if (!!this[key]) {
        if (key != '_id') {
          updateObj[key] = this[key];
        }
      }
    });
    
    try {    
      let objId = mongodb.ObjectId(idToUpdate);
      dbResult = await db.collection('projects').updateOne({
        "_id": objId
      }, { $set: updateObj});
    } catch(err) {
      throw err;
    }
    return dbResult;
  }
  
  static async delete(idToDelete) {
    let db = database.getDb();
    let result;
    try {
      result = await db.collection('projects').deleteOne({ _id: mongodb.ObjectId(idToDelete) })
    } catch(error) {
      throw error;
    }
    
    return result;
  }
  
  static async search(filterData) {
    let db = database.getDb();
    let result;
    try {
      result = await db.collection('projects').find(filterData).toArray();
    } catch(error) {
      throw error;
    }
    
    return result;
  }
  
  isRequiredFieldsEntered() {
    if (!this.issue_title || !this.issue_text || !this.created_by) {
        return false;
    }
    return true;
  }
}

module.exports = Project;