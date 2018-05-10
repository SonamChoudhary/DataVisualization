/** Class implementing the shiftChart. */
class ShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        //console.log("constructor-----");
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
        this.svgBounds = this.divShiftChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = this.divShiftChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedStates){
        console.log("selectedStates--");
        var selectedStates_List = d3.select("#stateList")
                                .selectAll("li")
                                .data(selectedStates);
        selectedStates_List.text(function(d) { return d.State; });
        //console.log("selectedStates--",selectedStatesList);
        selectedStates_List.enter().append("li")
                        .text(function(d) { return d.State; });
         selectedStates_List.exit().remove();

         };
     // ******* TODO: PART V *******
    //Display the names of selected states in a list

    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

   


}
