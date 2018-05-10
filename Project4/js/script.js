
// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, allData) {
    allData.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        // Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
    });

    /* Create infoPanel, barChart and Map objects  */
    let infoPanel = new InfoPanel();
    let worldMap = new Map();

    /* DATA LOADING */
    //Load in json data to make map
    d3.json("data/world.json", function (error, world) {
        if (error) throw error;
        worldMap.drawMap(world);
    });

    // Define this as a global variable
    window.barChart = new BarChart(worldMap, infoPanel, allData);

    // Draw the Bar chart for the first time
    barChart.updateBarChart('attendance');
});

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
    // ******* TODO: PART I *******
    // Changed the selected data when a user selects a different
    // menu item from the drop down.
    var selected_dataset = document.getElementById('dataset').value;
    barChart.updateBarChart(selected_dataset);


}
