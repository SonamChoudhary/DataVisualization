/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) {
		this.tree_nodes = [];
		var len = json.length;
		for (var i=0; i<json.length; i++)
		{
			this.tree_nodes[i] = new Node(json[i].name,json[i].parent);
			this.tree_nodes[i].parentNode = null;
			this.tree_nodes[i].children=[];
		    this.tree_nodes[i].level=null;
			this.tree_nodes[i].position=-1;
		}
		for(var j=0; j<len;j++)
		{
			for( var k=1; k<len;k++)
			{
				if( this.tree_nodes[k].parentName == this.tree_nodes[j].name)
					{
						this.tree_nodes[k].parentNode = this.tree_nodes[j];	
					}	
									
			}
		}		
		
	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
		var len = this.tree_nodes.length;
		for(var i =0; i<len;i++)
		{ 
			for(var j=1;j<len;j++)
			{
				
				if(this.tree_nodes[j].parentName == this.tree_nodes[i].name)
				{
					this.tree_nodes[i].children.push(this.tree_nodes[j]);

					
				}				
			
			}
			
		}
		
		for(var s=0; s<len;s++)			
		{
			this.assignLevel(this.tree_nodes[s],this.tree_nodes[s].level);
		}
		
		this.assignPosition(this.tree_nodes,this.tree_nodes[0].position);
			
		
	//Assign Positions and Levels by making calls to assignPosition() and assignLevel()
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
		var lev_arr_thr= node.filter(function(n){ return n.level==3});
		for (var i=0;i<node.length;i++)
		{
			if(node[i].parentName == "root")
			{
				node[i].position=0;
			}
			for(var j=0;j<node[i].children.length;j++)
			{
				var level_arr= node.filter(function(n){ return n.level==node[i].children[j].level});
				var pos = level_arr.findIndex(x => x.name==node[i].children[j].name);
				if(j==0)
					{
						if(node[i].children[j].parentNode.position > pos) 
						{ 

							//console.log(node[i].children[j].parentNode.position +"------ Name: "+ node[i].children[j].name);
							node[i].children[j].position=node[i].children[j].parentNode.position;
						}
						else
						{
							node[i].children[j].position=pos;
						}

					}
				else
				{
					node[i].children[j].position=node[i].children[j-1].position+1;
					position+=1;	
				}		
				
				
			}
	
		}
	}		
	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
		if (node.parentName == "root")
		{
			node.level=0;
		}
		else
		{
			for(var i =0; i<node.children.length; i++)
			{
				node.children[i].level=node.level+1;
			} 
			node.level+=1;
		}	
		
	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {
		this.tree_nodes[0].parentNode=this.tree_nodes[0];
		var wide =200;
		//console.log(this.tree_nodes[0].name);
		var svg = d3.select("body").append("svg")
					.attr("width",1500)
					.attr("height",1500);
		var edges = svg.selectAll("line")
						.data(this.tree_nodes)
						.enter().append("line")
						.attr("x1", function(node){ return 180+node.level*wide})
						.attr("y1", function(node){ return 180+node.position*wide})
						.attr("x2", function(node){ return 180+node.parentNode.level*wide})
						.attr("y2", function(node){ return 180+node.parentNode.position*wide});
		var circle = svg.selectAll("circle")
						.data(this.tree_nodes)
						.enter().append("circle")
						.attr("cx", function(node){ return 180+node.level*wide})
						.attr("cy", function(node){ return 180+node.position*wide})
						.attr("r",40);
		var label =	svg.selectAll("text")
						.data(this.tree_nodes)
						.enter().append("text")
						.text(function(node){return node.name})
						.attr("x",function(node){ return 160+node.level*wide})
						.attr("y",function(node){ return 180+node.position*wide});
															
					}
		
}