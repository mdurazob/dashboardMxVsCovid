queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {
	
	//Clean data
	var records = recordsJson;
	var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
	
	records.forEach(function(d) {
		d["timestamp"] = dateFormat.parse(d["timestamp"]);
		d["timestamp"].setMinutes(0);
		d["timestamp"].setSeconds(0);
		d["longitude"] = +d["longitude"];
		d["latitude"] = +d["latitude"];
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["timestamp"]; });
	var economiaDim = ndx.dimension(function(d) { return d["economia"]; });
	var tipoDim = ndx.dimension(function(d) { return d["tipo"]; });
	var atencionDim = ndx.dimension(function(d) { return d["atencion"]; });
	var locationdDim = ndx.dimension(function(d) { return d["location"]; });
	var allDim = ndx.dimension(function(d) {return d;});


	//Group Data
	var numRecordsByDate = dateDim.group();
	var economiaGroup = economiaDim.group();
	var tipoGroup = tipoDim.group();
	var atencionGroup = atencionDim.group();
	var locationGroup = locationdDim.group();
	var all = ndx.groupAll();


	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["timestamp"];
	var maxDate = dateDim.top(1)[0]["timestamp"];


    //Charts
    var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var timeChart = dc.barChart("#time-chart");
	var economiaChart = dc.rowChart("#economia-row-chart");
	var tipoChart = dc.rowChart("#tipo-row-chart");
	var locationChart = dc.rowChart("#location-row-chart");
	var atencionChart = dc.rowChart("#atencion-row-chart");
    var dataTable = dc.dataTable("#mytable");



	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);


	timeChart
		.width(650)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(dateDim)
		.group(numRecordsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	economiaChart
        .width(300)
        .height(100)
        .dimension(economiaDim)
        .group(economiaGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

    atencionChart
        .width(300)
        .height(100)
        .dimension(atencionDim)
        .group(atencionGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);



	tipoChart
		.width(300)
		.height(310)
        .dimension(tipoDim)
        .group(tipoGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);


    dataTable
        .width(768)
        .height(480)
        .dimension(dateDim)
        .group(function(d) {return "";})
        .columns([function(d) { return d.timestamp.getDate() + "/" + (d.timestamp.getMonth() + 1) + "/" + d.timestamp.getFullYear(); },
                  function (d) { return d.tipo },
                  function (d) { return d.mensaje },
                  function (d) { return d.atencion }])
        .sortBy(function (d) { return +d.timestamp })
        .order(d3.descending);

    locationChart
    	.width(200)
		.height(510)
        .dimension(locationdDim)
        .group(locationGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

    var map = L.map('map', {     fullscreenControl: true, fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
    }});


	var drawMap = function(){

	    map.setView([24.134744, -102.937580], 4);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["latitude"], d["longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20, 
			maxZoom: 1,
		}).addTo(map);


	};


	//Draw Map
	drawMap();



	//Update the heatmap if any dc chart get filtered
	dcCharts = [timeChart, economiaChart, tipoChart, locationChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			}); 
			drawMap();
		});
	});

	dc.renderAll();

};

map.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
    }
}));
