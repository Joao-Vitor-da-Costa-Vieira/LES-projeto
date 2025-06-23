export async function solicitarDevolucao(id) {
    try {
        window.location.href = `/devolucoes?tra_id=${id}`;
    } catch (error) {
        console.error(`Erro no solicitarDevolucao - serviceDevolucoes: ${err}`);
        throw err;
    }
}