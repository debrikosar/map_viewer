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
var marker;

var psqlUrl = "http://localhost:3000/regions";
var activeUrl = new URL (window.location);
var regionId = activeUrl.searchParams.get("id");

var pointsJSON = {"points":[], "mode":[]};

bootstrapValidate('#regionName', 'max:30: Name should be less than 30 characters', function(isValid){
	console.log(isValid);
});
bootstrapValidate('#regionName', 'min:3: Name should be more than 3 characters');
bootstrapValidate('#regionDescription', 'max:100: Description should be less than 100 characters');
bootstrapValidate('#regionDescription', 'min:3: Description should be more than 3 characters');
bootstrapValidate('#pointLatitude', 'numeric: Should be numeric');
bootstrapValidate('#pointLongitude', 'numeric: Should be numeric');
bootstrapValidate('#pointLatitude', 'required: Please fill out this field');
bootstrapValidate('#pointLongitude', 'required: Please fill out this field');

openModal.addEventListener("click", function() {
	submitPoint.removeEventListener("click", editPoint);
	hiddenId.value=-1;
	marker=null;
	initMap(53.9, 27.5);
	submitPoint.addEventListener("click", addPoint);
});

//initMap(53.9, 27.5);

if ((regionId==0) || (regionId==null)) {
	submitRegion.addEventListener("click", addRegion);
	submitRegion.value = "Add";
}
else {
	fetch(psqlUrl+"/"+regionId)
	.then((resp) => resp.json())
	.then(function(data){
		document.getElementById("regionName").value = data[0].name;
		document.getElementById("regionDescription").value = data[0].description;
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

function initMap(x, y) {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
    	center: {lat: parseFloat(x), lng: parseFloat(y) }
    });

	console.log(hiddenId.value);
    if(hiddenId.value!=-1){
    	marker = new google.maps.Marker({
        	position: {lat: parseFloat(x), 
        	lng: parseFloat(y)},
        	map: map
   		});
    }

  	map.addListener('click', function(e) {
    	placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
	console.log(marker);
	if (marker)
		marker.setPosition(latLng);
	else {
		marker = new google.maps.Marker({
			position: latLng,
			map: map
    	});
   		map.panTo(latLng);
  	}
	document.getElementById("pointLatitude").value = latLng.lat();
	document.getElementById("pointLongitude").value = latLng.lng();
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
		document.getElementById("pointLatitude").value = data.x;
		document.getElementById("pointLongitude").value = data.y;
		hiddenMode.value = mode;
		hiddenId.value = id;
		submitPoint.removeEventListener("click", addPoint);
		submitPoint.addEventListener("click", editPoint);

		initMap(data.x, data.y);
		/*
		marker = new google.maps.Marker({
        	position: {lat: parseFloat(data.x), 
        	lng: parseFloat(data.x)},
        	map: map
   		});*/

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
	var name = document.getElementById("regionName").value;
	var descr = document.getElementById("regionDescription").value;
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
	var name = document.getElementById("regionName").value;
	var descr = document.getElementById("regionDescription").value;
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
	var x = document.getElementById("pointLatitude").value;
	var y = document.getElementById("pointLongitude").value;
	pointsJSON.points[pointsJSON.points.length] = {"x": x, "y": y};
	pointsJSON.mode[pointsJSON.mode.length] = "a";
	render(pointsJSON.points[pointsJSON.points.length-1], pointsJSON.points.length-1,  "a");
}

function editPoint() {
	tempJSON = {"x": document.getElementById("pointLatitude").value, "y": document.getElementById("pointLongitude").value};

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