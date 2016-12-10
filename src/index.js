'use strict';
var FamilyFeud = require('./familyFeud');

exports.handler = function (event, context) {
    var familyFeud = new FamilyFeud();
    familyFeud.execute(event, context);
};
