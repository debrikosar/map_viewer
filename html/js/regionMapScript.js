var url = "http://localhost:3000/regions/short";
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");

function initMap() {
	fetch(url+"/"+id)
	.then((resp) => resp.json())
	.then(function(data) {
		var map = new google.maps.Map(document.getElementById('map'), {
        	zoom: 8,
        	center: {lat: parseFloat(data[0].coordinates.x), lng: parseFloat(data[0].coordinates.y) }
        });
        for(let i = 0; i < data.length; i++){
       		var marker = new google.maps.Marker({
        		position: {lat: parseFloat(data[i].coordinates.x), lng: parseFloat(data[i].coordinates.y) },
        		map: map
    		});
    	}
	})			
	.catch(function(err) {
		console.log(err);
	});
}
