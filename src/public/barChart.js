var width = window.innerWidth;
var height = window.innerHeight/2;

var svg = d3.select("div#barchart").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+width+" "+height*2)
    .classed("svg-content", true);


var barWidth = 10;
var areas_to_draw = 80;

dataset.then(plotBarChart); //When the promisse is resolved

function plotBarChart(data){
    close_areas = [];//Seleciona 86 terrenos mais proximos do ultimo selecionado
    var remainingAreas = areas_to_draw;
    var upperIndex = last_objectid_selected; //OBJECTID = index + 1
    close_areas.push(data.features[last_objectid_selected-1]); //Os objetos estao em ordem crescente dentro do array mas o OBJECTID = index + 1
    var lowerIndex = last_objectid_selected-2; //OBJECTID = index + 1
    
    var xScale = d3.scaleBand() //For categorical data
        .rangeRound([0, width])
        .paddingInner(0.20);
    var yScale = d3.scaleLinear() //For continuous data
        .rangeRound([0, height]);

    while(remainingAreas >= 1){
        if(upperIndex <= data.features.length-1){
            close_areas.push(data.features[upperIndex]);
            upperIndex++;
            remainingAreas--;
        }

        if(lowerIndex >= 0){
            close_areas.push(data.features[lowerIndex]);
            lowerIndex--;
            remainingAreas--;    
        }
    }


    svg.html("");

    xScale.domain(close_areas.map(function(d){return d.properties.OBJECTID}))
    yScale.domain([0, d3.max(close_areas, function(d) {return d.properties.shape_area_m2} )]);
    console.log(close_areas);

    svg.selectAll("div")
        .data(close_areas)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", function(d){
            if(d.properties.OBJECTID == last_objectid_selected)
                return "rgb(96, 115, 168)";
            else
                return "rgb(150, 86, 86)";
        })
        .attr("fill-opacity", "0.4")
        .attr("x", function (d) {
            // return i * (barWidth+1);
            return xScale(d.properties.OBJECTID);
        })
        .attr("y", function (d) {
            // return height - (d.properties.shape_area_m2/30);
            return 2*height - yScale(d.properties.shape_area_m2);
        })
        // .attr("width", barWidth)
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            // return d.properties.shape_area_m2/30;
            return yScale(d.properties.shape_area_m2);
        });

    svg.selectAll("text")
        .data(close_areas)
        .enter()
        .append("text")
        .attr("x", function (d) {
            // return i * (barWidth+1);
            return xScale(d.properties.OBJECTID);
        })
        .attr("y", function (d) {
            // return height - (d.properties.shape_area_m2/30);
            return 2*height - yScale(d.properties.shape_area_m2) - 5;
        })
        // .attr("width", barWidth)
        .text( function(d) {return d.properties.OBJECTID} )
        .attr("fill", "rgb(255, 255, 255)");
}