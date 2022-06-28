const express = require('express');
const request = require('request');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
//Arrays para armazenar os dados pesquisados da API pública
var arrayDolar = [];
var arrayEuro = [];
var arrayBTC = [];

//API de cotações de moedas -----------------
const moedas = 'USD-BRL,EUR-BRL,BTC-BRL'
const options = {
    url: `https://economia.awesomeapi.com.br/last/${moedas}`, //URL da API pública, com as moedas definidas como constante.
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
}
const callback_todas_cotacoes = function(erro, res, body){ //Chamada que retorna os valores das cotações, juntamente com seu nome, data,
    let json = JSON.parse(body)                            //entre outros atributos de cada cotação.
    console.log(json)
}
const callback_dolar = function(erro, res, body){ //Retorna apenas o "bid" (cotação em si) e a data da última atualização.
    let json = JSON.parse(body)
    cotacao = json.USDBRL['bid']
    dia = json.USDBRL['create_date']

    if(cotacao < 6){//Varredura do array: a cotacção do dólar só será adicionada ao arrayDolar e impressa no console se for abaixo de R$6,00
        arrayDolar.push(cotacao)
        console.log('DOLAR = R$'+cotacao+' dia: '+dia)
    } 
}
const callback_euro = function(erro, res, body){
    let json = JSON.parse(body)
    cotacao = json.EURBRL['bid']
    dia = json.EURBRL['create_date']

    if(cotacao < 7){//Varredura do array: a cotacção do EURO só será adicionada ao arrayEURO e impressa no console se for abaixo de R$7,00
        arrayEuro.push(cotacao)
        console.log('EURO = R$'+cotacao+' dia: '+dia)
    }   
    
}
const callback_btc = function(erro, res, body){
    let json = JSON.parse(body)
    cotacao = json.BTCBRL['bid']
    dia = json.BTCBRL['create_date']

    if(cotacao < 150){ //Varredura do array: a cotacção do BITCOIN só será adicionada ao arrayBTC e impressa no console se for abaixo de R$150,00
        arrayBTC.push(cotacao)
        console.log('BITCOIN = R$'+cotacao+' dia: '+dia)
    }   
    
}
request(options, callback_dolar); //Realiza as primeiras requisições
request(options, callback_euro);
request(options, callback_btc);
setInterval (() =>{ //Uma vez por dia, realiza outra resquisições
    request(options, callback_dolar);
    request(options, callback_euro);
    request(options, callback_btc);
}, 86400000)
//86400000 -> 1 dia em milisegundos.

//--------------------------------------------------
//Contrução da API
const pessoas = ['Rafael', 'Clara', 'Vitor']; //Será uma API simples de pessoas
//Retorna um pessoa através de params
app.get('/pessoas/:id', (req,resp) =>{ 
    const {id} = req.params;
    return resp.json(pessoas[id]);
});
//Retorna um pessoa através de query - 
app.get('/pessoa', (req,resp) =>{
    return resp.json(pessoas[req.query.id]);
});
//Retorna todas as pessoas
app.get('/pessoas', (req,resp) => {
    resp.send(pessoas);
});
//Cria uma novo pessoa
app.post('/pessoas', (req, resp) => {
    const {name} = req.body;
    pessoas.push(name);
    return resp.json(pessoas);
});
// Atualizar uma pessoa por id
app.put('/pessoas/:id', (req, resp) =>{
    const {id} = req.params;
    const {name} = req.body;

    pessoas[id] = name;
    return resp.json(pessoas);
});
//Deletar uma pessoa por id
app.delete('/pessoas/:id', (req, resp) =>{
    const {id} = req.params;
    pessoas.splice(id,1);
    return resp.json ({message : "A pessoa foi deletada"})
});
//Métodos relacionados às cotações
//Receber cotacões do dolar, euro e BITCOIN
app.get('/cotacoes/:cot', (req,resp) => { //parametros: dolar | euro | btc
    const {cot} = req.params;
    if(cot == 'dolar') //Caso o parâmetro passado for 'dolar', recebe o array de dolar
    resp.send(arrayDolar);
    else if(cot == 'euro') //Caso o parâmetro passado for 'euro', recebe o array de euro
    resp.send(arrayEuro);
    if(cot == 'btc') //Caso o parâmetro passado for 'btv', recebe o array de bitcoin
    resp.send(arrayBTC);
});
app.listen(port, ()=>{
    console.info("Aplicação rodando em http://localhost:3000")
});

