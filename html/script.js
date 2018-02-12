var url = "http://localhost:3000/points";
var body = document.querySelector("#body");
fetch(url)
		.then((resp) => resp.json())
		.then(function(data) {
			for (let i = 0; i < data.length; i++){						
			var field = document.createElement("tr");

			var h = document.createElement("td");
			h.appendChild(document.createTextNode(data[i].name));
			field.appendChild(h);

			h = document.createElement("td");
			if(data[i].coordinates)
				h.appendChild(document.createTextNode(data[i].coordinates.x + ", " + data[i].coordinates.y));
			else 
				h.appendChild(document.createTextNode("null"));
			field.appendChild(h);

			h = document.createElement("td");
			h.appendChild(document.createTextNode(data[i].description));
			field.appendChild(h);

			h = document.createElement("td");
			var b1 = document.createElement("button");
			var b2 = document.createElement("button");	
			b2.id = i;		
			b2.addEventListener("click", function deletePoint(){
				fetch(url + '/' + data[i].id, {
 					method: 'delete'
  				})
 				.then((res) => res.json())
   				.catch((err)=> console.log(err))
   				window.location.reload(false); 
			});
			b1.appendChild(document.createTextNode("edit"));
			b2.appendChild(document.createTextNode("delete"));
			h.appendChild(b1);
			h.appendChild(b2);
			field.appendChild(h);				

			body.appendChild(field);
			}
		})
		.catch(function(err) {
			console.log(err);
		});

/* var button = document.querySelector("button");

//button.addEventListener("click", addButton);
button.addEventListener("click", fetcher);

function addButton(){
	var nextButton = button.cloneNode(true);
	nextButton.addEventListener("click", addButton);
	//document.createElement("BUTTON");
    document.body.appendChild(nextButton);
}

function fetcher(){
	//"http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20yahoo.finance.quotes%20WHERE%20symbol%3D%27WRC%27&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback";
	fetch(url)
		.then((resp) => resp.json())
		.then(function(data) {
			console.log(data);
			alert('hi');
			var h = document.createElement("h1");
   			var t = document.createTextNode(data.name);
   			h.appendChild(t);
   			document.body.appendChild(h);
		})
		.catch(function(err) {
			console.log(err);
		});
}
*/
