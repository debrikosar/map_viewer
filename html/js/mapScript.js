var url = "http://localhost:3000/points";
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");

function initMap() {
	fetch(url+"/"+id)
	.then((resp) => resp.json())
	.then(function(data) {
		var uluru = {lat: data[0].coordinates.x, lng: data[0].coordinates.y};
		var map = new google.maps.Map(document.getElementById('map'), {
        	zoom: 4,
        	center: uluru
        });
        var marker = new google.maps.Marker({
        	position: uluru,
        	map: map
    	});
	})			
	.catch(function(err) {
		console.log(err);
	});
}
