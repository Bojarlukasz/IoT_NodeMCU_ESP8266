/**
 * Tests for the Lyric.js linear regression library.
 */
var Sylvester = require('sylvester');
var Lyric = require('../lyric.js');

// Test that sylvester is integrated properly
exports['test sylvester'] = function(beforeExit, assert){
	var matrix = Sylvester.Matrix.Zeros(3, 4);
	
    assert.equal(3, matrix.rows());
    assert.equal(4, matrix.cols());
};

// Test the generation of input matrices
exports['test generateInputMatrix'] = function(beforeExit, assert){
	// Try with zeros and a power of 2
	var inputArray = [0, 0, 0, 0, 0];
	var generatedMatrix = Lyric.generateInputMatrix(inputArray, 2);
	var expectedMatrix = $M([[1, 1, 1, 1, 1],
							 [0, 0, 0, 0, 0],
							 [0, 0, 0, 0, 0]]);
	assert.equal(true, expectedMatrix.eql(generatedMatrix));
	
	// Try with values and a power of 3
	var inputArray = [1, 2, 3, 4, 5];
	var generatedMatrix = Lyric.generateInputMatrix(inputArray, 3);
	var expectedMatrix = $M([[1, 1, 1, 1, 1],
							 [1, 2, 3, 4, 5],
							 [1, 4, 9, 16, 25],
							 [1, 8, 27, 64, 125]]);
	assert.equal(true, expectedMatrix.eql(generatedMatrix));
};

// Test the raising of a matrix's elements to a given power
exports['test matrixPower'] = function(beforeExit, assert){
	// All zeros 
	var inputMatrix = Sylvester.Matrix.Zeros(4,5);
	var resultMatrix = Lyric.matrixPower(inputMatrix, 3);
	var expectedMatrix = inputMatrix; // should be the same coming out as going in, no matter the power
	assert.equal(true, expectedMatrix.eql(resultMatrix));
	
	// Try with a matrix of numbers
	var inputMatrix = $M([[1, 2, 3, 4],
						  [5, 6, 7, 8],
						  [-1, -2, -3, -4]]);
	var resultMatrix = Lyric.matrixPower(inputMatrix, 2);
	var expectedMatrix = $M([[1, 4, 9, 16],
						   [25, 36, 49, 64],
						   [1, 4, 9, 16]]);
	assert.equal(true, expectedMatrix.eql(resultMatrix));
};

// Test ordinalize
exports['test ordinalize'] = function(beforeExit, assert){
	var input = new Array();
	input['x'] = new Array();			input['y'] = new Array();
	input['x'][0] = '2012-03-01';       input['y'][0] = 0.5;
	input['x'][1] = '2012-03-02';       input['y'][1] = 1.6;    
	input['x'][2] = '2012-03-03';       input['y'][2] = 4.5;
	input['x'][3] = '2012-03-04';       input['y'][3] = 7.6;
	input['x'][4] = '2012-03-05';       input['y'][4] = 10.1;

	var ordinalArray = Lyric.ordinalize(input);
	
	assert.isNotNull(ordinalArray['label']);
	assert.equal(5, ordinalArray['label'].length);
	assert.isNotNull(ordinalArray['x']);
	assert.equal(5, ordinalArray['x'].length);
	assert.isNotNull(ordinalArray['y']);
	assert.equal(5, ordinalArray['y'].length);
	
	assert.equal(input['x'][0], ordinalArray['label'][0]);
	assert.equal(input['x'][4], ordinalArray['label'][4]);
	assert.equal(0, ordinalArray['x'][0]);
	assert.equal(4, ordinalArray['x'][4]);
	assert.equal(input['y'][0], ordinalArray['y'][0]);
	assert.equal(input['y'][4], ordinalArray['y'][4]);
};

// Test regression
exports['test regression#simpleLine'] = function(beforeExit, assert){
	var input = new Array();
	input['x'] = new Array();	input['y'] = new Array();
	input['x'][0] = 1;      	input['y'][0] = 2;
	input['x'][1] = 2;      	input['y'][1] = 3;    
	input['x'][2] = 3;      	input['y'][2] = 4;
	input['x'][3] = 4;      	input['y'][3] = 5;
	input['x'][4] = 5;      	input['y'][4] = 6;
	
	var estimationInput = new Array();
	estimationInput['x'] = new Array();
	estimationInput['x'][0] = 6;
	estimationInput['x'][1] = 7;
	estimationInput['x'][2] = 8;
	
	var estimateData = Lyric.applyModel(estimationInput, Lyric.buildModel(input, 1), 1);
	
	assert.equal(6, estimateData[0]['x']);
	assert.equal(7, estimateData[1]['x']);
	assert.equal(8, estimateData[2]['x']);
	assert.equal(7, Math.round(estimateData[0]['y']));
	assert.equal(8, Math.round(estimateData[1]['y']));
	assert.equal(9, Math.round(estimateData[2]['y']));
}

// Test regression
exports['test regression'] = function(beforeExit, assert){
	var input = new Array();
	input['x'] = new Array();	input['y'] = new Array();
	input['x'][0] = 1;      	input['y'][0] = 0.5;
	input['x'][1] = 2;      	input['y'][1] = 1.6;    
	input['x'][2] = 3;      	input['y'][2] = 4.5;
	input['x'][3] = 4;      	input['y'][3] = 7.6;
	input['x'][4] = 5;      	input['y'][4] = 10.1;
	
	var estimationInput = new Array();
	estimationInput['x'] = new Array();
	estimationInput['x'][0] = 6;
	estimationInput['x'][1] = 7;
	estimationInput['x'][2] = 8;
	
	var estimateData = Lyric.applyModel(estimationInput, Lyric.buildModel(input));
	
	assert.equal(6, estimateData[0]['x']);
	assert.equal(7, estimateData[1]['x']);
	assert.equal(8, estimateData[2]['x']);
	assert.equal(14, Math.round(estimateData[0]['y']));
	assert.equal(18, Math.round(estimateData[1]['y']));
	assert.equal(22, Math.round(estimateData[2]['y']));
}

// Test error calculation
exports['test regression'] = function(beforeExit, assert){
	var input = new Array();
	input['x'] = new Array();	input['y'] = new Array();
	input['x'][0] = 1;      	input['y'][0] = 0.5;
	input['x'][1] = 2;      	input['y'][1] = 1.6;    
	input['x'][2] = 3;      	input['y'][2] = 4.5;
	input['x'][3] = 4;      	input['y'][3] = 7.6;
	input['x'][4] = 5;      	input['y'][4] = 10.1;
	
	var error = Lyric.computeError(input, Lyric.buildModel(input));

	assert.equal(0.117, error.toFixed(3));
}
