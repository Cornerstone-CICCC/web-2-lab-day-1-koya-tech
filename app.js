let resultObject = {};
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    cityName = document.getElementById('search-input').value;

    resultObject.city = cityName;

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
        .then(response => response.json())
        .then(cityData => {

            // console.log(cityData);
            let lat = cityData.results[0].latitude;
            let lon = cityData.results[0].longitude;

            let country = cityData.results[0].country;
            let timezone = cityData.results[0].timezone;
            let population = cityData.results[0].population;

            resultObject.country = country;
            resultObject.timezone = timezone;
            resultObject.population = population;

            // console.log(lat, lon);
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
                .then(response => response.json())
                .then(weatherData => {

                    console.log(weatherData);

                    let currentTemperture = weatherData.current.temperature_2m;
                    let lowTemperture = weatherData.daily.temperature_2m_min[0];
                    let highTemperture = weatherData.daily.temperature_2m_max[0];
                    let is_day = weatherData.current.is_day;

                    let elementsToChangeColor = document.querySelectorAll('.city, .countryName, .timezone, .population, .low_temparture, .high_temparture, th, h1, button, .current_temparture');

                    if (is_day === 1) {
                        document.body.style.backgroundColor = 'white';
                        elementsToChangeColor.forEach(element => {
                            element.style.color = 'black'; // Daytime color
                        });
                    } else {
                        document.body.style.backgroundColor = 'black';
                        elementsToChangeColor.forEach(element => {
                            element.style.color = 'white'; // Night color
                        });
                    }

                    resultObject.is_day = is_day;
                    resultObject.currentTemperture = currentTemperture;
                    resultObject.lowTemperture = lowTemperture;
                    resultObject.highTemperture = highTemperture;

                    console.log(resultObject);

                    updateInfo(resultObject);

                }).catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log(error);
        });
});

function updateInfo(data) {
    const city = document.querySelector('.city');
    city.textContent = data.city;

    const current_temparture = document.querySelector('.current_temparture');
    current_temparture.textContent = data.currentTemperture + '°C';

    const country = document.querySelector('.countryName');
    country.textContent = data.country;

    const timezone = document.querySelector('.timezone');
    timezone.textContent = data.timezone;

    const population = document.querySelector('.population');
    population.textContent = data.population;

    const low_temparture = document.querySelector('.low_temparture');
    low_temparture.textContent = data.lowTemperture;

    const high_temparture = document.querySelector('.high_temparture');
    high_temparture.textContent = data.highTemperture;

    data.is_day === 1 ?
        document.querySelector('.current_weather_image').innerHTML = '<img src="./images/day.jpg" alt="" class="day">' :
        document.querySelector('.current_weather_image').innerHTML = '<img src="./images/night.jpg" alt="" class="night">';

}

