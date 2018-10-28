// Assumes you've included D3 version 5 somewhere above:
// e.g. <script src="https://d3js.org/d3.v5.min.js"></script>

// Set up size
var mapWidth = 750;
var mapHeight = 750;

// Add an SVG element to the DOM
var svg = d3.select('body').append('svg')
  .attr('width', mapWidth)
  .attr('height', mapHeight);


// Set up projection that the map is using
var projection = d3.geoMercator()
  .center([-122.433701, 37.767683]) // San Francisco, roughly
  .scale(225000)
  .translate([mapWidth / 2, mapHeight / 2]);


// Add SVG map at correct size, assuming map is saved in a subdirectory called `data`
svg.append('image')
  .attr('width', mapWidth)
  .attr('height', mapHeight)
  .attr('xlink:href', 'sf-map.svg');


// load data and parse rows information

d3.csv("https://magrawala.github.io/cs448b-fa18/assets/a3/restaurant_scores.csv", parseInputRow)
  .then(drawData);

function parseInputRow(d) {
	return {
		id: +d.business_id,
		restaurant: +d.business_name,
		address: +d.business_address,
		zipcode: +d.business_postal_code,
		business_latitude: +d.business_latitude,
		business_longitude: +d.business_longitude,
		phone: +d.business_phone_number,
		score: +d.inspection_score,
		review_date: +d.inspection_date,
		risk: +d.risk_category,
		violation_des: +d.violation_description
	}
};

function drawData(data) {
    
	var circles = svg.selectAll('circle')
  		.data(data)
  		.enter()
  		.append('circle')
  		.style("fill","red")
  		.attr('cx', function(d){ return projection([d.business_longitude, d.business_latitude])[0];})
  		.attr('cy', function(d){ return projection([d.business_longitude, d.business_latitude])[1];})
  		.attr('r', 1);
}


// Create a dragged point A
var point_position_data = d3.range(2).map(function() {
	return {
		x: Math.round(Math.random() * (750 - 5*2)+5),
		y: Math.round(Math.random() * (750 - 5*2)+5),
	};
});


point_position_data[0]["color"] = "red";
point_position_data[1]["color"] = "green";


point_position_data.forEach(function(d,i) {
	d.i = i;
});

var point_AB = svg.selectAll("circle")
	.data(point_position_data)
	.enter()
	.append("circle")
	.style("fill", d => d.color)
	.attr("r", 5)
	.attr("cx", function(d) {return d.x;})
	.attr("cy", function(d) {return d.y;})
	.attr("id", function(d) {return "location" + d.i;})
	.call(d3.drag().on("start", start)
					.on("drag", drag)
					.on("end", end));


// print the original point A's location
console.log(svg.select("#location0").data()[0].x);
console.log(svg.select("#location0").data()[0].y);
var A_pos = projection.invert([svg.select("#location0").data()[0].x, svg.select("#location0").data()[0].y]);
console.log(A_pos);

function start(d) {
	d3.select(this).raise().classed("activate", true);
}

function drag(d) {
	d3.select(this)
		.attr("cx", d.x = d3.event.x)
		.attr("cy", d.y = d3.event.y);
}

// try to print the updated location of A after we dragged it.
function end(d) {
	d3.select(this).classed("activate", false);
	console.log(svg.select("#location0").data()[0].x);
	console.log(svg.select("#location0").data()[0].y);
	var A_pos = projection.invert([svg.select("#location0").data()[0].x, svg.select("#location0").data()[0].y]);
	console.log(A_pos);

}

// ???	should show the text beside the point A?

// var texts svg.selectAll("text")
// 				.data(point_position_data)
// 				.enter()
// 				.append("text")
// 				.text(function(d) {
// 					return d.i;
// 				})
// 				.attr("x", function(d) {return d.x + 5;})
// 				.attr("y", function(d) {return d.y + 5;});



// point_AB.selectAll("text").each(function(d, i) {
// 	d3.select(this).text("A")
// })
// 	.data(point_position_data)
// 	.enter()
// 	.append("text")
// 	.attr("x", function(d) {return d.x + 5;})
// 	.attr("y", function(d) {return d.y + 5;})
// 	.text(function(d) {return d.i;})
// 	.attr("font-size",25)
//     .attr("font-family","serif")
//     .attr("text-anchor","middle")
//     .attr("font-weight","bold");

	





// This is the mapping between <longitude, latitude> position to <x, y> pixel position on the map
// projection is a function and it has an inverse:
// projection([lon, lat]) returns [x, y]
// projection.invert([x, y]) returns [lon, lat]




