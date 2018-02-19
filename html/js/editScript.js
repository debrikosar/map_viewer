var url = "http://localhost:3000/points";
var url2 = new URL (window.location);
var id = url2.searchParams.get("id");

var button = document.getElementById("edit");
button.addEventListener("click", editPoint);

console.log(id);

fetch(url)
		.then((resp) => resp.json())
		.then(function(data) {
			for (let i = 0; i < data.length; i++){	
				if(id == data[i].id){
					document.getElementById("name").value = data[i].name;
					document.getElementById("descr").value = data[i].description;
					document.getElementById("x").value = data[i].coordinates.x;
					document.getElementById("y").value = data[i].coordinates.y;
				}	
			}
		})			
		.catch(function(err) {
			console.log(err);
		});

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
    .then((data) =>  console.log(data))
    .catch((err)=> console.log(err))
}