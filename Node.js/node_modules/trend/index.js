module.exports = function(arr, options) {
	options = options || {};
	options.lastPoints = options.lastPoints || 1;
	options.avgPoints = options.avgPoints || 10;

	if (arr.length < options.lastPoints + options.avgPoints) return null;

	var lastArr = options.reversed ? arr.slice(0, options.lastPoints) : arr.slice(arr.length - options.lastPoints, arr.length);
	var chartArr = options.reversed ? arr.slice(options.lastPoints, options.lastPoints+options.avgPoints) : arr.slice(arr.length - options.lastPoints - options.avgPoints, arr.length - options.lastPoints);

	var chartAvg = chartArr.reduce(function(res, val) { return res += val }) / chartArr.length;
	var lastAvg = Math.max.apply(null, lastArr);

	if (options.avgMinimum !== undefined && chartAvg < options.avgMinimum) return null;
	return lastAvg/chartAvg;
};