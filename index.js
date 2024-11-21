// express - biblioteca que permite que você crie um servidor node
// cors - 

let express = require("express")
let cors = require("cors") // Importando bibliotecas
let multer =  require("multer")
let path = require("path")
let fs = require("fs") // Fyle  System

// Configurando o servidor
let app = express() // Inicializando o servidor # ENXERGUE APP COMO UM SERVIDOR
let porta = 3000 // Porta do servidor

app.use(cors()) 
app.use(express.json());
app.use("/fotos", express.static(path.join(__dirname,"fotos"))) // Para acessar as fotos

// Banco de dados
// let produtos = [
//     {id: 1, nome: "Mouse", preco: 49.59, foto: "1.jpeg"},
//     {id: 2, nome: "Teclado", preco: 109.90, foto: "2.jpeg"},
//     {id: 3, nome: "Monitor", preco: 399.90, foto: "3.jpeg"}, 
// ]

let arq = fs.readFileSync("bd.json", { encoding: "utf-8" }) //Abrir formato de texto;

let produtos = JSON.parse(arq) // Converte um texto em JSON, se aplicável
console.log(/*typeof*/ produtos); // String

// upload / Multer
let storage_func = multer.diskStorage({ //Armazenamento por disco
    destination: (req, file, cb) => { // Cb = callback (função que será chamada quando o arquivo for salvo)
        cb(null, "fotos/") // Por onde vai salvar
    }, 
    filename: (req, file, cb) => {
        let novo_id = pega_proximo_id();
        let novo_nome = novo_id + path.extname(file.originalname);
        cb(null, novo_nome);
    }
})

let upload = multer({ storage: storage_func }); //Definindo como será o armaz. do arquivo enviado

function pega_proximo_id(){
    let novo_id = 0
    for (prod of produtos) {
        novo_id = prod.id;
    }
    novo_id++;
    return novo_id;
}

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

// middleware -> função que é executada antes de uma rota
app.post("/produtos", upload.single("foto"), (req, res) => {
    let nome = req.body.nome;
    let preco = req.body.preco;
    let foto = req.file.filename;

    console.log(req.file)

    let novo_id = 0;
    for(prod of produtos){
        novo_id = prod.id
    }
    novo_id++

    let novo_produto = { id: novo_id, nome: nome, preco: preco, foto: foto}
    produtos.push(novo_produto)

    let str_json = JSON.stringify(produtos, null, 2) // Converte um JSON em texto
    fs.writeFileSync("bd.json", str_json) // Salva o texto no arquivo


    res.send("Produto alterado com sucesso",  novo_produto )
})

//CRIAR ROTA PUT /PRODUTO/:ID

app.put("/produto/:id", (req, res) => {
    let id = req.params.id;
    let nome = req.body.nome;
    let preco = req.body.preco;
    
    // let prod = null;
    // for(let p of produtos){
    //     if(p.id == id){
    //         prod = p;
    //         break
    //     }
    // }

    let p = produtos.find( p => p.id == id)

    if ( p == undefined){
        res.send({mensagem: "Produto não encontrado"})
        return
    }
    p.nome = nome;
    p.preco = preco;
    res.send(p)
})

//CRIAR ROTA DELETE /PRODUTO/:ID

app.delete("/produto/:id", (req, res) => {
    let id = req.params.id;

    let index = produtos.findIndex(p => p.id == id)
    if (index == undefined){
        res.send({mensagem: "Produto não encontrado!"})
        return
    }
    produtos.splice(index, 1)
    res.send({mensagem: "Produto deletado!"})
}) 

// ctrl + c = close servidor

// get -> pegar informações 
// post -> cria novas informações
// put -> alterar informações existentes
// delete -> apagar informações existentes

// get & delete -> não possuem corpo (body) #Não guarda nenhum tipode informação na memória
// post & put -> possuem corpo (body) #Guardam informação na memória

