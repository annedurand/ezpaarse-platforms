#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
// this parser is adapted from parser of bioone

'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  //var param  = parsedUrl.query || {};
  var path   = parsedUrl.pathname;
  var info;
  var match;

  if ((match = /\/([a-zA-Z]+)$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/dna
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /\/toc\/(([a-zA-Z]+)\/([0-9\.]+)\/([^\/]+))$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/toc/dna/32/1
    result.rtype = 'TOC';
    result.mime  = 'MISC';
    result.vol = match[3];
    result.issue = match[4];
    result.title_id = match[2];
    result.unitid = match[1];
  } else if ((match = /\/doi\/abs\/([0-9\.]+\/([^\/\.]+)\.[^\/]+)$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/abs/10.1089/dna.2012.1776
    info = match[1].split('.');
    result.rtype = 'ABS';
    result.mime  = 'MISC';
    result.title_id = match[2];
    result.unitid = result.doi = match[1];
    result.publication_date = info[2];
  } else if ((match = /\/doi\/full\/(([0-9\.]+)\/(([^\.]+).[^\.]+.[^\.]+))$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/full/10.1089/dna.2012.1776
      info = match[1].split('.');
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    result.title_id = match[4];
    result.unitid = result.doi = match[1];
     result.publication_date = info[2];
  } else if ((match = /\/doi\/pdf(plus)?\/(([0-9\.]+)\/([^\/\(\.)]+)\.[^\/)]+)$/.exec(path)) !== null) {
    // http://online.liebertpub.com.gate1.inist.fr/doi/pdf/10.1089/dna.2012.1776
    // http://online.liebertpub.com.gate1.inist.fr/doi/pdfplus/10.1089/dna.2012.1776
     info = match[2].split('.');
    result.rtype = 'ARTICLE';

    result.mime  = 'PDF';
     if ( match[1] === 'plus') {
      result.mime  = 'PDFPLUS';
     }
    result.title_id = match[4];
    result.unitid =result.doi = match[2];
    if (!isNaN(info[2])) {
     result.publication_date = info[2];
    } else {
      result.publication_date = info[3];
    }
  }
  return result;
});

