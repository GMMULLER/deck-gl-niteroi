var width = window.innerWidth;
var height = window.innerHeight/2; //O tamanho da tela eh metade do real para que os graficos sejam menores

var svg = d3.select("div#barchart").append("svg") //Cria a tag sgv no html
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+width+" "+height*2)
    .classed("svg-content", true);


var barWidth = 10;
var areas_to_draw = 80;

d3.select("input#simpleChart").on("click", function(){ //Se o grafico de barras for selecionado
    dataset.then(plotBarChart);
});

function plotBarChart(data){ //Exibe o grafico de barras OBJECTID x area das areas de protecao permanente
    close_areas = []; //Seleciona x areas mais proximas da ultima clicada incluindo esta
    var remainingAreas = areas_to_draw; //Guarda o numero restante de areas a serem desenhadas
    
    var upperIndex = last_objectid_selected; //OBJECTID = index + 1. O id dos objetos comeca em 1 e do array 0
    close_areas.push(data.features[last_objectid_selected-1]); //Adiciona a ultima area clicada
    var lowerIndex = last_objectid_selected-2;
    
    var xScale = d3.scaleBand() //Para dados categoricos
        .rangeRound([0, width])
        .paddingInner(0.20);

    var yScale = d3.scaleLinear() //Para dados continuos
        .rangeRound([0, height]);

    while(remainingAreas >= 1){
        if(upperIndex <= data.features.length-1){ //Se o valor esta dentro do array
            close_areas.push(data.features[upperIndex]);
            upperIndex++;
            remainingAreas--;
        }

        if(lowerIndex >= 0){ //Se o valor esta dentro do array
            close_areas.push(data.features[lowerIndex]);
            lowerIndex--;
            remainingAreas--;    
        }
    }


    svg.html(""); //Esvazia a tag svg no html

    xScale.domain(close_areas.map(function(d){return d.properties.OBJECTID}))
    yScale.domain([0, d3.max(close_areas, function(d) {return d.properties.shape_area_m2} )]);

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
            return xScale(d.properties.OBJECTID);
        })
        .attr("y", function (d) {
            return 2*height - yScale(d.properties.shape_area_m2); //2*height para que considere a tela toda no posicionamento
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return yScale(d.properties.shape_area_m2);
        });

    svg.selectAll("text") //Imprime acima de cada barra o OBJECTID dela
        .data(close_areas)
        .enter()
        .append("text")
        .attr("x", function (d) {
            return xScale(d.properties.OBJECTID);
        })
        .attr("y", function (d) {
            return 2*height - yScale(d.properties.shape_area_m2) - 5;
        })
        .text( function(d) {return d.properties.OBJECTID} )
        .attr("fill", "rgb(255, 255, 255)")
        .attr("textLength", xScale.bandwidth())
        .attr("lengthAdjust", "spacingAndGlyphs"); //Ajusta o texto para que ele seja do tamanho estabelecido
}