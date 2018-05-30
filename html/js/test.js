var testButton = document.getElementById("test");

testButton.addEventListener("click", login);

var testJSON = {"username": "test",
 	"password": "test"};

console.log(testJSON);

function login(){
	testJSON.username = document.getElementById("Username").value;
	testJSON.password = document.getElementById("Password").value; 
	fetch("http://localhost:3000/login/login", {  
		method: 'post',   
   		body: JSON.stringify(testJSON), 
  		headers: {
    		'Accept': 'application/json',
    		'Content-Type': 'application/json'
   			}
   		})
 		.then((res) => {
 			console.log(res);
 			window.location.href = res.url;
 		})
  		.catch((err)=> console.log(err)) 
}
