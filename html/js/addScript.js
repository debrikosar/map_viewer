var button = document.getElementById("add");
button.addEventListener("click", addPoint);

var url = "http://localhost:3000/points";

bootstrapValidate('#name', 'max:30: Name should be less than 30 characters');
bootstrapValidate('#descr', 'max:100: Description should be less than 100 characters');
bootstrapValidate('#x', 'numeric: Should be numeric');
bootstrapValidate('#y', 'numeric: Should be numeric');

function initMap() {
  console.log("hi");
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 53, lng: 27 }
    });

  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
    });
  }

var marker;

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


