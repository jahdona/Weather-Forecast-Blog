const searchButton=document.getElementById('search-btn');
const cityInput=document.getElementById('city-input');
const msg=document.querySelector(".mes");
const weatherCardsUl=document.querySelector(".weather-cards");
//API key for OpenweatherMap API
const apiKeys="2ce24dfe106741fbb9bad674040fece6";

function createWeatherCard(weatherItem){

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

//Get weather details for the entered city
function getWeatherDetails(cityName, lat,lon){

    const weatherApiUrl=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKeys}`;
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
            weatherCardsUl.innerHTML="";
            cityInput.value="";
            fiveDaysForecast.forEach(weatherItem => {
                //Adding weather cards to the UL
                weatherCardsUl.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
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
    
        const requestUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKeys}`;
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
    

}

searchButton.addEventListener("click",getCityCoordinates);