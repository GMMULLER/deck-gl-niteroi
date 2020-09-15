d3.select("input#histogram").on("click", function(){ //Se o histograma for selecionado para renderizacao
    dataset.then(plotHistogram); //Se os dados jah foram obtidos renderiza o histograma
});

var finalBinPercent = 80; //Em qual percentil comeca o ultimo bin
var inicialBinPercent = 20; //Em qual percentil termina o primeiro bin
var binNumber = 20; //A quantidade de bins resultante serah esse valor +2

d3.select("#finalBin").on("input", function() { //Se o input do bin final for atualizado
    finalBinPercent = 100 - this.value; //this.value guarda o tamanho do bin final
    d3.select("#finalPtg").text(this.value); //Atualiza o label no html que indica o tamanho do bin
    d3.select("#histogram").property("checked", true); //Marca a opcao de exibicao do histograma 
    dataset.then(plotHistogram);
});

d3.select("#inicialBin").on("input", function() { //Se o input do bin inicial for atualizado
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

function plotHistogram(data){ //Exibe o histograma

    var areas = []; //Guarda todas os valores de area das areas de protecao permanente

    for(i = 0; i < data.features.length; i++){ //Popula o array de areas
        areas.push(data.features[i].properties.shape_area_m2);
    }

    areas.sort(comparar); //Ordena o array em ordem crescente
    var percentil = 0; //Indica quantos porcento do array foi percorrido
    var newAreas = []; //Guarda as areas que estao entre o bin final e inicial
    var tooMuch = []; //Guarda as areas que fazem parte do bin final
    var tooLittle = []; //Guarda as areas que fazem parte do bin inicial

    for(i = 0; i < data.features.length; i++){
        percentil += (1/areas.length) * 100; //Atuliza a porcentagem de cobertura do array

        if(percentil >= finalBinPercent){ //Categoriza a area entre os tres vetores
            tooMuch.push(areas[i]);
        }else if(percentil <= inicialBinPercent){
            tooLittle.push(areas[i]);
        }else{
            newAreas.push(areas[i]);
        }

    }

    var thresholds_marks = []; //Guardas os thresholds para a definicao dos bins do histograma
    var sliceSize = Math.floor((d3.max(newAreas)-d3.min(newAreas))/binNumber); //Tamanho dos bins eh constante (somente considera as areas do meio)
    for(i = Math.floor(d3.min(newAreas)); i<d3.max(newAreas); i+=sliceSize){ 
        thresholds_marks.push(i);
    }

    var bins = d3.histogram() //Distribui as areas entre os bins
                .domain(d3.extent(areas)) //O dominio do histograma compreende todas as areas
                .thresholds(thresholds_marks)
            (areas); //Como as areas do bin final e inicial nao foram usadas na criacao dos thresholds
                     //as areas maiores que o ultimo threshold fazem parte do bin final, assim como 
                     //para o bin inicial

    var yScale = d3.scaleLinear() //Cria uma escala que mapeara a altura das barras para a altura da tela
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([0, height]);

    svg.html(""); //Esvazia a tag svg

    svg.selectAll("div")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", function(d,i){
                return i*(width/(binNumber+2)) + 4;
            })
            .attr("width", width/(binNumber+2) - 4)
            .attr("y", function (d) {
                return 2*height - yScale(d.length); //height guarda o tamanho da tela /2 para que as barras tenham tamanho reduzido 
            })
            .attr("height", function (d) {
                return yScale(d.length);
            })
            .attr("fill-opacity", "0.6")
            .attr("fill", "rgb(150, 86, 86)")

    svg.selectAll("text") //Indica os extremos de cada bin
        .data(bins)
        .enter()
        .append("text")
            .attr("x", function(d,i){
                return i*(width/(binNumber+2)) + 1;
            })
            .attr("y", function (d) {
                return 2*height - yScale(d.length) - 5;
            })
            .text( function(d) {return d.x0.toFixed(0)+" - "+d.x1.toFixed(0)} )
            .attr("fill", "rgb(255, 255, 255)")
            .attr("textLength", width/(binNumber+2) - 5)
            .attr("lengthAdjust", "spacingAndGlyphs"); //Ajusta o texto para que ele seja do tamanho estabelecido

}

function comparar(a, b){ //Funcao usada para ordenacao do array de areas
    if(a < b){
        return -1;
    }

    if(a > b){
        return 1;
    }

    return 0;
}
