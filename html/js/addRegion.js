var submitRegion = document.getElementById("submitRegion");
var submitPoint = document.getElementById("submitPoint");
var expandMap = document.getElementById("expandMap");
var heading = document.getElementById("heading");
var titleName = document.getElementById("titleName");
var tableBody = document.getElementById("tableBody");
var pointsTable = document.getElementById("pointsTable");
var openModal = document.getElementById("openModal");
var hiddenMode = document.getElementById("hiddenMode");
var hiddenId = document.getElementById("hiddenId");
var tempJSON;

var psqlUrl = "http://localhost:3000/regions";
var activeUrl = new URL (window.location);
var regionId = activeUrl.searchParams.get("id");

var pointsJSON = {"points":[]};

bootstrapValidate('#name', 'max:30: Name should be less than 30 characters');
bootstrapValidate('#descr', 'max:100: Description should be less than 100 characters');
bootstrapValidate('#x', 'numeric: Should be numeric');
bootstrapValidate('#y', 'numeric: Should be numeric');

openModal.addEventListener("click", function() {
	console.log("why are u here");
	submitPoint.removeEventListener("click", editPoint);
	submitPoint.addEventListener("click", addPoint);
});

if ((regionId==0) || (regionId==null)) {
	submitRegion.addEventListener("click", addRegion);
	submitRegion.value = "Add";
}
else {
	fetch(psqlUrl+"/"+regionId)
	.then((resp) => resp.json())
	.then(function(data){
		document.getElementById("name").value = data[0].name;
		document.getElementById("descr").value = data[0].description;
	})			
	.catch(function(err) {
		console.log(err);
	});
	fullTable();	
	submitRegion.addEventListener("click", editRegion);
	submitRegion.value = "Save";
	heading.innerHTML = "Edit region";
	titleName.innerHTML = "Edit";
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

function render(data, id, mode){
	console.log(data);
	var field = document.createElement("tr");

	var h = document.createElement("td");
	h.appendChild(document.createTextNode(data.x));
	field.appendChild(h);

	h = document.createElement("td");
	h.appendChild(document.createTextNode(data.y));
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

    b1.addEventListener("click", function(){
		document.getElementById("x").value = data.x;
		document.getElementById("y").value = data.y;
		hiddenMode.value = mode;
		hiddenId.value = id;
		submitPoint.removeEventListener("click", addPoint);
		submitPoint.addEventListener("click", editPoint);
		$("#addModal").modal("show");
	});

    if(mode == "a"){
		b2.addEventListener("click", function(){
			pointsJSON.points.splice(id, 1);
			refreshTable();
		});
    }

    if(mode == "e"){
		b2.addEventListener("click", function(){
			fetch(psqlUrl + '/short/' + id, {
 				method: 'delete'
  			})
			refreshTable();
		});
    }

    h = document.createElement("td");
	h.appendChild(b1);
	h.appendChild(b2);	
	field.appendChild(h);

	tableBody.appendChild(field);
}


function addRegion(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var testJSON = {"name": name, "description":descr, "points": pointsJSON.points};
	fetch(psqlUrl + "/complex", {  
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
	var testJSON = {"name": name, "description":descr, "points": pointsJSON.points};
	
	fetch(psqlUrl+"/complex/"+regionId, {  
    method: 'put',   
    body: JSON.stringify(testJSON), 
  	headers: {
  		'Accept': 'application/json',
    	'Content-Type': 'application/json'
   		}
  	})
 	.then((res) => res.json())
    .then((data) => {
    	if(data.name!="error"){
    		window.location.href='Regions.html';
    	}
 		else
     		alert("Wrong input");
    })
    .catch((err)=> console.log(err))
}

function addPoint(){
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	pointsJSON.points[pointsJSON.points.length] = {"x": x, "y": y};
	render(pointsJSON.points[pointsJSON.points.length-1], pointsJSON.points.length-1,  "a");
}

function editPoint() {
	tempJSON = {"x": document.getElementById("x").value, "y": document.getElementById("y").value};

	console.log(hiddenMode.value);

	if(hiddenMode.value == "a"){
		pointsJSON.points[hiddenId.value] = tempJSON;
	}
	if(hiddenMode.value == "e"){
		fetch(psqlUrl+"/short/"+hiddenId.value, {  
   			method: 'put',   
    		body: JSON.stringify(tempJSON), 
  			headers: {
  				'Accept': 'application/json',
    			'Content-Type': 'application/json'
   			}
  		})
	}
	refreshTable(); 
}

function refreshTable(){
	var new_body = document.createElement("tbody");
	new_body.id = "tableBody";	
	pointsTable.replaceChild(new_body, tableBody);
	tableBody = document.getElementById("tableBody");
	fullTable();
}

function fullTable(){
	fetch(psqlUrl+"/short/"+regionId)
	.then((resp) => resp.json())
	.then(function(data) {
		for(let i = 0; i < data.length; i++){
			tempJSON = {"x":data[i].coordinates.x, "y":data[i].coordinates.y};
			render(tempJSON, data[i].id, "e");
		}
	})
	console.log("hi");
	for(let i = 0; i < pointsJSON.points.length; i++){
		console.log(pointsJSON.points[i]);
		//tempJSON = {"x": pointsJSON.points[i].x, "y": pointsJSON[i].points.y};
		render(pointsJSON.points[i], i, "a");
	}
}


/*function savePoints(){
	var pointJSON = {"region_id": id, "coordinates": 0};
	for (let i = 0; i < pointsJSON.points.length; i++){	
  		pointJSON.coordinates = '(' + pointsJSON.points[i].x + ', ' + pointsJSON.points[i].y + ')';
  		console.log(pointJSON);
  		fetch(psqlUrl+"/short", {  
    		method: 'post',   
    		body: JSON.stringify(pointJSON), 
  			headers: {
      			'Accept': 'application/json',
      			'Content-Type': 'application/json'
   				}
  			})
  		.catch((err) => console.log(err))	
  	}  		
}*/