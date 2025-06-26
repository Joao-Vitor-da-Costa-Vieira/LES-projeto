export async function getHome(usr_id) {
    try {
        window.location.href = `/home?usr_id=${usr_id}`;
        const data = await res.json(); 
        return data;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
} 

export async function getHomeAdm(id) {
    try {
        window.location.href = `/home-adm?adm_id=${id}`;
        const data = await res.json(); 
        return data;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
} 