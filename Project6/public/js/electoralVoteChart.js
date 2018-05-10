   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        this.brush=null;
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;
        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight);

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
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    };


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale) {
          // ******* TODO: PART II *******
    //var shiftChart = new ShiftChart();      
    this.svg.append("g")
        .classed("electoralVotes",true);
    this.svg.append("g")
        .append("rect")
        .attr("x",this.svgWidth/2)
        .attr("y",45)
        .attr("width",3)
        .attr("height",35)
        .classed("middlePoint",true);
    this.svg.append("text")
        .classed("electoralVotesNote",true)
        .attr("dx", this.svgWidth/2)
        .attr("dy",20)
        .text("Electoral Vote (270 needed to win)");
    this.svg.append("g").classed("electoralVoteText",true);
    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    var curX = 0;
    var prevEV = 0;
    var result_list= [];
    var I_won = electionResult.filter(x => parseFloat(x.RD_Difference) == 0);
    electionResult = electionResult.filter(x => parseFloat(x.RD_Difference) != 0);
    var R_won = electionResult.filter(x => parseFloat(x.RD_Difference) > 0);
    var D_won = electionResult.filter(x => parseFloat(x.RD_Difference) < 0);
    if (I_won.length > 0)
        result_list.push({Party:"I" , value:d3.sum(I_won, function(d) { return parseFloat(d.Total_EV); })});
    result_list.push({Party:"D" , value:d3.sum(D_won, function(d) { return parseFloat(d.Total_EV); })});
    result_list.push({Party:"R" , value:d3.sum(R_won, function(d) { return parseFloat(d.Total_EV); })});    
    electionResult.sort(function(a,b) { return parseFloat(a.RD_Difference) - parseFloat(b.RD_Difference)});
    electionResult = I_won.concat(electionResult);
    var totalWidthDomain = d3.sum(electionResult, function(d) { return parseFloat(d.Total_EV); });
    this.widthScale = d3.scaleLinear()
        .domain([0,totalWidthDomain])
        .range([0,this.svgWidth]);
    var bar_text = this.svg.select("g.electoralVoteText")
        .selectAll("text")
        .data(result_list);
    bar_text.exit().remove();
    bar_text.text(function(d) { return d.value; })
        .attr("dx",(d,i)=> {
            if (result_list.length == 3)
            {
                if (i == 0)
                    return 0;
                else if (i == 1)
                    return this.widthScale(result_list[0].value);
                else if (i == 2)
                    return this.svgWidth;
            } else {
                if (i == 0)
                    return 0;
                else if (i == 1)
                    return this.svgWidth;
            }
        })
        .attr("class",(d)=> {
            return this.chooseClass(d.Party);
        });
    bar_text.enter()
        .append("text")
        .attr("dx",(d,i)=> {
            if (result_list.length == 3)
            {
                if (i == 0)
                    return 0;
                else if (i == 1)
                    return this.widthScale(result_list[0].value);
                else if (i == 2)
                    return this.svgWidth;
            } else {
                if (i == 0)
                    return 0;
                else if (i == 1)
                    return this.svgWidth;
            }
        })
        .attr("dy",40)
        .text(function(d) { return d.value; })
        .attr("class",(d)=> {
            return this.chooseClass(d.Party);
        });
    var selection = this.svg.select("g.electoralVotes")
        .selectAll("rect")
        .data(electionResult);
    selection.exit().remove();
    selection.attr("x", (d)=> {
                var x = curX;
                curX += (this.widthScale(prevEV + parseFloat(d.Total_EV)));
                return x;
                })
            .attr("y", 50)
            .attr("height", 25)
            .attr("width", (d)=> {
                var w = this.widthScale(parseFloat(d.Total_EV));
                prevEV += parseFloat(d.Total_EV);
                return w;
                })
            .attr("fill",function(d) {
                return ((parseFloat(d.RD_Difference) != 0) ? colorScale(parseFloat(d.RD_Difference)) : "#008000");
                });

    selection.enter().append("rect")
            .attr("x", (d)=> {
                var x = curX;
                curX += (this.widthScale(prevEV + parseFloat(d.Total_EV)));
                return x;
                })
            .attr("y", 50)
            .attr("height", 25)
            .attr("width", (d)=> {
                var w = this.widthScale(parseFloat(d.Total_EV));
                prevEV += parseFloat(d.Total_EV);
                return w;
                })
            .attr("fill",function(d) {
                    return ((parseFloat(d.RD_Difference) != 0) ? colorScale(parseFloat(d.RD_Difference)) : "#008000");
                });
    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
        if (!this.brush)
            {
                this.brush = d3.brushX()
                            .extent([[0,0],[this.svgWidth,45]])
                            .on("end", ()=> {
                                if (!d3.event.sourceEvent) return; // Only transition after input.
                                if (!d3.event.selection) return;
                                var startIndex = -1,endIndex = -1;
                                this.svg.select("g.electoralVotes")
                                        .selectAll("rect")
                                        .each(function(d,i){
                                            var x = parseFloat(d3.select(this).attr("x"));
                                            var width = parseFloat(d3.select(this).attr("width"));
                                            if (startIndex == -1 && x <= d3.event.selection[0] && (x + width) >= d3.event.selection[0])
                                            {
                                                startIndex = i;
                                            } 
                                            else if (startIndex != -1 && endIndex == -1 && x <= d3.event.selection[1] && (x + width) >= d3.event.selection[1])
                                            {
                                                endIndex = i;
                                            }
                                                });
                                if (endIndex != -1)
                                    {
                                //console.log("hiiii-----if",electionResult.slice(startIndex,endIndex + 1));
                                this.shiftChart.update(electionResult.slice(startIndex,endIndex + 1));
                                 //this.shiftChart.update([electionResult[startIndex]]);
                                    }
                                else
                    {
                        //console.log("hiiii-----else");
                        this.shiftChart.update([electionResult[startIndex]]);
                                    }
                                });
            } 
            else
            {
                this.svg.select("g.brush").remove();
            }
            this.svg.append("g")
                .classed("brush", true)
                .attr("transform", "translate(0," + 40 + ")")
                .call(this.brush);
        };
}

    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.   

