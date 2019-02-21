#!/usr/bin/env node
'use strict';

const Parser = require('../.lib/parser.js');
const doiPrefix = '10.4000';

/**
 * Recognizes the accesses to the platform OpenEdition Journals
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result   = {};
  const path     = parsedUrl.pathname;
  const param    = parsedUrl.query || {};
  const host     = parsedUrl.hostname || '';
  const fileSize = parseInt(ec.size, 10);
  let match;

  // AD : norecordurl=1 ; to exclude
  if ((param.norecordurl))  {
    return result;
  }

  // AD : format to exclude
  var formatsToExclude = ['licence','print','acces','noaccess','citedby','embed','toc','citation','rss','print','rssnumeros','rssdocuments'];
  //console.log(param.format+"**************"+formatsToExclude.indexOf(param.format));
  if ((param.format && (formatsToExclude.indexOf(param.format) == 0))) {
    return result;
  }
  // AD : page param to exclude
  var pageToExclude = ['backend','informations','map','lang','years','lettre','sitemap','reviews'];
  //console.log(param.format+"**************"+formatsToExclude.indexOf(param.format));
  if ((param.page && (pageToExclude.indexOf(param.page) == 0))) {
    return result;
  }
  
// journal'name may contain numbers : [a-z-] changed to [a-z0-9-]	  

  if ((match = /^(\/[a-z0-9-]+)?\/(epub|pdf)\/([0-9]+)$/i.exec(path)) !== null) {

  // AD : no epub on article, only for publication, replace (epub|pdf) by pdf

    // http://socio.revues.org/pdf/1882
    // http://journals.openedition.org/crau/pdf/370

    result.rtype    = 'ARTICLE';
    result.mime     = match[2].toUpperCase();
    result.lodelid  = match[3];
    result.title_id = match[1] ? match[1].substr(1) : host.split('.')[0];
    result.unitid   = `${result.title_id}/${match[3]}`;
    result.doi      = `${doiPrefix}/${result.title_id}.${match[3]}`;

  } else if ((match = /^(\/[a-z0-9-]+)?\/([0-9]+)$/i.exec(path)) !== null) {
    // http://socio.revues.org/1877
    // http://journals.openedition.org/socio/3061
	// http://journals.openedition.org/vertigo/3515?file=1

    // if the size is less than 10ko, it's unlikely to be an article
	// AD : if file=1 in query params, it's likely a pdf file
    if (!fileSize || fileSize > 10000) {
      result.rtype    = 'ARTICLE';
	  if (param.file && (param.file=='1')) { result.mime     = 'PDF'; } else { result.mime     = 'HTML'; }
      result.lodelid  = match[2];
      result.title_id = match[1] ? match[1].substr(1) : host.split('.')[0];
      result.unitid   = `${result.title_id}/${match[2]}`;
      result.doi      = `${doiPrefix}/${result.title_id}.${match[2]}`;
    }
  }

  return result;
});

