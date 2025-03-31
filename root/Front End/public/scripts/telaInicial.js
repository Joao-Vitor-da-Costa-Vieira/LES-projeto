document.querySelectorAll('.botao-usuario').forEach(botao => {
    botao.addEventListener('click', function (event) {
        event.stopPropagation();

        
    })
})