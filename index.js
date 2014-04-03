
var GoogleSpreadsheet = require('google-spreadsheet-stream');
var fs = require('fs');

const testKey = '1JvV98iIRliC4mKmUBnzI6gAfhzjgmCcrhVBvz5VtylE';
const testSheetId = 'od6';

var spreadsheet = new GoogleSpreadsheet(testKey);

function hashify(str, num) {
	'use strict';
	var threshold = new Array(num).join(9);
	var result = 0;
	for (var i in str) {
		result = (result + i*str.charCodeAt(i)) % threshold;
	}
	return result ;
}

spreadsheet.getColumnHeaders(testSheetId).on('data', function(data) {
    'use strict';
    data[data.length] = 'id';
    data[data.length] = 'district_id';
    data[data.length] = 'party_id';
    fs.writeFile('legislators.csv', data + '\n', 'utf-8', function() {
        // if (err) {console.log('error1' + err); }
    });
    spreadsheet.getRows(testSheetId).on('data', function(row) {
		var data = [];
		row.forEach(function (field, index) {
			if (typeof(field) === 'string') {
				data[index] = field.replace(/(^\s+|\s+$)/g,'');
			}
		});
		var id = hashify(data[0] + data[2] + data[14] + data[15] + data[16], 16);
		var districtId = hashify(data[8], 4);
		var partyId = hashify(data[12], 4);
		data[data.length] = id;
		data[data.length] = districtId;
		data[data.length] = partyId;
        fs.appendFile('legislators.csv', ''+ data + '\n', 'utf-8', function() {
			// console.log('error2' + err);
        });
    });
});