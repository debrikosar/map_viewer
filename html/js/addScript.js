var submitButton = document.getElementById("add");
var urlActive = new URL (window.location);
var pointId = urlActive.searchParams.get("id");
var heading = document.getElementById("heading");

var psqlUrl = "http://localhost:3000/points";

bootstrapValidate('#pointName', 'max:30 : Name should be less than 30 characters');
bootstrapValidate('#pointDescription', 'max:100 : description should be less than 100 characters ');
bootstrapValidate('#pointLatitude', 'numeric: Should be numeric');
bootstrapValidate('#pointLongitude', 'numeric: Should be numeric');

var marker;

if(pointId == 0){
  initMap("53.9", "27.5");
  submitButton.addEventListener("click", addPoint);
}
else{
  fetch(psqlUrl+"/"+pointId)
  .then((resp) => resp.json())
  .then(function(data) {
    document.getElementById("pointName").value = data[0].name;
    document.getElementById("pointDescription").value = data[0].description;
    document.getElementById("pointLatitude").value = data[0].coordinates.x;
    document.getElementById("pointLongitude").value = data[0].coordinates.y;
    initMap(data[0].coordinates.x, data[0].coordinates.y);
  })      
  .catch(function(err) {
    console.log(err);
  });
  submitButton.addEventListener("click", editPoint);
  submitButton.value = "Save";
  heading.innerHTML = "Edit point";
}


function initMap(pointLatitude, pointLongitude) {
  console.log(pointLatitude, pointLongitude);
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: parseFloat(pointLatitude), lng: parseFloat(pointLongitude) }
    });
  if(pointId!=0){
    marker = new google.maps.Marker({
          position: {lat: parseFloat(pointLatitude), 
          lng: parseFloat(pointLongitude)},
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
  document.getElementById("pointLatitude").value = latLng.lat();
  document.getElementById("pointLongitude").value = latLng.lng();
}

function addPoint(){
	var pointName = document.getElementById("pointName").value;
	var pointDescription = document.getElementById("pointDescription").value;
	var pointLatitude = document.getElementById("pointLatitude").value;
	var pointLongitude = document.getElementById("pointLongitude").value;
	var testJSON = {"name": pointName,"coordinates": '(' + pointLatitude + "," + pointLongitude + ')' ,"description":pointDescription};
	fetch(psqlUrl, {  
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
  var pointName = document.getElementById("pointName").value;
  var pointDescription = document.getElementById("pointDescription").value;
  var pointLatitude = document.getElementById("pointLatitude").value;
  var pointLongitude = document.getElementById("pointLongitude").value;
  var testJSON = {"name": pointName,"coordinates": '(' + pointLatitude + "," + pointLongitude + ')' ,"description":pointDescription};
  
  fetch(psqlUrl+"/"+pointId, {  
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
