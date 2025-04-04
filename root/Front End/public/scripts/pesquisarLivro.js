const value = document.querySelector("#valor");
const slider = document.querySelector("#preco");
const cifra = document.querySelector("#cifra");

value.textContent = slider.value === "501" ? "Nulo" : slider.value;

slider.addEventListener("input", (event) => {
    if (event.target.value === "501") {
        cifra.textContent = "";
        value.textContent = "Nulo";
    } else {
        cifra.textContent = "R$"
        value.textContent = event.target.value;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const botaoFiltro = document.querySelector('.botao-mais-filtro');
    const elementosOcultos = document.querySelectorAll('.hidden');

    botaoFiltro.addEventListener('click', function() {
        elementosOcultos.forEach(function(elemento) {
            elemento.classList.toggle('hidden'); // Alterna a classe
        });

        // Alterna o texto do botão
        if (botaoFiltro.textContent.includes('Mais')) {
            botaoFiltro.textContent = 'Menos opções de filtragem';
        } else {
            botaoFiltro.textContent = 'Mais opções de filtragem';
        }
    });
});