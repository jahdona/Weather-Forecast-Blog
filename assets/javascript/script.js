const searchButton=document.getElementById('search-btn');
const cityInput=document.getElementById('city-input');
const msg=document.querySelector(".mes");
const weatherCardsUl=document.querySelector(".weather-cards");
const currentWeatherDiv=document.querySelector('.current-weather');
const locationButton=document.querySelector('.location-btn');
const searchedCitiesList=document.querySelector('.searched-cities');
//API key for OpenweatherMap API

const apiKeys="2ce24dfe106741fbb9bad674040fece6";

let cities=JSON.parse(localStorage.getItem('city')) ||[];
//display cities on form everytime the page refreshed
window.onload=function loadCities()
{
    for(i=0;i<cities.length;i++){
        const list=document.createElement('li')
        list.textContent=cities[i];
        searchedCitiesList.appendChild(list);
    }
}
//get stored cities in localstorage and display while search for a city
function searchedCities(city=[]){

for(i=0;i<city.length;i++){
    const list=document.createElement('li')
    list.textContent=city[i];
    searchedCitiesList.appendChild(list);
}
}

function createWeatherCard(cityName,weatherItem,index){
    if(index===0)
    {
        return `
                    <div class="details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h4>Temperature: ${(((weatherItem.main.temp - 273.15)*1.8)+32).toFixed(2)}°F</h4>
                        <h4>Wind Speed: ${weatherItem.wind.speed} M/S</h4>
                         <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                    </div>
                    <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                          <h4>${weatherItem.weather[0].description}</h4>
                    </div>
            `;
    }
    else{
         return `
        <li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4>Temperature: ${(((weatherItem.main.temp - 273.15)*1.8)+32).toFixed(2)}°F</h4>
            <h4>Wind Speed: ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity} %</h4>
        </li>
    `;
    }

   
}

//Get weather details for the entered city
function getWeatherDetails(cityName, lat,lon){
    storeCity(cityName); 

    const weatherApiUrl=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKeys}`;
    fetch(weatherApiUrl)
        .then(res=>res.json())
        .then(data=>{
            
            //Filter the forecasts to get only one forecast per day
            const uniqueForecastDays=[];
            const fiveDaysForecast=data.list.filter(forecast=>{
                const forecastDate=new Date(forecast.dt_txt).getDate();
                if(!uniqueForecastDays.includes(forecastDate)){
                    return uniqueForecastDays.push(forecastDate);
                }
            });
            //clearing previous data
            weatherCardsUl.innerHTML="";
            currentWeatherDiv.innerHTML="";
            cityInput.value="";
           
            fiveDaysForecast.forEach((weatherItem,index) => {
                //Adding weather cards to the UL
                if(index===0)
                {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));

                }
                else
                {

                    weatherCardsUl.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));
                }
                
            });

        })
        .catch(()=>{
            alert("An error ocurred while fetching Weather Forecast");
        });
}

const getCityCoordinates=()=>{
    //Get user entered city name and remove extra spaces

    const cityName=cityInput.value.trim();
    if(!cityName)
        {
            //validating the text box for not be empty
            msg.textContent="Search Text Box should not be empty";
            return;
        }
    
        const requestUrl=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKeys}`;
        fetch(requestUrl).then(res=>res.json()).then(data=>{
            if(!data.length) {
                //Checking for the input provided if it has some coordinates
                return alert(`No coordinates found for ${cityName}`);
            }
            //getting the coordinates for the Entered City (latitude, longitude and city name) from the API response
            const {name, lat,lon}=data[0];
            getWeatherDetails(name, lat,lon);
            
        }).catch(()=>{
            alert("An error ocurred while fetching the coordinates");
        });
        msg.textContent="";
       
        storeCity(cityName);
}
//get current user coordinates
function getUSerCoordinates(){
    navigator.geolocation.getCurrentPosition(
        
        position=>{

            const {latitude,longitude}=position.coords;
            const reverseGeoCodingUrl=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKeys}`;
            fetch(reverseGeoCodingUrl).then(res=>res.json()).then(data=>{
                const {name }=data[0];
                getWeatherDetails(name, latitude,longitude);
                
            }).catch(()=>{
                alert("An error ocurred while fetching the city");
            });
        },
        error=>{

            console.log(error);
        }
        
        );
}
//Storing searched city in localstorage
function storeCity(cityNames){
    
    if(cities===null || !cities.includes(cityNames)){
      cities.push(cityNames);

      localStorage.setItem('city',JSON.stringify(cities));
      searchedCitiesList.innerHTML="";
      searchedCities(cities);
      console.log(cities);
    }
  
  
  };
  //jquery function for autocomplete
  $( function() {
   
    $( "#city-input" ).autocomplete({
      source: cities
    });
  } );
  
searchButton.addEventListener("click",getCityCoordinates);
locationButton.addEventListener("click",getUSerCoordinates);