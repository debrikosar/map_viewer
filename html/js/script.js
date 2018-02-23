var url = "http://localhost:3000/points";
var urlPage = "http://localhost:3000/points/page";
var urlCount = "http://localhost:3000/points/count/page";
var body = document.querySelector("#body");
var pages = document.querySelector("#pages");

var url2 = new URL (window.location);
var page = url2.searchParams.get("page");

if(!page) page = 1;

render(page-1);

function render(page){
	fetch(urlCount)
		.then((resp) => resp.json())
		.then((data) => createPaginator(data))
		.catch(function(err) {
			console.log(err);
		});

	fetch(urlPage+"/"+page)
		.then((resp) => resp.json())
		.then((data) => showLimited(data))
		.catch(function(err) {
			console.log(err);
		});
}

function createPaginator(data){
	var pagesCount = Math.ceil(data[0].count/5);
	if(parseInt(page)> pagesCount)
		window.location = "Points.html?page=" + (parseInt(page)-1);
	var previous = document.createElement("li");
	previous.className = "page-item";
	var aPrevious = document.createElement("a");
	aPrevious.className = "page-link";
	aPrevious.innerHTML = "Previous";
	aPrevious.addEventListener("click", function(){
		if(parseInt(page)>1)
			window.location = "Points.html?page=" + (parseInt(page)-1);
	});
	previous.appendChild(aPrevious);
	pages.appendChild(previous);

	for (let i = 0; i < pagesCount; i++){		
		var pageItem = document.createElement("li");
		pageItem.className = "page-item";
		var a = document.createElement("a");
		a.className = "page-link";
		a.innerHTML = i+1;
		a.addEventListener("click", function(){
			window.location = "Points.html?page=" + (i+1);
		});
		pageItem.appendChild(a);
		pages.appendChild(pageItem);
	}

	var next = document.createElement("li");
	next.className = "page-item";
	var aNext = document.createElement("a");
	aNext.className = "page-link";
	aNext.innerHTML = "Next";
	aNext.addEventListener("click", function(){
			if(parseInt(page)<pagesCount)
			window.location = "Points.html?page=" + (parseInt(page)+1);
	});
	next.appendChild(aNext);
	pages.appendChild(next);
}

function showLimited(data){
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
		var b = document.createElement("button");
		var b1 = document.createElement("button");
		var b2 = document.createElement("button");

		b.className = "btn"; 
		b1.className = "btn"; 
		b2.className = "btn"; 

		b.addEventListener("click", function(){
			window.location = "Map.html?id=" + data[i].id;
		});

		b1.addEventListener("click", function(){
			window.location = "EditWindow.html?id=" + data[i].id;
		});

		b2.addEventListener("click", function deletePoint(){
			fetch(url + '/' + data[i].id, {
 				method: 'delete'
  			})
 			//.then((res) => res.json())
   			//.catch((err)=> console.log(err))
   			window.location.reload(false); 
		});

		var icon = document.createElement("i");
       	icon.className ="fa fa-map-marker";
       	b.appendChild(icon);

       	var icon1 = document.createElement("i");
       	icon1.className ="fa fa-pencil";
       	b1.appendChild(icon1);

       	var icon2 = document.createElement("i");
       	icon2.className ="fa fa-times";
       	b2.appendChild(icon2);

		h.appendChild(b);
		h.appendChild(b1);
		h.appendChild(b2);
		field.appendChild(h);				

		body.appendChild(field);
	}
}