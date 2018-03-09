var button = document.getElementById("add");
var pointButton = document.getElementById("addPoint");
var url = "http://localhost:3000/regions";
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");
var title = document.getElementById("title");
var head = document.getElementById("head");
var pointsJSON = {"points":[]};
var body = document.getElementById("body");

bootstrapValidate('#name', 'max:30: Name should be less than 30 characters');
bootstrapValidate('#descr', 'max:100: Description should be less than 100 characters');
bootstrapValidate('#x', 'numeric: Should be numeric');
bootstrapValidate('#y', 'numeric: Should be numeric');

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
	fetch(url+"/short/region"+id)
	.then((resp) => resp.json())
	.then(function(data) {
		for(let i = 0; i < data.length; i++){
			render(data[i].coordinates.x, data[i].coordinates.y);
		}
	})
	button.addEventListener("click", editRegion);
	button.value = "Save";
	title.innerHTML = "Edit region";
	head.innerHTML = "Edit";
}

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
    	center: {lat: 53.9, lng: 27.5 }
    });
    marker = new google.maps.Marker({
        position: {lat: parseFloat(x), 
        lng: parseFloat(y)},
        map: map
    });
  	map.addListener('click', function(e) {
    	placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
	if (marker)
		marker.setPosition(latLng);
	else {
		marker = new google.maps.Marker({
			position: latLng,
			map: map
    	});
   		map.panTo(latLng);
  	}
	document.getElementById("x").value = latLng.lat();
	document.getElementById("y").value = latLng.lng();
}

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
  	.then((data) => loadPoints(data, data[0].id))
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
    .then((data) => loadPoints(data, id))
    .catch((err)=> console.log(err))
}

pointButton.addEventListener("click", addPoint);

function addPoint(){
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	var testJSON = {"coordinates": '(' + x + "," + y + ')'};
	pointsJSON.points[pointsJSON.points.length] = testJSON;
	console.log(pointsJSON);
	render(x, y);
}

function loadPoints(data, rg_id){
	var pointJSON = {"region_id": rg_id, "coordinates": 0};
	for (let i = 0; i < pointsJSON.points.length; i++){	
  		pointJSON.coordinates = pointsJSON.points[i].coordinates;
  		console.log(pointJSON);
  		fetch(url+"/short", {  
    		method: 'post',   
    		body: JSON.stringify(pointJSON), 
  			headers: {
      			'Accept': 'application/json',
      			'Content-Type': 'application/json'
   				}
  			})
  		.catch((err) => console.log(err))	
  		}
    if(data.name!="error")
    	window.location.href='Regions.html';
    else
     	alert("Wrong input");  		
}
