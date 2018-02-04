var trend = require('../index');
var test = require('tape');

var fail1 = [40, 39, 38, 41, 42, 40, 37, 43, 41, 40,  2,  0,  1];
var fail2 = [40, 39, 38, 41, 42, 40, 37, 43, 40,  2,  1,  2,  0];
var rvsd1 = JSON.parse(JSON.stringify(fail1)).reverse();
console.log(rvsd1)
var ignr1 = [40, 39, 38, 41, 42, 40, 37, 43, 41, 39, 38, 32,  2];
var ignr2 = [40, 39, 38, 41, 42, 40, 37, 43, 41, 39, 35, 35,  2];
var ignr3 = [10,  0]; // Too few elements to calculate 
var ignr4 = [ 0,  1,  0,  1,  0,  1,  0,  1,  0,410,  0,  2,  1]; // Ignore extreme elements
var stdOptions = { lastPoints:3, avgPoints:10 };

var test1 = function() {
	test('Simple fail', function(t) {
		t.ok(trend(fail1, stdOptions) < 0.10 );
		t.end();
	});
};
var test2 = function() {
	test('Fail last two', function(t) {
		t.ok(trend(fail2, stdOptions) < 0.10);
		t.end();
	});
};
var test3 = function() {
	test('Only one low point', function(t) {
		t.ok(trend(ignr1, stdOptions) > 0.50);
		t.end();
	});
};
var test4 = function() {
	test('Only two low point', function(t) {
		t.ok(trend(ignr2, stdOptions) > 0.50);
		t.end();
	});
};
var test5 = function() {
	test('Should ignore if array is too small', function(t) {
		t.equal(null, trend(ignr3, stdOptions));
		t.end();
	});
};
var test6 = function() {
	test('Ignore if average is below avgMinimum', function(t) {
		t.equal(null, trend(fail1, {
			lastPoints: 3,
			avgPoints: 10,
			avgMinimum: 50
		}));
		t.end();
	});
};
var test7 = function() {
	test('Reverse the array ', function(t) {
		t.ok(trend(rvsd1, {
			lastPoints: 3,
			avgPoints: 10,
			reversed: true
		}) < 0.10);
		t.end();
	});
};
// Cannot do this yet
// var test... = function() {
// 	test('Should ignore extreme elements', function(t) {
// 		t.equal(trend(ignr4), true);
// 		t.end();
// 	});
// };

test1();
test2();
test3();
test4();
test5();
test6();
test7();