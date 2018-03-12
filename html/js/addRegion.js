var button = document.getElementById("add");
var pointButton = document.getElementById("addPoint");
var title = document.getElementById("title");
var head = document.getElementById("head");
var body = document.getElementById("body");

var url = "http://localhost:3000/regions";
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");

var pointsJSON = {"points":[]};

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
	.then(function(data){
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

	var b1 = document.createElement("button");
	var b2 = document.createElement("button");

	b1.className = "btn"; 
	b2.className = "btn"; 

	b1.setAttribute('type', 'button');
	b2.setAttribute('type', 'button');

	var icon1 = document.createElement("i");
    icon1.className ="fa fa-pencil";
    b1.appendChild(icon1);

    var icon2 = document.createElement("i");
    icon2.className ="fa fa-times";
    b2.appendChild(icon2);

    h = document.createElement("td");
	h.appendChild(b1);
	h.appendChild(b2);	
	field.appendChild(h);

	body.appendChild(field);
}

function addRegion(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var testJSON = {"name": name, "description":descr, "points": pointsJSON.points};
	fetch(url + "/complex", {  
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
    .then((data) => savePoints(data, id))
    .catch((err)=> console.log(err))
}

pointButton.addEventListener("click", addPoint);

function addPoint(){
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	var testJSON = {"coordinates": "(" + x + ", " + y + ")"};
	pointsJSON.points[pointsJSON.points.length] = "(" + x + ", " + y + ")";
	console.log(pointsJSON);
	render(x, y);
}

function savePoints(data, rg_id){
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
}
