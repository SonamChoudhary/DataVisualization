/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor(tableElements) {
        this.tableElements= tableElements;
          
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {
        // ******* TODO: PART VI *******
    var root = d3.stratify()
        .id(function(d) { return d.id; })
        .parentId(function(d) { if (d.ParentGame != "") return treeData[d.ParentGame].id; else return null;})
        (treeData);
    var tree = d3.tree()
        .size([800,300]);
    tree(root);
    var g = d3.select("#tree")
        .attr("transform", "translate(100,0)");
    var tree_link = g.selectAll("path")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .classed("link", true)
        .classed("selected",false)
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        });
    var tree_node = g.selectAll("circle")
        .data(root.descendants())
        .enter().append("g")
        .classed("node circle", true)
        .classed("winner circle",function(d) { return d.data.Wins== "1";})
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    tree_node.append("circle")
        .attr("r", 5)
        .classed("node circle",true);
        

    tree_node.append("text")
        .attr("x", function(d) { return d.children ? -5 : 5; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.data.Team; });

}

        //Create a tree and give it a size() of 800 by 300. 


        //Create a root for the tree using d3.stratify(); 

        
        //Add nodes and links to the tree. 

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        this.clearTree(); 
       //var table = new Table();
       var data = this.tableElements;
      // console.log("--------updateTree--------", this.tableElements);
    if (data[row].value.Result.ranking == "0")
        return;
    else
    {
        if (data[row].value.type == "aggregate")
        {
            d3.select("#tree").selectAll("path")
                .each(function(d) {
                    //onsole.log("in tree----",this.tableElements[row].key);
                    if (d.data.Team == data[row].key && d.data.Wins == "1") 
                    {
                        d3.select(this).classed("selected", true);
                    }
                });
        } else {
            d3.select("#tree").selectAll("path")
                .each(function(d) {

                    if(d.data.Team == data[row].key && d.data.Opponent == data[row].value.Opponent)
                        d3.select(this).classed("selected", true);

                    if(d.data.Opponent == data[row].key && d.data.Team == data[row].value.Opponent)
                        d3.select(this).classed("selected", true);
                });
        }
    }


    
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        d3.select("#tree")
        .selectAll("path.selected")
        .classed("selected",false);

        // You only need two lines of code for this! No loops! 
    }
}
