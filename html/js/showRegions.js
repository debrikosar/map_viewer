var url = "http://localhost:3000/regions";
var body = document.querySelector("#body");

fetch(url)
	.then((resp) => resp.json())
	.then((data) => show(data))
	.catch(function(err) {
		console.log(err);
	});

function show(data){
	for (let i = 0; i < data.length; i++){						
		var field = document.createElement("tr");

		var h = document.createElement("td");
		h.appendChild(document.createTextNode(data[i].name));
		field.appendChild(h);

		h = document.createElement("td");

		h = document.createElement("td");
		h.appendChild(document.createTextNode(data[i].description));
		field.appendChild(h);

		h = document.createElement("td");
		//var b = document.createElement("button");
		var b1 = document.createElement("button");
		var b2 = document.createElement("button");

		//b.className = "btn"; 
		b1.className = "btn"; 
		b2.className = "btn"; 

		/*b.addEventListener("click", function(){
			window.location = "Map.html?id=" + data[i].id;
		});*/

		b1.addEventListener("click", function(){
			window.location = "AddRegion.html?id=" + data[i].id;
		});

		b2.addEventListener("click", function deletePoint(){
			fetch(url + '/' + data[i].id, {
 				method: 'delete'
  			})
   			window.location.reload(false); 
		});

		/*var icon = document.createElement("i");
       	icon.className ="fa fa-map-marker";
       	b.appendChild(icon);*/

       	var icon1 = document.createElement("i");
       	icon1.className ="fa fa-pencil";
       	b1.appendChild(icon1);

       	var icon2 = document.createElement("i");
       	icon2.className ="fa fa-times";
       	b2.appendChild(icon2);

		//h.appendChild(b);
		h.appendChild(b1);
		h.appendChild(b2);
		field.appendChild(h);				

		body.appendChild(field);
	}
}