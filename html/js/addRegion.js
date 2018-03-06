var button = document.getElementById("add");
var pointButton = document.getElementById("addPoint");
var url = "http://localhost:3000/regions";
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");
var head = document.getElementById("header");
var pointsJSON = {"points":[]};
var body = document.getElementById("body");

bootstrapValidate('#name', 'max:30: Name should be less than 30 characters');
bootstrapValidate('#descr', 'max:100: Description should be less than 100 characters');
bootstrapValidate('#x', 'numeric: Should be numeric');
bootstrapValidate('#y', 'numeric: Should be numeric');

function render(x, y){
	var field = document.createElement("tr");

	var h = document.createElement("td");
	h.appendChild(document.createTextNode(x));
	field.appendChild(h);

	h = document.createElement("td");
	h.appendChild(document.createTextNode(y));
	field.appendChild(h);			

	body.appendChild(field);
}

if ((id==0) || (id==null)) {
	button.addEventListener("click", addRegion);
	button.value = "Add";
}
else {
	fetch(url+"/id"+id)
	.then((resp) => resp.json())
	.then(function(data) {
		document.getElementById("name").value = data[0].name;
		document.getElementById("descr").value = data[0].description;
	})			
	.catch(function(err) {
		console.log(err);
	});
	button.addEventListener("click", editRegion);
	button.value = "Save";
	head.innerHTML = "Edit region";
}

pointButton.addEventListener("click", addPoint);

function addRegion(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var testJSON = {"name": name, "description":descr};
	fetch(url, {  
    method: 'post',   
    body: JSON.stringify(testJSON), 
  	headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
   		}
  	})
 	.then((res) => res.json())
  	.then((data) => {
    console.log(data);
    if(data.name!="error")
      window.location.href='Regions.html';
    else
      alert("Wrong input");
  	})
  	.catch((err)=> console.log(err))


}

function editRegion(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var testJSON = {"name": name, "description":descr};
	
	fetch(url+"/"+id, {  
    method: 'put',   
    body: JSON.stringify(testJSON), 
  	headers: {
  		'Accept': 'application/json',
      'Content-Type': 'application/json'
   		}
  	})
 	.then((res) => res.json())
    .then((data) => {
    	console.log(data);
    	if(data)
    	  window.location.href='Regions.html';
 	 })
    .catch((err)=> console.log(err))
}

function addPoint(){
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	var testJSON = {"coordinates": '(' + x + "," + y + ')'};
	pointsJSON.points[pointsJSON.points.length] = testJSON;
	console.log(pointsJSON);
	render(x, y);
}
