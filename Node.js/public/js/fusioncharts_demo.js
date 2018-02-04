var chartData;

$(function(){
  $.ajax({

    url: 'http://szustakowses.nazwa.pl/fuelPrices',
    type: 'GET',
    success : function(data) {
      chartData = data;
      var template = Handlebars.compile($("#tabular-template").html());
      $("#table-location").html(template(data));

      var chartProperties = {
        "caption": "Wykres temperatry i wilgotnosci",
        "xAxisName": "Data",
        "yAxisName": "Wartość"
	
      };

      var categoriesArray = [{
          "category" : data["categories"]
      }];

      var lineChart = new FusionCharts({
       type: 'zoomline',
        renderAt: 'chart-location',
        width: '1000',
        height: '600',
        skipLabels : 3,
	dataFormat: 'json',
        
	dataSource: {
          chart: chartProperties,
          categories : categoriesArray,
          dataset : data["dataset"]
        }

      });
      lineChart.render();
    }
  });
});
