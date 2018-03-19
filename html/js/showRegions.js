var url = "http://localhost:3000/regions";
var body = document.querySelector("#body");
var pages = document.querySelector("#pages");
//var clearButton = document.getElementById("clearButton");

var url2 = new URL (window.location);
var page = url2.searchParams.get("page");

if(!page) page = 1;

//clearButton.addEventListener("click", clearPoints);

render(page-1);

function render(page){
	fetch(url+"/count/page")
		.then((resp) => resp.json())
		.then((data) => createPaginator(data))
		.catch(function(err) {
			console.log(err);
		});

	fetch(url+"/page/"+page)
		.then((resp) => resp.json())
		.then((data) => show(data))
		.catch(function(err) {
			console.log(err);
		});
}


function createPaginator(data){
	var pagesCount = Math.ceil(data[0].count/5);
	if(parseInt(page) > pagesCount)
		window.location = "Regions.html?page=" + (parseInt(page)-1);
	var previous = document.createElement("li");
	previous.className = "page-item";
	var aPrevious = document.createElement("a");
	aPrevious.className = "page-link";
	aPrevious.innerHTML = "Previous";
	aPrevious.addEventListener("click", function(){
		if(parseInt(page)>1)
			window.location = "Regions.html?page=" + (parseInt(page)-1);
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
			window.location = "Regions.html?page=" + (i+1);
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
			window.location = "Regions.html?page=" + (parseInt(page)+1);
	});
	next.appendChild(aNext);
	pages.appendChild(next);
}

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

function clearPoints() {
	fetch(url + "/short/all")
	.then((resp) => resp.json())
	.then((data) => {
		for(let i = 0; i < data.length; i++){
			fetch(url + "/id" + data[i].region_id)
			.then((resp) => resp.json())
			.then((dataLocal)=>{
				if(dataLocal.name=="error" || dataLocal.length==0){
					fetch(url + '/short/' + data[i].id, {
 						method: 'delete'
  					})
				}
			})
		}
	})
	.catch(function(err) {
		console.log(err);
	});
}