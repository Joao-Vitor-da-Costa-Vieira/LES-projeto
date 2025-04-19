export async function getHome(usr_id) {
    try {
        console.log(usr_id);
        window.location.href = `/home/${usr_id}`;
        const data = await res.json(); 
        return data;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
} 

export async function getHomeAdm() {
    try {
        window.location.href = `/home-adm`;
        const data = await res.json(); 
        return data;
    } catch (err) {
        console.error("Falha no fetch:", err);
        throw err;
    }
} 