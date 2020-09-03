dataset.then(plotHistogram);

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

        if(percentil >= 80){
            tooMuch.push(areas[i]);
        }else if(percentil <= 20){
            tooLittle.push(areas[i]);
        }else{
            newAreas.push(areas[i]);
        }

    }

    var xScale = d3.scaleLinear()
        .domain(d3.extent(newAreas)).nice()
        .range([0, width]);

    var percentilSize = 1;
    var percentilAdded = 0;
    var thresholds = [0];

    // for(i = 0; i < newAreas.length; i++){
    //     percentil += (1/newAreas.length) * 100; //Quantos porcento do array foi coberto
    //     console.log(percentil);
    //     if(percentil >= percentilSize || i == newAreas.length - 1){
    //         percentilAdded += percentil;
    //         percentil = 0;
    //         percentilSize += 1;
    //         thresholds.push(newAreas[i]);
    //     }
    // }

    // console.log(percentilAdded);
    // console.log(thresholds);

    var binNumber = 20;

    var bins = d3.histogram()
                .domain(xScale.domain())
                .thresholds(xScale.ticks(binNumber))
                // .thresholds(thresholds)
            (newAreas);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height, 0]);

    console.log(bins);

    var xScaleAll = d3.scaleLinear()
        .domain(d3.extent(areas)).nice()
        .range([0, width]);


    // svg.selectAll("div")
    //     .data([{}, {}])
    //     .enter()
    //     .append("rect")
    //         .attr("x", d => xScale(d.x0) + 1)
    //         // .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
    //         .attr("width", d => (width/binNumber+2) - 1) //Todos os bin tem o mesmo tamanho
    //         .attr("y", d => yScale(d.length))
    //         .attr("height", d => yScale(0) - yScale(d.length));

    svg.selectAll("div")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", d => xScale(d.x0) + (width/(binNumber+2)))
            // .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
            .attr("width", (width/(binNumber+2)) - 15) //Todos os bin tem o mesmo tamanho
            .attr("y", d => yScale(d.length))
            .attr("height", d => yScale(0) - yScale(d.length));


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
