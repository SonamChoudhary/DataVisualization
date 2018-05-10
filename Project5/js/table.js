8/** Class implementing the table. */
//var tableElements;
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        //this.tree = null; 
        this.tree=treeObject;
        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
       // this.tableElements = null; // 
        this.tableElements = null;
       // teamData.slice();
        ///** Store all match data for the 2014 Fifa cup */
       // this.teamData = null;
        this.teamData = teamData;
        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******
        this.tableElements = this.teamData.slice();
        this.goalScale = d3.scaleLinear()
            .range([this.cell.buffer, 2 *this.cell.width - this.cell.buffer])
            .domain([0, d3.max(this.teamData, function(d) { return d3.max([d.value["Goals Made"],d.value["Goals Conceded"]]); })]);
        this.gameScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer])
            .domain([0, d3.max(this.teamData, function(d) { return d.value.TotalGames; })]);
        this.aggregateColorScale = d3.scaleLinear()
            .range(['#ece2f0', '#016450'])    
            .domain([0, d3.max(this.teamData, function(d) { return d.value.TotalGames; })]);
        this.goalColorScale = d3.scaleQuantize()
            .range(['#cb181d', '#034e7b'])   
            .domain([-1, 1]);
             
        var xAxis = d3.axisTop()
        .ticks(d3.max(this.teamData, function(d) { return d3.max([d.value["Goals Made"],d.value["Goals Conceded"]]); })/2)
        .scale(this.goalScale);

        //add GoalAxis to header of col 1.
        d3.select("#goalHeader")
        .append("svg")
        .attr("width", 2 * this.cell.width)
        .attr("height", this.cell.height)
        .append("g")
        .attr("transform", "translate(4," + (this.cell.height - 1) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("font-size","8px");
        // ******* TODO: PART V *******
        var return_val;
        // Set sorting callback for clicking on headers
        d3.select("#matchTable")
        .select("thead")
        .select("tr")
        .selectAll("td,th")
        .on("click", ()=> {
            this.collapseList();
            var sort_by = d3.select(d3.event.target).text();
            var desc_sort = d3.select(d3.event.target).classed("descending");
            this.tableElements.sort(function(a,b) { 
                if (sort_by == "Team") {
                    if (desc_sort == false)
                     {
                        if (a.key < b.key)
                            return -1;
                        if (a.key > b.key)
                            return 1;
                        return  0;
                    } 
                    else
                    {
                        if (a.key < b.key)
                            return 1;
                        if (a.key > b.key)
                            return -1;
                        return  0;
                    }
                } else if (sort_by == "Delta Goals") {
                    console.log("sort by-----", sort_by );
                    return_val= (b.value["Delta Goals"] - a.value["Delta Goals"]);
                    //return_val = b.value["Delta Goals"];
                } else if (sort_by == "Wins") {
                   // console.log("sort by---wins--", sort_by );
                    return_val= (b.value["Wins"] - a.value["Wins"]);
                } else if (sort_by == "Losses") {
                    return_val= (b.value["Losses"] - a.value["Losses"]);
                } else if (sort_by == "Total Games") {
                    return_val= (b.value["TotalGames"] - a.value["TotalGames"]);
                } else if (sort_by == "Round/Result") {
                    return_val= (b.value["Result"].ranking - a.value["Result"].ranking);
                }
                if (!desc_sort)
                    return return_val;
                else
                    return (return_val* -1);
            });
            // Clicking on headers should also trigger collapseList() and updateTable().
            d3.select(d3.event.target).classed("descending",!desc_sort);
            this.updateTable();
        });         
       
    }

    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
 
        // ******* TODO: PART III *******
        var tree = new Tree(this.tableElements);
        var table = d3.select("#matchTable");
        var t_rows = table.select("tbody")
            .selectAll("tr")
            .data(this.tableElements)
           .on("mouseenter", function(d){
           //console.log("********************",this.tableElements);
            tree.updateTree(this.rowIndex - 2);
        })
        .on("mouseleave", function(d) {
            tree.clearTree();
        });
        t_rows.exit().remove();
        t_rows = t_rows.enter().append("tr")
                .on("mouseenter", function(d){
           // console.log("-----------",d.value.type);
          tree.updateTree(this.rowIndex - 2);
        })
        .on("mouseleave", function(d) {
            tree.clearTree();
        })
        .merge(t_rows);

    var t_columns = t_rows.selectAll("td")
        .data(function(d) {
            var list_values = [];
            var goalInfo = {"Made": d.value["Goals Made"], "Conceded": d.value["Goals Conceded"]};
            var type = d.value.type;
            if (type == "aggregate") {
                list_values.push({"type": type, "vis": "ctext", "value": d.key});
                list_values.push({"type": type, "vis": "goals", "value": goalInfo});
                list_values.push({"type": type, "vis": "text", "value": d.value.Result.label});
                list_values.push({"type": type, "vis": "bars", "value": d.value.Wins});
                list_values.push({"type": type, "vis": "bars", "value": d.value.Losses});
                list_values.push({"type": type, "vis": "bars", "value": d.value.TotalGames});
                 } 
            else {
                list_values.push({"type": type, "vis": "ctext", "value": d.key});
                list_values.push({"type": type, "vis": "goals", "value": goalInfo});
                list_values.push({"type": type, "vis": "text", "value": d.value.Result.label});
                list_values.push({"type": type, "vis": "bars", "value": null});
                list_values.push({"type": type, "vis": "bars", "value": null});
                list_values.push({"type": type, "vis": "bars", "value": null});
            }

            return list_values;
        });

    t_columns.exit().remove();
    t_columns = t_columns.enter()
        .append("td")
        .merge(t_columns);

    var classed_cell_text = t_columns.filter(function (d){
            return d.vis == "ctext";
        })
        .classed("aggregate",function(d) { return d.type=="aggregate";})
        .classed("game",function(d) { return d.type =="game"; })
        .text(function(d) {
            if (d.type == "aggregate")
                return d.value;
            else
                return "x" + d.value;
        })
        .on("click",(d)=> {
            if (d.type == "game")
                return;
            this.updateList(d3.event.target.parentNode.rowIndex - 2);
        });
        //this.updateList(this.parentNode.rowIndex - 2);
    var cell_text = t_columns.filter(function (d){
            return d.vis == "text";})
        .text(function(d) { return d.value; });

    var cell_bar = t_columns.filter(function (d){
            return (d.vis == "bars");})
        .selectAll("svg")
        .data(function(d) {  return [d.value]; });
    cell_bar.exit().remove();
    var svgs = cell_bar.enter()
        .append("svg")
        .attr("width", this.cell.width)
        .attr("height", this.cell.height)
        .merge(cell_bar);
    var bars = svgs.selectAll("rect")
        .data(function(d) { return [d]; });
    bars.exit().remove();
    bars.attr("x",0)
        .attr("y",0)
        .attr("width", (d)=> { return this.gameScale(d); })
        .attr("height", this.bar.height)
        .attr("fill",(d)=> { return this.aggregateColorScale(d); });
    bars.enter()
        .append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("width", (d)=> { return  this.gameScale(d); })
        .attr("height", this.bar.height )
        .attr("fill",(d)=> { return this.aggregateColorScale(d); });
    var labels = svgs.selectAll("text")
        .data(function(d) {return [d];});

    labels.exit().remove();

    labels.attr("class", "value")
        .attr("y", this.cell.height/2)
        .attr("x", (d)=> { return  this.gameScale(d);}) 
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .classed("label",true)
        .text(function(d){ return d;});

    labels.enter()
        .append("text")
        .attr("class", "value")
        .attr("y", this.cell.height/2)
        .attr("x", (d)=> { return this.gameScale(d);}) 
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .classed("label",true)
        .text(function(d){ return d;});

    var goals = t_columns.filter(function (d){
            return d.vis == "goals";})
        .selectAll("svg")
        .data(function(d) { return [{"type":d.type,"value":d.value}]; });
    goals.exit().remove();
    var gsvgs = goals.enter()
        .append("svg")
        .attr("width", 2*this.cell.width)
        .attr("height", this.cell.height)
        .merge(goals);
    var goal_bars = gsvgs.selectAll("rect")
        .data(function(d) { return [d]; });
    //goal_bars.exit().remove();
        goal_bars.attr("x", (d)=> {
            if(d.value.Made < d.value.Conceded)
                return this.goalScale(d.value.Made)
            else 
                return this.goalScale(d.value.Conceded);
        })
        .attr("y",(d)=> {
        if (d.type == "aggregate")
            return this.cell.height/4; 
        else 
            return 3 * this.cell.height/8; })
        .attr("width", (d)=> { return Math.abs(this.goalScale(d.value.Made)-this.goalScale(d.value.Conceded)); })
        .attr("height", (d)=> { if (d.type == "aggregate") return this.cell.height/2; else return this.cell.height/4; })
        .attr("fill", (d)=> { return this.goalColorScale(Math.sign(d.value.Made-d.value.Conceded)); });
    goal_bars.enter()
        .append("rect")
        .classed("goalBar", true)
        .attr("x", (d)=> {
            if(d.value.Made < d.value.Conceded)
                return this.goalScale(d.value.Made)
            else
                return this.goalScale(d.value.Conceded);
        })
        .attr("y",(d)=> { if (d.type == "aggregate") return this.cell.height/4; else return 3 * this.cell.height/8; })
        .attr("width", (d)=> { return Math.abs(this.goalScale(d.value.Made)-this.goalScale(d.value.Conceded)); })
        .attr("height", (d)=> { if (d.type == "aggregate") return this.cell.height/2; else return this.cell.height/4;} )
        .attr("fill",(d)=> { return this.goalColorScale(Math.sign(d.value.Made-d.value.Conceded)); });
    var goal_circles = gsvgs.selectAll("circle")
        .data(function(d) {
            if (d.value.Made == d.value.Conceded)
                return [{"type": d.type, "value":d.value.Made, "color":"#777777"}];
            else
                return [{"type": d.type, "value":d.value.Made, "color":"#034e7b"}, {"type": d.type, "value":d.value.Conceded, "color":"#cb171c"}];
        });

    goal_circles.exit().remove();
    goal_circles
        .attr("cx", (d)=> { return this.goalScale(d.value); })
        .attr("cy", this.cell.height/2)
        .attr("stroke", function(d) { return d.color; })
        .attr("fill", function(d) { if (d.type == "aggregate") return d.color; else return "white"; });
    goal_circles.enter()
        .append("circle")
        .classed("goalCircle",true)
        .attr("cx", (d)=> { return this.goalScale(d.value); })
        .attr("cy", this.cell.height/2)
        .attr("stroke", function(d) { return d.color; })
        .attr("fill", function(d) { if (d.type == "aggregate") return d.color; else return "white"; })
        .merge(goal_circles);    
        }

        //Append th elements for the Team Names

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray


    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        if (i == (this.tableElements.length - 1) || this.tableElements[i+1].value.type == "aggregate")
    {
        this.tableElements.splice.apply(this.tableElements, [i+1,0].concat(this.tableElements[i].value.games));

    } else if ( this.tableElements[i+1].value.type == "game" ){

        this.tableElements.splice(i+1,this.tableElements[i].value.games.length);
    }

    this.updateTable();
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        this.tableElements = this.tableElements.filter(function( obj ) {
        return obj.value.type !== "game";
    });
    }

}
