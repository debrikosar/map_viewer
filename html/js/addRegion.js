var button = document.getElementById("add");
var url = "http://localhost:3000/regions";
var urlActive = new URL (window.location);
var id = urlActive.searchParams.get("id");
var head = document.getElementById("header");

if (id==0) {
	button.addEventListener("click", addRegion);
	button.value = "Add";
}
else {
	fetch(url+"/id"+id)
	.then((resp) => resp.json())
	.then(function(data) {
		document.getElementById("name").value = data[0].name;
		document.getElementById("descr").value = data[0].description;
	})			
	.catch(function(err) {
		console.log(err);
	});
	button.addEventListener("click", editRegion);
	button.value = "Save";
	head.innerHTML = "Edit region";
}

bootstrapValidate('#name', 'max:30: Name should be less than 30 characters');
bootstrapValidate('#descr', 'max:100: Description should be less than 100 characters');

function addRegion(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var testJSON = {"name": name, "description":descr};
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
      window.location.href='Regions.html';
    else
      alert("Wrong input");
  	})
  	.catch((err)=> console.log(err))
}

function editRegion(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var testJSON = {"name": name, "description":descr};
	
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
    	  window.location.href='Regions.html';
 	 })
    .catch((err)=> console.log(err))
}