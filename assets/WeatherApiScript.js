var startButton = document.getElementById('start-btn');
var UnitsField = document.getElementById('units');
var CurrentCityName = '';



function LookupWeatherByCity() {
    var cityField = document.getElementById('cityname');
    if (cityField.value != '') {
        //store the city alleyways in upper case, no matter how the user insert this city name 
        CurrentCityName = cityField.value.toLocaleUpperCase();

        //change this wiht your app id
        var appid ='d5cdcb2abf72bb410694d98e6d676258' ;

        //define the api url
        var ApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + CurrentCityName + '&appid=' + appid + '&units=' + UnitsField.value;


        //create object for api call
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", encodeURI(ApiUrl), true);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // call funtion to show result:
                ShowWeatherDetails(xhttp.responseText)
            }
        };
        //fire api call
        xhttp.send();
    }
}


function ShowWeatherDetails(data) {
    /**This function shows the weather date in a table. It stores the REST api call result in the local storage for further usage, which is not implemented now.
     * the paramter "data" Contains the REST api result as JSON text. Here is an example, how the result looks like.
     * 
     *
   {
   "coord":{
      "lon":16.3721,
      "lat":48.2085
   },
   "weather":[
      {
         "id":800,
         "main":"Clear",
         "description":"clear sky",
         "icon":"01d"
      }
   ],
   "base":"stations",
   "main":{
      "temp":34.63,
      "feels_like":35.48,
      "temp_min":33.16,
      "temp_max":36.05,
      "pressure":1011,
      "humidity":36
   },
   "visibility":10000,
   "wind":{
      "speed":7.2,
      "deg":150
   },
   "clouds":{
      "all":0
   },
   "dt":1658761603,
   "sys":{
      "type":2,
      "id":2037452,
      "country":"AT",
      "sunrise":1658719245,
      "sunset":1658774460
   },
   "timezone":7200,
   "id":2761369,
   "name":"Vienna",
   "cod":200
}
     */

    if (data != "undefined" && data != '') {
        //store the city weahter data in the local storage with key the city name and value api result (json text) 
        localStorage[CurrentCityName] = JSON.stringify(data);
        //to be sure parse the data as json 

        var CityWeather = JSON.parse(data);
        document.getElementById('w_cityname').innerText = CityWeather.name;

        /**
         * According to API description is the date filed contains UNIX format datetime, which is in seconds.
         * https://openweathermap.org/current#data
         * To create correct datetime by JavaScript function, we need to convert the information to milliseconds by multiply by 1000
         */
        var WeatherTimeStamp = (CityWeather.dt * 1000);
        document.getElementById('w_date').innerText = new Date(WeatherTimeStamp);
        document.getElementById('w_temperature').innerText = CityWeather.main.temp;
        document.getElementById('w_windspeed').innerText = CityWeather.wind.speed;
        document.getElementById('w_humidity').innerText = CityWeather.main.humidity;

        document.getElementById('weathertable').style.visibility = 'visible';
    }
}


// adding event to search button. 
startButton.addEventListener('click', LookupWeatherByCity);




