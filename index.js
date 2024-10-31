// npm init 
// npm install express cors
// express - biblioteca que permite que você crie um servidor node
// cors - 

let express = require("express")
let cors = require("cors") // Importando bibliotecas

// Configurando o servidor
let app = express() // Inicializando o servidor # ENXERGUE APP COMO UM SERVIDOR
let porta = 3000 // Porta do servidor

app.use(cors()) 

// Banco de dados
let produtos = [
    {id: 1, nome: "Mouse", preco: 49.59},
    {id: 2, nome: "Teclado", preco: 109.90},
    {id: 3, nome: "Monitor", preco: 399.90}, 
    {id: 4, nome: "Microfone", preco: 219.00},
    {id: 5, nome: "Cadeira", preco: 539.80},
    {id: 6, nome: "Mesa", preco: 299.70},
    {id: 7, nome: "Fone", preco: 99.99}
]
// Configurando a rota
app.get("/", (req, res) => res.send("Rota inicial")) // Função simplificada 
// req = requisição; res = resposta; send = envia; "/" = caminho do servidor ( barra = home )

// http://127.0.0.1:3000/produtos
app.get("/produtos", (req, res) => {
    res.send(produtos)
})

// http://127.0.0.1:3000/produto/3
// /produto/:id = o ":id" é um parâmetro, logo espera um argumento, por exemplo o id 2.
app.get("/produto/:id", (req, res) => {
    // req.params armazena todos os parâmetros da rota
    let id = req.params.id

    for (let prod of produtos) {
        if (prod.id == id) {
            res.send(prod)
        }
    }
    res.send({mensagem: "Produto não encontrado"})
})

// Criar uma rota /produtos/preco_max/:preco
// Onde retorne os produtos que custem, no máximo, o preço informado
app.get("/produtos/preco_max/:preco", (req, res) => {
    let preco = Number(req.params.preco);
    let produtosFiltrados = []

    for (let prod of produtos) {
        if (prod.preco <= preco) {
            produtosFiltrados.push(prod)
        }
    }    
    res.send(produtosFiltrados)
})
    
// Subindo servidor 
app.listen(porta, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${porta}`)
})

// ctrl + c = close servidor

// get -> pegar informações 
// post -> cria novas informações
// put -> alterar informações existentes
// delete -> apagar informações existentes

// get & delete -> não possuem corpo (body) #Não guarda nenhum tipode informação na memória
// post & put -> possuem corpo (body) #Guardam informação na memória

