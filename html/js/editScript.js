var url = "http://localhost:3000/points";
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");

var button = document.getElementById("edit");
button.addEventListener("click", editPoint);

bootstrapValidate('#name', 'max:30: Name should be less than 30 characters');
bootstrapValidate('#descr', 'max:100: Description should be less than 100 characters');
bootstrapValidate('#x', 'numeric: Should be numeric');
bootstrapValidate('#y', 'numeric: Should be numeric');

var marker;

function initMap() {
  	var map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 4,
   		center: {lat: parseInt(document.getElementById("x").value), lng: parseInt(document.getElementById("y").value) }
    });
 	marker = new google.maps.Marker({
        	position: {lat: parseFloat(document.getElementById("x").value), 
        	lng: parseFloat(document.getElementById("y").value)},
        	map: map
    });
  	map.addListener('click', function(e) {
   		placeMarkerAndPanTo(e.latLng, map);
    });
  }

function placeMarkerAndPanTo(latLng, map) {
  marker.setPosition(latLng);
  document.getElementById("x").value = latLng.lat();
  document.getElementById("y").value = latLng.lng();
}


fetch(url+"/"+id)
	.then((resp) => resp.json())
	.then(function(data) {
		document.getElementById("name").value = data[0].name;
		document.getElementById("descr").value = data[0].description;
		document.getElementById("x").value = data[0].coordinates.x;
		document.getElementById("y").value = data[0].coordinates.y;
		initMap();
	})			
	.catch(function(err) {
		console.log(err);
	});

function editPoint(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	var testJSON = {"name": name,"coordinates": '(' + x + "," + y + ')' ,"description":descr};
	
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
    	  window.location.href='Points.html';
 	 })
    .catch((err)=> console.log(err))
}