var button = document.getElementById("add");
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");
var head = document.getElementById("header");

var url = "http://localhost:3000/points";

bootstrapValidate('#name', 'max:30: Name should be less than 30 characters');
bootstrapValidate('#descr', 'max:100: Description should be less than 100 characters');
bootstrapValidate('#x', 'numeric: Should be numeric');
bootstrapValidate('#y', 'numeric: Should be numeric');

var marker;

if(id == 0){
  initMap(53, 27);
  button.addEventListener("click", addPoint);
}
else{
  fetch(url+"/"+id)
  .then((resp) => resp.json())
  .then(function(data) {
    document.getElementById("name").value = data[0].name;
    document.getElementById("descr").value = data[0].description;
    document.getElementById("x").value = data[0].coordinates.x;
    document.getElementById("y").value = data[0].coordinates.y;
    initMap(data[0].coordinates.x, data[0].coordinates.y);
  })      
  .catch(function(err) {
    console.log(err);
  });
  button.addEventListener("click", editPoint);
  button.value = "Save";
  head.innerHTML = "Edit point";
}


function initMap(x, y) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: parseInt(x), lng: parseInt(y) }
    });
  if(id!=0){
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

function addPoint(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	var testJSON = {"name": name,"coordinates": '(' + x + "," + y + ')' ,"description":descr};
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
      window.location.href='Points.html';
    else
      alert("Wrong input");
  })
  .catch((err)=> console.log(err))
}

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
