const apiKey = 'fbfda29a5d306b737e15fb0710487ba6';

function buscarClima() {
    const cidade = document.getElementById("cidade-input").value;
    if (!cidade) return alert("Digite uma cidade!");

    document.getElementById("loading").style.display = "block";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";
            exibirDadosClima(data);
        })
        .catch(error => {
            document.getElementById("loading").style.display = "none";
            console.error('Erro ao buscar dados:', error);
        });
}

function buscarPorLocalizacao() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                buscarClimaPorCoordenadas(latitude, longitude);
            },
            (error) => {
                alert("Erro ao acessar localização. Permita o acesso ao GPS.");
                console.error(error);
            }
        );
    } else {
        alert("Geolocalização não suportada pelo seu navegador.");
    }
}

function buscarClimaPorCoordenadas(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(url)
        .then(response => response.json())
        .then(data => exibirDadosClima(data))
        .catch(error => console.error('Erro ao buscar dados:', error));
}

function exibirDadosClima(data) {
    document.getElementById("cidade").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperatura").innerText = `🌡 ${data.main.temp.toFixed(1)}°C`;
    document.getElementById("descricao").innerText = `${data.weather[0].description}`;
    document.getElementById("icone").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById("sensacao-termica").innerText = `🌬 Sensação térmica: ${data.main.feels_like.toFixed(1)}°C`;
    document.getElementById("umidade").innerText = `💧 Umidade: ${data.main.humidity}%`;
}
