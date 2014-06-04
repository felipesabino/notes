/**
 * Browserify Mocha Test configuration
 */
/* global sinon:true */
var root = window,
  mocha = root.mocha, // Off static include.
  chai = require("chai"),
  sinon = require("sinon"),
  sinonChai = require("sinon-chai"),
  $ = require("jquery"),
  appConfig = require("../../../app/js/app/config");

// --------------------------------------------------------------------------
// Chai / Sinon / Mocha configuration.
// --------------------------------------------------------------------------
// Exports
root.expect = chai.expect;
root.sinon = sinon;

// Plugins
chai.use(sinonChai);

// Mocha
mocha.setup({
  ui: "bdd",
  bail: false
});

// --------------------------------------------------------------------------
// Test Bootstrap / Includes
// --------------------------------------------------------------------------
// Configuration
appConfig.storeName = "notes-browserify-browser-mocha";

// Add DOM fixture.
$("<div id='fixtures' />")
  .css({ display: "none", visibility: "hidden" })
  .prependTo($("body"));

// The file `spec/deps.js` specifies all test dependencies.
require("./spec/deps");
mocha.run();
