/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css
    var clear_map = d3.select("#map");
    clear_map.selectAll("circle").remove();
    clear_map.selectAll(".host")
        .classed("host",false);
    clear_map.selectAll(".team")
        .classed("team",false);    

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();
        var projection = d3.geoConicConformal().scale(150).translate([400, 350]);

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.
        var map = d3.select("#map");
        var runner_up = map.selectAll("circle.silver")
                        .data([worldcupData.ru_pos]);
           // runner_up.exit().remove();            
        runner_up=runner_up.enter()
                    .append("circle").merge(runner_up);
        runner_up.attr("cx", function(d) {
                    return projection(d)[0];
                    })
                    .attr("cy", function(d) {
                    return projection(d)[1];
                    })
                    .attr("r",5)
                    .classed("silver",true);


        var winner = map.selectAll("circle.gold")
                        .data([worldcupData.win_pos]);
            //winner.exit().remove();            
        winner=winner.enter()
                    .append("circle").merge(winner);
        winner.attr("cx", function(d) {
                    return projection(d)[0];
                    })
                    .attr("cy", function(d) {
                    return projection(d)[1];
                    })
                    .attr("r",5)
                    .classed("gold",true);

    var host_country = "#" + worldcupData.host_country_code;
    d3.select(host_country).classed("host",true);
    for(var i = 0; i < worldcupData.teams_iso.length; i++) {
        var list_team = "#" + worldcupData.teams_iso[i];
        d3.select(list_team).classed("team",true);
    }
}    

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world){

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

    var geo_path = d3.geoPath().projection(this.projection);
    var geo_graticule = d3.geoGraticule();
    var draw_map = d3.select("#map");

    draw_map.selectAll("path.countries")
        .data(topojson.feature(world,world.objects.countries).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .classed("countries",true)
        .attr("d",geo_path );

    draw_map.append("path")
        .datum(geo_graticule)
        .attr("class","grat")
        .attr("d",geo_path);

    }


}
