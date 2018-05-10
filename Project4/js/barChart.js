/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
    let infoPanel = new InfoPanel();
    let worldMap = new Map();    
    var year_list = this.allData.map(function(d) {return d.year;}).reverse();
    var padding = 60;
    var height = 400;
    var width =500;  

    var svg = d3.select("#barChart")
                    .attr("height",400)
                    .attr("width",500);
    
    var barWidth = width/this.allData.length -5;
    var chart_width = width - 2*padding;
    var chart_height = height -2* padding;

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(this.allData, function (d) {return d[selectedDimension];})])   
        .range([height - padding, padding]);

    var xScale = d3.scaleBand()
        .domain(year_list)
        .range([padding, chart_width + padding + barWidth]);

    var y_dimension = d3.scaleLinear()
        .domain([0, d3.max(this.allData, function (d) {return d[selectedDimension];})])
        .range([padding, chart_height]);

    var x_dimension = d3.scaleLinear()
        .domain([this.allData.length - 1, 0])
        .range([padding, chart_width + padding]);

    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(this.allData, function (d) {return d[selectedDimension];})])
        .range(["#0d63a6","#032f51"]);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    d3.select("#yAxis")
        .attr("transform", "translate(" + padding + ",0)")
        .transition().duration(3000)
        .call(yAxis);

    var xAxis = d3.axisBottom()
        .ticks(this.allData.length)
        .scale(xScale);

    d3.select("#xAxis")
        .attr("transform", "translate(0,"+ (chart_height + padding) + ")")
        .call(xAxis)
        .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.5em")
                .attr("dy", "-.3em")
                .attr("transform", "rotate(-90)");


    var bars = d3.select("#bars").selectAll("rect")
                    .data(this.allData);
        bars.exit()
            .transition()
            .duration(3000)
            .style("opacity",0)
            .remove();
        bars=bars.enter().append("rect")
            .merge(bars);
        bars.transition()
            .duration(3000)
            .attr("x",function(d,i) {
                return x_dimension(i); })
            .attr("y",padding)
            .attr("width", barWidth)
            .attr("height",function(d) { return y_dimension(d[selectedDimension]); })
            .style("opacity",1)
            .attr("fill",function(d) { return colorScale(d[selectedDimension])})
            .style("stroke","white")
            .style("stroke-width","1px");
        bars.on("click", function(d) {
                d3.select(".selected").classed("selected",false);
                d3.select(this).classed("selected", true);
               // console.log("----------problem------");
                infoPanel.updateInfo(d);
                worldMap.updateMap(d);
            });
        // ******* TODO: PART I *******

        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)




        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
  /*  chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
    var selected_dataset = document.getElementById('dataset').value;
    this.updateBarChart(selected_dataset);

    }
*/
}