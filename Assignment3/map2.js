var allData = [];
var filteredData = [];

// Keep track of which things are turned on
var currScore = 52; // record updated score
var scoreData = 52;
var intersected = false;
var miletopixel = 71.89980860331622;

var drag = d3.drag()
			.on("drag", dragmove)

function loadData(data) {
	initialData(data);
	visualize(data);
}

function initialData(data) {
	allData = data.slice(); // global declaration
	filteredData = [];
	// console.log(allData[0].inspection_score)

	// circle A	
	svg.append("circle")
		.attr("cx", 280)
		.attr("cy", 400)
		.attr("r", miletopixel)
		.attr("fill", "#FF0000")
		.attr("fill-opacity", 0.15)
		.attr("id", "A")
		.call(drag);

	// circle B
	svg.append("circle")
		.attr("cx", 350)
		.attr("cy", 400)
		.attr("r", miletopixel)
		.attr("fill", "#0000FF")
		.attr("fill-opacity", 0.15)
		.attr("id", "B")
		.call(drag);
};

// visualize
function visualize(d) {

	filterData();
	
	var circles = svg.selectAll("circle")
  		.data(filteredData)
  		.enter()
  		.append("circle")
  		.style("fill","blue")
  		.attr("cx", function(d){ return projection([d.business_longitude, d.business_latitude])[0];})
  		.attr("cy", function(d){ return projection([d.business_longitude, d.business_latitude])[1];})
  		.attr("r", 1);
		
	circles.exit().remove();
}

function filterData() {

	scoreDataCheck();

	console.log(filteredData);

	if (intersected) {
		for (var x = filteredData.length - 1; x >= 0; x--) {
			var currentDataPoint = filteredData[x];
			// console.log(currentDataPoint);
			if (!insideIntersection(currentDataPoint)) {
				filteredData.splice(x, 1);
			}
		}
	}
}

function scoreDataCheck(currScore){
	if (currScore > scoreData) {
        for (i = scoreData; i < currScore; i++) {
        	for (var x = filteredData.length - 1; x >= 0; x--) {
				var currentDataPoint = filteredData[x];
				if (currentDataPoint.inspection_score <= i){
					filteredData.splice(x, 1);
				}
			}
        }
    } else {
    	filteredData = []
        for (var i = 0; i < allData.length; i++) {
			// console.log(scoreData);
			var r = allData[i].inspection_score
			if (r >= currScore){
				filteredData.push(allData[i]);
			}	 
		}}

	scoreData = currScore;
}

function intersect(point) {
	var checked = point.checked;
	if (checked) {
		intersected = true;
		visualize(filteredData);
	} else {
		intersected = false;
		visualize(allData);
	}
}



// Create the drag() -- define the dragmove function
function dragmove(d){
	var x = d3.event.x;
	var y = d3.event.y;
	d3.select(this)
		.attr("cx", x)
		.attr("cy", y);
}



// Change the radius of 2 points, A and B
function changeRadiusA(radius) {
		document.querySelector('#valueA').value = radius + " mi";
		var pixelRadius = radius * miletopixel;
		d3.select("#A")
			.attr("r", pixelRadius);
		visualize(filteredData);
}

function changeRadiusB(radius) {
		document.querySelector('#valueB').value = radius + " mi";
		var pixelRadius = radius * miletopixel;
		d3.select("#B")
			.attr("r", pixelRadius);
		visualize(filteredData);
}

function changeScore(review_score) {
		document.querySelector('#valueS').value = currScore;
		d3.select("#scoreAcc").on("input", function() {
		    update(+this.value);
		    console.log(d3.select("#scoreAcc").value);
		});

		visualize(filteredData);
		console.log(scoreData);
}

function update(value){
	value = currScore;
}



function insideIntersection(d) {
    var circleA = d3.select("#A");
    // console.log(circleA.attr("cx"));
    var circleB = d3.select("#B");
 
    var A_X = projection([d.business_longitude, d.business_latitude])[0] - circleA.attr("cx");
    var A_Y = projection([d.business_longitude, d.business_latitude])[1] - circleA.attr("cy");
    var B_X = projection([d.business_longitude, d.business_latitude])[0] - circleB.attr("cx");
    var B_Y = projection([d.business_longitude, d.business_latitude])[1] - circleB.attr("cy");
    var A_R = circleA.attr("r");
    var B_R = circleB.attr("r");

    var Z = (Math.pow(A_X, 2) + Math.pow(A_Y, 2) <= Math.pow(A_R, 2) 
    	&& Math.pow(B_X, 2) + Math.pow(B_Y, 2) <= Math.pow(B_R, 2));

    return Z;
}



// function emptyCheck(data) {
// 	var sum = 0;
// 	for (var i = 0; i < data.length; i++) {
// 		sum += data[i];
// 	}
// 	if (sum == 0) return true;
// 	return false;
// }







// function visualize(data) {

// 	// filterData();
// 	filteredData = globalData.slice(0);

// 	console.log(filteredData);

// 	var circles = svg.selectAll("circle.dataPoints").data(filteredData, function(d) {return d});
// 		.enter()
// 		.append("circle")
// 		.attr("class", "dataPoints")
// 		.attr("r", "2px")
// 		.attr('data-id', function(d) {return d.id;})
// 		.attr('cx', function(d){ return projection([d.business_longitude, d.business_latitude])[0];})
//   		.attr('cy', function(d){ return projection([d.business_longitude, d.business_latitude])[1];});

		// circles.exit().remove();

// mouseover



// mouseout



//dragmove