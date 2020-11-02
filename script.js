/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast

create variables for URLs and api key
create event listener for search button
    set user input to a variable
    use AJAX to:
        get weather data for user input/city:
            get current weather data and lat-lon coordinates from 
            current api https://openweathermap.org/current
            one-call api https://openweathermap.org/api/one-call-api

            get uvindex from uvi api https://openweathermap.org/api/uvi

            get forecast from forecast5 api https://openweathermap.org/forecast5
        
    render the required info to the page
        create variables 
            for current day:
                city, date, temp(translate from kelvin to farenheit), humidity, wind speed, uvindex, uvindex color(favorable, moderate, severe)
        display current city and date to current city row
            for forecast:
                for loop(){
                    date, icon, temp, humidity
                }

create event listener for recent searches element(s)
    when user clicks on a recent search
        relevant weather data is again displayed
*/

let apiKey = "5602f605cfcea993a0617227f0c3e839";

$("button").on("click", function (e) {
    e.preventDefault();
    let currentSearch = $("#city").val();
    let currentUrl = `http://api.openweathermap.org/data/2.5/weather?q=${currentSearch}&appid=${apiKey}`;
    console.log(currentSearch);
    $.ajax({
        url: currentUrl,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    })
})