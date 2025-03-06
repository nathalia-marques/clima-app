const apiKey = "fbfda29a5d306b737e15fb0710487ba6";
const weatherIcons = {
    "Clear": "https://assets10.lottiefiles.com/packages/lf20_tbrwjiv5.json", // Sol
    "Clouds": "https://assets10.lottiefiles.com/packages/lf20_VAmWRg.json", // Nuvens
    "Rain": "https://assets2.lottiefiles.com/private_files/lf30_rquf3n6v.json", // Chuva
    "Snow": "https://assets2.lottiefiles.com/private_files/lf30_jgltrtzl.json" // Neve
};

function buscarClima() {
    const cidade = document.getElementById("cidade").value;
    if (!cidade) {
        alert("Por favor, digite uma cidade!");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Cidade não encontrada!");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("cidade-nome").textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById("temperatura").textContent = `Temperatura: ${data.main.temp}°C`;
            document.getElementById("descricao").textContent = `Descrição: ${data.weather[0].description}`;
            document.getElementById("sensacao-termica").textContent = `Sensação térmica: ${data.main.feels_like}°C`;
            document.getElementById("umidade").textContent = `Umidade: ${data.main.humidity}%`;

            // Atualizar ícone animado
            updateWeatherIcon(data.weather[0].main);
        })
        .catch(error => {
            alert("Erro ao buscar dados: " + error.message);
        });
}

function updateWeatherIcon(weatherType) {
    const iconContainer = document.getElementById("weather-icon");
    const iconUrl = weatherIcons[weatherType] || weatherIcons["Clear"]; // Default: Sol

    iconContainer.innerHTML = `
        <lottie-player src="${iconUrl}" 
            background="transparent" 
            speed="1" 
            style="width: 100px; height: 100px;" 
            loop 
            autoplay>
        </lottie-player>
    `;
}
