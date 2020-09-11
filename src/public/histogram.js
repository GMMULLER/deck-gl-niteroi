// var inputHistogram = d3.select("input#histogram");

d3.select("input#histogram").on("click", function(){
    dataset.then(plotHistogram);
});

var finalBinPercent = 80;
var inicialBinPercent = 20;
var binNumber = 20; //A quantidade de bins resultante serah esse valor +2

d3.select("#finalBin").on("input", function() {
    finalBinPercent = 100 - this.value;
    d3.select("#finalPtg").text(this.value);
    d3.select("#histogram").property("checked", true);
    dataset.then(plotHistogram);
});

d3.select("#inicialBin").on("input", function() {
    inicialBinPercent = 0 + parseInt(this.value);
    d3.select("#inicialPtg").text(this.value);
    d3.select("#histogram").property("checked", true);
    dataset.then(plotHistogram);
});

d3.select("#qtdBin").on("input", function(){
    binNumber = parseInt(this.value);
    d3.select("#qtdBintxt").text(this.value);
    d3.select("#histogram").property("checked", true);
    dataset.then(plotHistogram);
});

function plotHistogram(data){

    var areas = [];

    for(i = 0; i < data.features.length; i++){

        areas.push(data.features[i].properties.shape_area_m2);
    }

    areas.sort(comparar); //Ordena o array
    var percentil = 0;
    var newAreas = [];
    var tooMuch = []; //Parte dos valores que sao demasiadamente grandes
    var tooLittle = []; //Parte dos valores sao demasiadamente pequenos

    for(i = 0; i < data.features.length; i++){
        percentil += (1/areas.length) * 100; //Quantos porcento do array foi coberto

        if(percentil >= finalBinPercent){
            tooMuch.push(areas[i]);
        }else if(percentil <= inicialBinPercent){
            tooLittle.push(areas[i]);
        }else{
            newAreas.push(areas[i]);
        }

    }

    var thresholds_marks = [];
    var sliceSize = Math.floor((d3.max(newAreas)-d3.min(newAreas))/binNumber); //Tamanho dos bins eh constante
    for(i = Math.floor(d3.min(newAreas)); i<d3.max(newAreas); i+=sliceSize){
        thresholds_marks.push(i);
    }

    var bins = d3.histogram()
                .domain(d3.extent(areas)) //O dominio do histograma compreende 100% das areas
                .thresholds(thresholds_marks)
            (areas); //Aplica a funcao em 100% das areas. Porem um bin a mais do estipulado eh
                     //criado para valores menores que o valor minimo dos thresholds

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([0, height]);

    svg.html("");

    svg.selectAll("div")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", function(d,i){
                return i*(width/(binNumber+2)) + 4;
            })
            .attr("width", width/(binNumber+2) - 4)
            .attr("y", function (d) {
                return 2*height - yScale(d.length);
            })
            .attr("height", function (d) {
                return yScale(d.length);
            })
            .attr("fill-opacity", "0.6")
            .attr("fill", "rgb(150, 86, 86)")

    console.log(bins);
    
    svg.selectAll("text")
        .data(bins)
        .enter()
        .append("text")
            .attr("x", function(d,i){return i*(width/(binNumber+2)) + 1;})
            .attr("y", function (d) {
                return 2*height - yScale(d.length) - 5;
            })
            .text( function(d) {return d.x0.toFixed(0)+" - "+d.x1.toFixed(0)} )
            .attr("fill", "rgb(255, 255, 255)")
            .attr("textLength", width/(binNumber+2) - 5)
            .attr("lengthAdjust", "spacingAndGlyphs");

}

function comparar(a, b){
    if(a < b){
        return -1;
    }

    if(a > b){
        return 1;
    }

    return 0;
}
