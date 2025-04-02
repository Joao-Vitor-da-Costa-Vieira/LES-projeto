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