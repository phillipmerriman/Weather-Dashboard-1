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
    add userinput to recent list with class of .previous-search
        create event listener for if user clicks on item in recent list
            it does the same thing as if user clicks on search button
    use AJAX to:
        get weather data for user input/city:
            get lat-lon coordinates from 
                current api https://openweathermap.org/current
            and current weather data from
                one-call api https://openweathermap.org/api/one-call-api

            get uvindex from uvi api https://openweathermap.org/api/uvi

            get forecast from forecast5 api https://openweathermap.org/forecast5
        
    render the required info to the page
        create variables 
            use currentAPI to get lat&lon for current city, setting variables accordingly
            for current day:
                city(use lat&lon to set current city variable response.coord.lat, response.coord.lon), date(response.dt_txt), temp(translate from kelvin to farenheit)((response.current.temp - 273.15) * 1.80 + 32), humidity(response.current.humidity), wind speed(response.current.wind_speed), uvindex, uvindex color(favorable, moderate, severe)
            save variables to localStorage for future recall    
        display current city and date to current city row
        create variables
            for forecast:
                for loop(){
                    date, icon, temp, humidity
                }

create event listener for recent searches element(s)
    when user clicks on a recent search
        relevant weather data is again displayed
*/

let apiKey = "5602f605cfcea993a0617227f0c3e839";
let date = dayjs().format("MMM DD, YYYY");
let searchNumber = localStorage.length;

// function getWeather (city) {}

//Get recent searches from localStorage and render as an anchor tag to #recent div
for (let i = 0; i <= localStorage.length; i++) {
  let newAnchorEl = $(`<a href="#" class="row border bg-light previous-search">`)
  let recentCity = localStorage.getItem(`city${i}`);
  newAnchorEl.text(recentCity);
  $("#recent").append(newAnchorEl);
}

$("button").on("click", function (e) {
  e.preventDefault();

  let currentCity = $("#city-search").val();
  let currentUrl = `http://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}`;

  $.ajax({
    url: currentUrl,
    method: "GET",
  }).fail(function () {
    alert('Please enter a valid city.');
    return;
  }).then(function (response) {

    let lat = response.coord.lat;
    let lon = response.coord.lon;
    let oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    let iconHtml = `https://openweathermap.org/img/wn/`;
    let imageName = response.weather[0].icon;
    let imgUrl = iconHtml + imageName + ".png";

    $.ajax({
      url: oneCallUrl,
      method: "GET",
    }).then(function (response) {
      let temp = (response.current.temp - 273.15) * 1.8 + 32;
      let humidity = response.current.humidity;
      let wind = response.current.wind_speed;
      let uvindex = response.current.uvi;

      //thanks to my classmates Spencer Rosio and Caleb Walker for the help with this weather image!
      $("#icon-today").attr("src", imgUrl);

      $("#current-day").text(`${currentCity} (${date})`);
      $("#current-temp").text(`Temperature: ${Math.floor(temp)}° F`);
      $("#current-humidity").text(`Humidity: ${humidity}`);
      $("#current-wind").text(`Wind Speed: ${wind} mph`);
      $("#current-uv").empty();
      $("#current-uv").text("UV-Index: ");
      $("#current-uv").append(
        $(`<p class='border' id="uv-condition">${uvindex}<p>`)
      );

      //set uvindex color based on uv-condition
      if (uvindex < 3) {
        $("#uv-condition").css("background-color", "skyblue");
      } else if (uvindex < 6) {
        $("#uv-condition").css("background-color", "yellow");
      } else if (uvindex < 8) {
        $("#uv-condition").css("background-color", "orange");
      } else if (uvindex < 11) {
        $("#uv-condition").css("background-color", "red");
      } else {
        $("#uv-condition").css("background-color", "rebeccapurple");
      }

      //empty search field
      $("#city-search").val("");
    });
    //save search to recent search list
    let newAnchor = $(`<a href="#" class="row border bg-light previous-search">`);
    newAnchor.text(currentCity);
    $("#recent").prepend(newAnchor);
  
    //set search to local storage
    localStorage.setItem(`city${searchNumber}`, currentCity);
    searchNumber++;
  });

  
  

  //get the 5 day forecast
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${apiKey}`;

  $.ajax({
    url: forecastUrl,
    method: "GET",
  }).then(function (response) {
    
    for (let i = 1; i < 6; i++) {

      let year = Date().substr(11, 4);
      let month = Date().substr(4, 3);
      let day = parseInt(Date().substr(8, 2)) + i;

      switch (month) {
        case "Jan":
          month = 01;
          break;
        case "Feb":
          month = 02;
          break;
        case "Mar":
          month = 03;
          break;
        case "Apr":
          month = 04;
          break;
        case "May":
          month = 05;
          break;
        case "Jun":
          month = 06;
          break;
        case "Jul":
          month = 07;
          break;
        case "Aug":
          month = 08;
          break;
        case "Sep":
          month = 09;
          break;
        case "Oct":
          month = 10;
          break;
        case "Nov":
          month = 11;
          break;
        default:
          month = 12;
      }

      let exactDate = `${year}-${month}-${day < 10 ? "0" + day : day}`;

      // this console.log breaks stuff
      // console.log(response.list[j].dt_txt.substr(0, 10));

      for (let k = 0; k < response.list.length; k++) {
        if (response.list[k].dt_txt.substr(0, 10) === exactDate) {

          let futureDay = response.list[k].dt_txt.substr(0, 10);
          let fIconHtml = `https://openweathermap.org/img/wn/`;
          let fIcon = response.list[k].weather[0].icon;
          let fImgUrl = fIconHtml + fIcon + ".png";
          let farenheit = (response.list[k].main.temp - 273.15) * 1.8 + 32;
          let fHumidity = response.list[k].main.humidity;

          // $(`#${i}`).empty();
          $(`#${i}-date`).text(futureDay);
          $(`#${i}-icon`).attr("src", fImgUrl); 
          $(`#${i}-icon`).attr("alt", "weather icon")
          $(`#${i}-temp`).text(`Temp: ${Math.floor(farenheit)}° F`);
          $(`#${i}-hum`).text(`Humidity: ${fHumidity}`);
        }
      }

      // console.log(j);
      // console.log("icon");
      // console.log(Math.floor(farenheit) + " ° F");
      // console.log(response.list[j].main.humidity);
    }
  });
});

$(document).on("click", ".previous-search", function (e) {
  e.preventDefault();
});
