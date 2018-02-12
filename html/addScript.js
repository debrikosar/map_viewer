var button = document.querySelector("#add");
button.addEventListener("click", addPoint);

var url = "http://localhost:3000/points";

function addPoint(){
	var name = document.getElementById("name").value;
	var descr = document.getElementById("descr").value;
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	var testJSON = {"name": name,"coordinates": '(' + x + "," + y + ')' ,"description":descr};
	alert(name);
	fetch(url, {  
    method: 'post',   
    body: JSON.stringify(testJSON), 
  	headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
   		}
  	})
 	.then((res) => res.json())
    .then((data) =>  console.log(data))
    .catch((err)=> console.log(err))
    alert("Point added")
}