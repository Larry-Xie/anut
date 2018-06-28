#!/usr/bin/env node

'use strict';
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');
var ejs = require('ejs');

var parseTypescript = require('./src/lib/parse-typescript.js');
var util = require('./src/lib/util.js');
var getDirectiveData = require('./src/get-directive-data.js');
var getInjectableData = require('./src/get-injectable-data.js');
var getPipeData = require('./src/get-pipe-data.js');

var argv = yargs.usage('Usage: $0 <angular-typescript-file> [options]')
    .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
    .help('h')
    .argv;

var tsFile = '' + argv._;
var typescript = fs.readFileSync(path.resolve(tsFile), 'utf8');

parseTypescript(typescript).then((tsParsed) => {
    const angularType = util.getAngularType(typescript); // Component, Directive, Injectable, Pipe, or undefined
    if (!angularType) {
        console.error('ERROR: Cannot get the type of this file');
        return;
    }
    const ejsTemplate = util.getEjsTemplate(angularType);
    let ejsData;
    switch (angularType) {
        case 'Component':
        case 'Directive':
            ejsData = getDirectiveData(tsParsed, tsFile, angularType);
            break;
        case 'Injectable':
            ejsData = getInjectableData(tsParsed, tsFile);
            break;
        case 'Pipe':
            ejsData = getPipeData(tsParsed, tsFile);
            break;
        default:
            break;
    }

    const generated = ejs.render(ejsTemplate, ejsData);
    const outFile = tsFile.replace(/\.ts$/, '.spec.ts');
    const outFilePath = path.resolve(outFile);
    fs.writeFileSync(outFilePath, generated);
    console.log('Generated unit test for', argv._[0], 'to', outFile);
}).catch((e) => {
    if (e.message === `Cannot read property '1' of null`) {
        console.error('ERROR: Please make it sure there is no empty constructor or empty block');
    }
    console.error(e.stack);
});