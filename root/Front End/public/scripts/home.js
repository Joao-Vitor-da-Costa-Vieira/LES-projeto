import {getHome} from "/scripts/service/telaInicialService.js";

document.addEventListener('DOMContentLoaded', function() {
    const slide = document.querySelector('.carrosel-slide');
    const slides = document.querySelectorAll('.slide-item');
    const botaoAnterior = document.getElementById('botaoAnterior');
    const botaoProximo = document.getElementById('botaoProximo');
    const indicadores = document.querySelectorAll('.indicador');
    
    let counter = 0;
    const size = slides[0].clientWidth;
    const totalSlides = slides.length;

    // Posiciona o slide
    slide.style.transform = 'translateX(' + (-size * counter) + 'px)';

    // Botão próximo
    botaoProximo.addEventListener('click', () => {
        if (counter >= totalSlides - 1) return;
        counter++;
        slide.style.transition = "transform 0.5s ease-in-out";
        slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateIndicadores();
    });

    // Botão anterior
    botaoAnterior.addEventListener('click', () => {
        if (counter <= 0) return;
        counter--;
        slide.style.transition = "transform 0.5s ease-in-out";
        slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateIndicadores();
    });

    // Indicadores
    indicadores.forEach(indicador => {
        indicador.addEventListener('click', () => {
            counter = parseInt(indicador.getAttribute('data-index'));
            slide.style.transition = "transform 0.5s ease-in-out";
            slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
            updateIndicadores();
        });
    });

    // Atualiza os indicadores
    function updateIndicadores() {
        indicadores.forEach((indicador, index) => {
            if (index === counter) {
                indicador.classList.add('ativo');
            } else {
                indicador.classList.remove('ativo');
            }
        });
    }

    // Redimensionamento da janela
    window.addEventListener('resize', () => {
        slide.style.transition = "none";
        slide.style.transform = 'translateX(' + (-slides[0].clientWidth * counter) + 'px)';
    });

    document.querySelectorAll('.home-link').forEach(botao => {
            botao.addEventListener('click', (event) => {
                event.stopPropagation();
                console.log("Botão clicado!");
                getHome('1');
            });
        });
});