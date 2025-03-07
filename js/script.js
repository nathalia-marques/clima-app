document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "fbfda29a5d306b737e15fb0710487ba6";
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

    document.getElementById("localizacao-btn").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    buscarPrevisaoPorCoordenadas(position.coords.latitude, position.coords.longitude, apiKey, apiUrl);
                },
                error => {
                    alert("Erro ao obter localização: " + error.message);
                }
            );
        } else {
            alert("Geolocalização não é suportada pelo seu navegador.");
        }
    });
});

function buscarPrevisao() {
    const cidade = document.getElementById("cidade").value;
    if (!cidade) return alert("Digite o nome de uma cidade.");
    fetchPrevisao(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=fbfda29a5d306b737e15fb0710487ba6&units=metric&lang=pt_br`);
}

function buscarPrevisaoPorCoordenadas(lat, lon, apiKey, apiUrl) {
    fetchPrevisao(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`);
}

function fetchPrevisao(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar os dados");
            return response.json();
        })
        .then(data => atualizarDados(data))
        .catch(error => console.error("Erro:", error));
}

function atualizarDados(data) {
    const hoje = new Date();
    document.getElementById("cidade-nome").innerHTML = `<strong>${data.city.name}</strong>`;
    document.getElementById("temperatura").innerText = `${Math.round(data.list[0].main.temp)}°C`;
    document.getElementById("descricao").innerText = data.list[0].weather[0].description;
    document.getElementById("umidade").innerText = `Umidade: ${data.list[0].main.humidity}%`;
    document.getElementById("sensacao-termica").innerText = `Sensação térmica: ${Math.round(data.list[0].main.feels_like)}°C`;
    document.getElementById("fase-da-lua").innerText = atualizarFaseDaLua(hoje);
    
    atualizarAnimacaoClima(data.list[0].weather[0].main);
    atualizarPrevisao5Dias(data.list);
}

function atualizarAnimacaoClima(clima) {
    const iconeContainer = document.getElementById("icone-container");
    let animacao = "nuvem.json";
    switch (clima.toLowerCase()) {
        case "clear": animacao = "sol.json"; break;
        case "clouds": animacao = "nuvem.json"; break;
        case "rain": animacao = "chuva.json"; break;
        case "thunderstorm": animacao = "tempestade.json"; break;
        case "snow": animacao = "neve.json"; break;
    }
    iconeContainer.innerHTML = `<lottie-player src="lottie/clima/${animacao}" background="transparent" speed="1" loop autoplay></lottie-player>`;
}

function atualizarFaseDaLua(data) {
    const faseLuaContainer = document.getElementById("fase-lua-container");
    const fases = ["lua-nova.json", "lua-crescente.json", "lua-quarto-crescente.json", "lua-gibosa-crescente.json", "lua-cheia.json", "lua-gibosa-minguante.json", "lua-quarto-minguante.json", "lua-minguante.json"];
    const nomesFases = ["Lua Nova", "Lua Crescente", "Quarto Crescente", "Gibosa Crescente", "Lua Cheia", "Gibosa Minguante", "Quarto Minguante", "Lua Minguante"];
    const diasDesdeLuaNova = (data - new Date("2024-02-09")) / (1000 * 60 * 60 * 24) % 29.53;
    const faseIndex = Math.floor((diasDesdeLuaNova / 29.53) * 8) % 8;
    
    faseLuaContainer.innerHTML = `<lottie-player src="lottie/lua/${fases[faseIndex]}" background="transparent" speed="1" loop autoplay></lottie-player>`;
    return nomesFases[faseIndex];
}

function atualizarPrevisao5Dias(lista) {
    const previsaoContainer = document.getElementById("previsao-container");
    previsaoContainer.innerHTML = "";
    const diasExibidos = new Set();
    
    lista.forEach(item => {
        const data = new Date(item.dt_txt);
        const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });
        const dataFormatada = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        
        if (!diasExibidos.has(diaSemana)) {
            diasExibidos.add(diaSemana);
            const iconeClima = selecionarAnimacaoClima(item.weather[0].main);
            previsaoContainer.innerHTML += `
                <div class="previsao-item">
                <!-- Esquerda: Nome do dia e Data -->
                <div class="previsao-info">
                    <strong>${diaSemana}</strong>
                    <p>${dataFormatada}</p>
                </div>

                <!-- Centro: Animação do clima -->
                <lottie-player src="lottie/clima/${iconeClima}" background="transparent" speed="1" loop autoplay></lottie-player>

                <!-- Direita: Temperaturas no formato Máx/Mín -->
                <div class="previsao-temp">
                    <p>${Math.round(item.main.temp_max)}°/${Math.round(item.main.temp_min)}°</p>
                </div>
            </div>`;

        }
    });
}

function selecionarAnimacaoClima(clima) {
    switch (clima.toLowerCase()) {
        case "clear": return "sol.json";
        case "clouds": return "nuvem.json";
        case "rain": return "chuva.json";
        case "thunderstorm": return "tempestade.json";
        case "snow": return "neve.json";
        default: return "nuvem.json";
    }
}
