/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    console.log("In staircase() function");  
    var bar_chart = document.getElementById("BarChart_left");
    var chart_children = bar_chart.children;
    for( var j=0;j<chart_children.length;j++)
        {
       // console.log("---length",chart_children.length);
        chart_children[j].setAttribute("height",10*j);
        }
    
    // ****** TODO: PART II ******
}


/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()

        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
   
    var barchart_a = d3.select("#BarChart_left");
    var bars_l = barchart_a.selectAll("rect")
                .data(data);
    bars_l.exit()
        .transition()
        .duration(3000)
        .style("opacity",0)
        .remove();

    bars_l = bars_l.enter().append("rect")
                .merge(bars_l);
    bars_l.transition()
        .duration(3000)
        .attr("x",function(d,i) { return (i+1)*10; })
        .attr("y",0)
        .attr("width", 10)
        .attr("height",function(d) { return aScale(d.a); })
        .style("opacity",1);
    //bars_l.exit().remove();   
    bars_l.on("mouseover", function() {
            d3.select(this)
                .attr("fill", "red");})
            .on("mouseout", function() {
            d3.select(this)
            .attr("fill", "steelblue");});



    // TODO: Select and update the 'b' bar chart bars
    
    var barchart_b = d3.select("#BarChart_right");
    var bars_r = barchart_b.selectAll("rect")
                .data(data);
    bars_r.exit()
        .transition()
        .duration(3000)
        .style("opacity",0)
        .remove();            
    bars_r = bars_r.enter().append("rect")
                .merge(bars_r);
    bars_r.transition()
        .duration(3000)
        .attr("x",function(d,i) { return (i+1)*10; })
        .attr("y",0)
        .attr("width", 10)
        .attr("height",function(d) { return bScale(d.b); })
        .style("opacity",1);            
    //bars_r.exit().remove();  
    bars_r.on("mouseover", function() {
            d3.select(this)
                .attr("fill", "red");})
            .on("mouseout", function() {
            d3.select(this)
            .attr("fill", "steelblue");});          

    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    var linechart_left = d3.select("#LineChart_left")
    var linechart_l=linechart_left.selectAll("path")
                        .datum(data)
                        .attr("class","lines")
                        .transition()
                        .duration(3000)
                        .attr("d",aLineGenerator)
                        .transition()
                        .duration(3000);                

    // TODO: Select and update the 'b' line chart path (create your own generator)
   
    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));
  
    var linechart_right = d3.select("#LineChart_right");
    var linechart_r = linechart_right.selectAll("path")  
                        .datum(data)
                        .transition()
                        .duration(3000)
                        .attr("d",bLineGenerator)
                        .transition()
                        .duration(3000);   

    // TODO: Select and update the 'a' area chart path using this area generator
    
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    var areachart_left = d3.select("#AreaChart_left");
    var areachart_l=areachart_left.selectAll("path")
                    .datum(data) 
                    .transition()
                    .duration(3000) 
                    .attr("d", aAreaGenerator)
                    .transition()
                    .duration(3000);


    // TODO: Select and update the 'b' area chart path (create your own generator)

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));

    var areachart_right = d3.select("#AreaChart_right");
    var areachart_r=areachart_right.selectAll("path")
                    .datum(data)
                    .transition()
                    .duration(3000)
                    .attr("d", bAreaGenerator)
                    .transition()
                    .duration(3000);                    

    // TODO: Select and update the scatterplot points
    
    var scatterplot_chart = d3.select("#Scatterplot_");
    var circles = scatterplot_chart.selectAll("circle")
                  .data(data);
    circles.exit()
            .transition()
            .duration(3000)
            .style("opacity",0)
            .remove();              
    circles=circles.enter().append("circle")
            .merge(circles);
    circles.transition()
        .duration(3000)
        .attr("r",5)
        .attr("cx", function(d) { return aScale(d.a); })
        .attr("cy", function(d) { return bScale(d.b); })
        .style("opacity",1);   
   // circles.exit().remove(); 
    circles.on("click", function(d) {
                console.log("("+d.a+","+d.b+")")});
    circles.on("mouseover",function(d){
        this.title = "hi";
    });


    // ****** TODO: PART IV ******

}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}