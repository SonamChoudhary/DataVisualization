/** Class implementing the votePercentageChart. */
class VotePercentageChart 
{

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor()
    {
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight);

	    this.svg.append("g")
        	.classed("votesPercentage",true);

	    this.svg.append("g")
	        .append("rect")
	        .attr("x",this.svgWidth/2)
	        .attr("y",75)
	        .attr("width",3)
	        .attr("height",35)
	        .classed("middlePoint",true);

	    this.svg.append("text")
	        .classed("votesPercentageNote",true)
	        .attr("dx", this.svgWidth/2)
	        .attr("dy",60)
	        .text("Popular Vote(50%)");

	    this.svg.append("g")
	        .classed("nomineeInfoText",true);

	    this.svg.append("g")
	        .classed("votesPercentageText",true);

    };


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data)
	{
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	};

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data)
	{
		//var that=this;
	    let text = "<ul>";
	   // console.log("----",tooltip_data);
	    tooltip_data.forEach((row)=>{
	    text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.value+"%)" + "</li>"
	    });

	    return text;
	};

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult)
	{
	    var data = [];
    	if (electionResult.I_PopularPercentage != "")
        {
        	data.push({party:"I", value:parseFloat(electionResult.I_PopularPercentage), nominee:electionResult.I_Nominee_prop, votecount:electionResult.I_Votes_Total, parentref:this });
    	}
    	data.push({party:"D", value:parseFloat(electionResult.D_PopularPercentage), nominee:electionResult.D_Nominee_prop, votecount:electionResult.D_Votes_Total, parentref:this});
    	data.push({party:"R", value:parseFloat(electionResult.R_PopularPercentage), nominee:electionResult.R_Nominee_prop, votecount:electionResult.R_Votes_Total, parentref:this});
		this.data=data;
	        //for reference:https://github.com/Caged/d3-tip
	        //Use this tool tip element to handle any hover over the chart
	    let tip = d3.tip().attr('class', 'd3-tip')
	            	.direction('s')
	            	.offset(function() {
	                	return [0,150];
	            	})
	            	.html((d)=> {
	                /* populate data in the following format
	                 * tooltip_data = {
	                 * "result":[
	                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
	                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
	                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
	                 * ]
	                 * }
	                 * pass this as an argument to the tooltip_render function then,
	                 * return the HTML content returned from that method.
	                 * */
	               	return this.tooltip_render(d.parentref.data);
		        });
			
		this.svg.call(tip);
		var curX = 0;
		var prevEV = 0;
		this.widthScale = d3.scaleLinear()
		        			.domain([0,d3.sum(data,function(d) { return d.value; })])
		        			.range([0,this.svgWidth]);
		var nomineeText = this.svg.select("g.nomineeInfoText")
		        			.selectAll("text")
		        			.data(data);

		nomineeText.exit().remove();
		nomineeText.text(function(d) { return d.nominee; })
		        	.attr("dx",(d,i)=> {
		            if (data.length == 3)
		            {
		                if (i == 0)
		                    return this.widthScale(data[0].value/2);
		                else if (i == 1)
		                    return this.widthScale(data[0].value + data[1].value/2);
		                else if (i == 2)
		                    return this.widthScale(data[0].value + data[1].value + data[2].value/2);
		            } else {
		                if (i == 0)
		                    return this.widthScale(data[0].value/2);
		                else if (i == 1)
		                    return this.widthScale(data[0].value + data[1].value/2);
		            }
		        })
		        .attr("class",(d)=> {
		            return this.chooseClass(d.party);
		        })
		nomineeText.enter().append("text")
		        	.attr("dx",(d,i)=> {
		            if (data.length == 3)
		            {
		                if (i == 0)
		                    return this.widthScale(data[0].value/2);
		                else if (i == 1)
		                    return this.widthScale(data[0].value + data[1].value/2);
		                else if (i == 2)
		                    return this.widthScale(data[0].value + data[1].value + data[2].value/2);
		            } else {
		                if (i == 0)
		                    return this.widthScale(data[0].value/2);
		                else if (i == 1)
		                    return this.widthScale(data[0].value + data[1].value/2);
		            }
		        })
		        .attr("dy",30)
		        .text(function(d) { return d.nominee; })
		        .attr("class",(d)=> {
		            return this.chooseClass(d.party);
		        });
		var textSelection = this.svg.select("g.votesPercentageText")
		        .selectAll("text")
		        .data(data);
		textSelection.exit().remove();
		textSelection.text(function(d) { return d.value; })
		        .attr("dx",(d,i)=> {
		        if (data.length == 3)
		            {
		                if (i == 0)
		                    return 0;
		                else if (i == 1)
		                    return this.widthScale(data[0].value);
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
		            return this.chooseClass(d.party);
		        })
		textSelection.enter()
		        .append("text")
		        .attr("dx",(d,i)=> {
		            if (data.length == 3)
		            {
		                if (i == 0)
		                    return 0;
		                else if (i == 1)
		                    return this.widthScale(data[0].value);
		                else if (i == 2)
		                    return this.svgWidth;
		            } else {
		                if (i == 0)
		                    return 0;
		                else if (i == 1)
		                    return this.svgWidth;
		            }
		        })
		        .attr("dy",70)
		        .text(function(d) { return d.value; })
		        .attr("class",(d)=> {
		            return this.chooseClass(d.party);
		        });
		var selection = this.svg.select("g.votesPercentage")
		        .selectAll("rect")
		        .data(data);
		selection.exit().remove();
		selection.attr("x", (d)=> {
		        var x = curX;
		        curX += (this.widthScale(prevEV + parseFloat(d.value)));
		        return x;
		        })
		        .attr("width", (d)=> {
		            var w = this.widthScale(parseFloat(d.value));
		            prevEV += parseFloat(d.value);
		            return w;
		        })
		        .attr("class",(d)=> {
		            return this.chooseClass(d.party);
		        });
		selection.enter().append("rect")
		        .attr("x", (d)=> {
		            var x = curX;
		            curX += (this.widthScale(prevEV + parseFloat(d.value)));
		            return x;
		        })
		        .attr("y", 80)
		        .attr("height", 25)
		        .attr("width", (d)=> {
		            var w = this.widthScale(parseFloat(d.value));
		            prevEV += parseFloat(d.value);
		            return w;
		        })
		        .attr("class",(d)=> {
		            return this.chooseClass(d.party);
		        })
		        .on("mouseover", tip.show)
		        .on("mouseout", tip.hide);
			
	};

}
   			
   			  // ******* TODO: PART III *******
   			
		    //Create the stacked bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.

		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.
