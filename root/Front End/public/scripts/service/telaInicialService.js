export async function getHome(usr_id) {
    try {
    window.location.href = `/home?usr_id=${usr_id}`;

    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
} 

export async function getHomeAdm(id) {
    try {
        window.location.href = `/home-adm?adm_id=${id}`;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
} 