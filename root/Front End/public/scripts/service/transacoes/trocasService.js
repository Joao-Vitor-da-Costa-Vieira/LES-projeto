export async function solicitarTroca(id) {
    try {
        window.location.href = `/trocas?tra_id=${id}`;
    } catch (error) {
        console.error(`Erro no solicitarTroca - serviceTrocas: ${err}`);
        throw err;
    }
}