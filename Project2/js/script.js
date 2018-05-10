/**
* Requests the file and executes a callback with the parsed result once
* it is available
* @param {path} file path
* @param {callback} callback to execute once the result is available
*/
function fetchJSONFile(path, callback) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				let data = JSON.parse(httpRequest.responseText);
				if (callback) callback(data);
			}
		}
	};
	httpRequest.open('GET', path);
	httpRequest.send();
}

//call fetchJSONFile then build and render a tree
fetchJSONFile('data/Tree.json', function(data) {
	let tree = new Tree(data);
	tree.buildTree();
	tree.renderTree();
});