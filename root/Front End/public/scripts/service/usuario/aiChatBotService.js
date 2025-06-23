export async function obterRespostaIa(msg, usr_id){

    try{
        const res = await fetch('http://localhost:8000/ai',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                msg: msg,
                usr_id: usr_id  
            })
        });

        //Obtendo o msg
        msg = await res.json();
        return msg.ai_res;

    }catch(err){
        console.log(`Erro no assistent.js: ${err}`);
        throw err;
    }
}