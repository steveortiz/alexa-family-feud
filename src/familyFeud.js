'use strict';
var AlexaSkill = require('./AlexaSkill'),
    eventHandlers = require('./eventHandlers'),
    intentHandlers = require('./intentHandlers');

var APP_ID = "amzn1.ask.skill.c59eb5dd-8149-42d2-a0d0-8f4c509dfe81";
var skillContext = {};

var FamilyFeud = function(){
  AlexaSkill.call(this, APP_ID);
  skillContext.needMoreHelp = true;
};

// Extend AlexaSkill
FamilyFeud.prototype = Object.create(AlexaSkill.prototype);
FamilyFeud.prototype.constructor = FamilyFeud;

eventHandlers.register(FamilyFeud.prototype.eventHandlers, skillContext);
intentHandlers.register(FamilyFeud.prototype.intentHandlers, skillContext);

module.exports = FamilyFeud;
