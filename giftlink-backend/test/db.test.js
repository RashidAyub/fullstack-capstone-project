const chai = require('chai');
const expect = chai.expect;
const connectToDatabase = require('../models/db');

describe('Database connection module', () => {
  it('should export a function', () => {
    expect(connectToDatabase).to.be.a('function');
  });
});
