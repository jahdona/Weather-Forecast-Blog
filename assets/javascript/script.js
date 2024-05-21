const searchButton=document.getElementById('search-btn');
const cityInput=document.getElementById('city-input');
const msg=document.querySelector(".mes");
const getCityCoordinates=()=>{
    //Get user entered city name and remove extra spaces
const cityName=cityInput.value.trim();
const apiKeys='2ce24dfe106741fbb9bad674040fece6';
    if(!cityName)
        {
            msg.textContent="Search Text Box should not be empty";
            return;
        }
    else{
        //API key for OpenweatherMap API
        const apiKeys='2ce24dfe106741fbb9bad674040fece6'; 
        console.log(cityName);
        const requestUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKeys}`;
        fetch(requestUrl).then(res=>res.json()).then(data=>{
            console.log(data);
        }).catch(()=>{
            alert("An error ocurred while fetching the coordinates");
        });
        msg.textContent="";
    }

}

searchButton.addEventListener("click",getCityCoordinates);