/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let divTiles = d3.select("#tiles").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;
        let legendHeight = 50;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
                            .style("bgcolor","green")
                            .classed("legendText",true);
        this.svg = divTiles.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",this.svgHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
                            .style("bgcolor","green")
                            .classed("tile",true);
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    };

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
        });
        text += "</ul>";

        return text;
    };

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale){

            //Calculates the maximum number of columns to be laid out on the svg
            this.maxColumns = d3.max(electionResult,function(d){
                                    return parseInt(d["Space"]);
                                }) +1;

            //Calculates the maximum number of rows to be laid out on the svg
            this.maxRows = d3.max(electionResult,function(d){
                                    return parseInt(d["Row"]);
                            }) +1;

            var tileHeight = parseInt(this.svgHeight/this.maxRows);
            var tileWidth = parseInt(this.svgWidth/this.maxColumns);

            //Creates a legend element and assigns a scale that needs to be visualized
            this.legendSvg.append("g")
                .attr("class", "legendQuantile")
               // .attr("transform", "translate(125,50)");
                .attr("transform", "translate(" + this.margin.left + ",0)");
        

            let legendQuantile = d3.legendColor()
                .shapeWidth(75)
                .shapeHeight(5)
                .cells(10)
                .orient('horizontal')
                .scale(colorScale);

            this.legendSvg.select(".legendQuantile")
                .call(legendQuantile);

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
            let tip = d3.tip().attr('class', 'd3-tip')
                .direction('se')
                .offset(function() {
                    return [0,0];
                })
                .html((d)=>{
                var tooltip_data = {
                    "state": d.State,
                    "winner":d.State_Winner,
                    "electoralVotes" : parseFloat(d.Total_EV),
                    "result":[
                        {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
                        {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"}
                    ]
                };
                if (d.I_Percentage != "")
                    tooltip_data.result.push({"nominee": d.I_Nominee_prop,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"});

                return this.tooltip_render(tooltip_data);

                });
                    /* populate data in the following format
                      tooltip_data = {
                     * "state": State,
                     * "winner":d.State_Winner
                     * "electoralVotes" : Total_EV
                     * "result":[
                     * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
                     * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
                     * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
                     * ]
                     * }
                     * pass this as an argument to the tooltip_render function then,
                     * return the HTML content returned from that method.
                     * */

        this.svg.call(tip);
        var selection = this.svg.selectAll("rect")
                        .data(electionResult);

    selection.exit().remove();

    selection.attr("x",function(d) { return d.Space * tileWidth; })
        .attr("y", function(d) { return d.Row * tileHeight; })
        .attr("width", tileWidth)
        .attr("height", tileHeight)
        .style("fill", function(d) { return ((parseFloat(d.RD_Difference) != 0) ? colorScale(parseFloat(d.RD_Difference)) : "#008000"); });

    selection.enter()
        .append("rect")
        .attr("x",function(d) { return d.Space * tileWidth; })
        .attr("y", function(d) { return d.Row * tileHeight; })
        .attr("width", tileWidth)
        .attr("height", tileHeight)
        .style("fill", function(d) { return ((parseFloat(d.RD_Difference) != 0) ? colorScale(parseFloat(d.RD_Difference)) : "#008000"); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    var abbrTextSelection = this.svg.selectAll("text.abbr")
        .data(electionResult);

    abbrTextSelection.exit().remove();

    abbrTextSelection
        .attr("dx",function(d) { return (d.Space * tileWidth) + (tileWidth/2); })
        .attr("dy", function(d) { return (d.Row * tileHeight) + (tileHeight/2); })
        .text(function(d) { return d.Abbreviation; });

    abbrTextSelection.enter()
        .append("text")
        .classed("abbr",true)
        .classed("tilestext",true)
        .attr("dx",function(d) { return (d.Space * tileWidth) + (tileWidth/2); })
        .attr("dy", function(d) { return (d.Row * tileHeight) + (tileHeight/2); })
        .text(function(d) { return d.Abbreviation; })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    var valTextSelection = this.svg.selectAll("text.val")
        .data(electionResult);

    valTextSelection.exit().remove();

    valTextSelection
        .attr("dx",function(d) { return (d.Space * tileWidth) + (tileWidth/2); })
        .attr("dy", function(d) { return (d.Row * tileHeight) + (tileHeight/2) + 15; })
        .text(function(d) { return d.Total_EV; });

    valTextSelection.enter()
        .append("text")
        .classed("val",true)
        .classed("tilestext",true)
        .attr("dx",function(d) { return (d.Space * tileWidth) + (tileWidth/2); })
        .attr("dy", function(d) { return (d.Row * tileHeight) + (tileHeight/2) + 15; })
        .text(function(d) { return d.Total_EV; })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);


            // ******* TODO: PART IV *******
            //Tansform the legend element to appear in the center and make a call to this element for it to display.

            //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

            //Display the state abbreviation and number of electoral votes on each of these rectangles

            //Use global color scale to color code the tiles.

            //HINT: Use .tile class to style your tiles;
            // .tilestext to style the text corresponding to tiles

            //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
            //then, vote percentage and number of votes won by each party.
            //HINT: Use the .republican, .democrat and .independent classes to style your elements.
    
    };


}
