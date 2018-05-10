/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

   // console.log("In update Info");
    document.getElementById("host").textContent=oneWorldCup.host;
    document.getElementById("winner").textContent=oneWorldCup.winner;
    document.getElementById("silver").textContent=oneWorldCup.runner_up;
    document.getElementById("edition").textContent=oneWorldCup.EDITION;

    var teams_ = d3.select("#teams")
        .selectAll("li")
        .data(oneWorldCup.teams_names);
    teams_.text(function(d) { return d; });
    teams_.enter().append("li")
        .text(function(d) { return d; });
    teams_.exit().remove();


        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels

    }

}