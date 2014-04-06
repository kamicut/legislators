var csv = require('csv-stream');
var request = require('request');

module.exports = (function() {
	'use strict';
	var baseUrl = 'https://docs.google.com/spreadsheet/tq?' +
	'key=0Aqv3NjQVGHDbdGZNTXFiWlg4ZFFSdDhiSXU1d25MU1E&pub=1&tqx=out:csv';

	var categoryDict = {
		'first_name': 'A',
		'first_name_ar': 'B',
		'last_name': 'C',
		'last_name_ar': 'D',
		'gender': 'E',
		'gender_ar': 'F',
		'district': 'K',
		'party': 'O',
		'party_ar': 'P',
		'sect': 'Q',
		'born_day': 'R',
		'born_month': 'S',
		'born_year': 'T',
		'other_notes': 'V'
	};
	var booleanDict = {
		'email': 'J',
		'phone': 'G',
		'fax': 'H',
		'mobile': 'I',
		'facebook': 'L',
		'twitter': 'M',
		'website': 'U',
	};
	var setDict = {
		'deputies_terms': 'N',
	};

	function buildResponse(paramString, callback) {
		var res = [];
		var options = {enclosedChar: '"'};
		var csvStream = csv.createStream(options);
		var sane = true;
		request(baseUrl + paramString)
		.pipe(csvStream)
		.on('data', function(data) {
			for (var k in data) {
				sane = sane && (k !== 'undefined');
			}
			res.push(data);
		})
		.on('end', function() {
			if (sane) {
				callback(null, res);
			} else {
				callback(new Error('Some or all of your parameters could not be processed.'), null);
			}
		});
	}
	return {

		search:function (params, callback) {
			var paramString = '&tq=where%20';
			var numParams = 0;

			//Create the Query 
			for (var k in params) {
				var kv = '';
				if (k in categoryDict) {
					kv = categoryDict[k] + '=%27' + params[k] +'%27%20';
				}
				if (k in booleanDict && params[k] === 'true') {
					if (params[k] === 'true') {
						kv = booleanDict[k] +'!=""%20';
					} else if (params[k] === 'false') {
						kv = booleanDict[k] +'=""%20';
					} else {
						callback(new Error('Some or all of your parameters could not be processed.'), null);
					}
				}
				if (k in setDict) {
					kv = setDict[k]+'%20contains%20%27' + params[k] + '%27%20';
				}
				paramString += (numParams > 0)? 'and%20' + kv: kv;
				numParams += 1;
			}

			//Create the JSON Object
			if (numParams == 0) {
				callback()
			}
			buildResponse(paramString, callback);
		},

		districts: function(callback) {
			var paramString = '&tq=select%20'+categoryDict.district +
				',count('+categoryDict.first_name+')%20group%20by%20'+
				categoryDict.district + '%20label%20count('+categoryDict.first_name+')%20' +
				'%27legislators%27';
			buildResponse(paramString, callback);
		},
		parties: function(callback) {
			var paramString = '&tq=select%20'+categoryDict.party + ',' + categoryDict.party_ar + 
				',count('+categoryDict.first_name+')%20group%20by%20'+
				categoryDict.party +',' + categoryDict.party_ar +
				'%20label%20count('+categoryDict.first_name+')%20' +
				'%27legislators%27';
			buildResponse(paramString, callback);
		},
		names: function(callback) {
			var paramString = '&tq=select%20'+categoryDict.first_name + ',' +
			categoryDict.last_name + ',' + categoryDict.first_name_ar + ',' +
			categoryDict.last_name_ar;
			buildResponse(paramString, callback);
		},
	};
})();