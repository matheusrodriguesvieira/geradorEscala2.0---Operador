var turma;
// USADA PARA GUARDAR A ESCALA FINAL;
var escala;
// USADA PARA GUARDAR TODAS AS ESCALAS
var listaEscalas;
var idLista;
// ---------------------------------------------------------------------------------------


// -----------------------------VARIÁVEIS DE EVENTOS-----------------------------


var btnMostrarTela1 = document.querySelector('[voltar]');
var btnTela4Voltar = document.querySelector('[tela4Voltar]');

// ---------------------------------------------------------------------------------------

// FUNÇÕES DO BANCO DE DADOS
// ---------------------------------------------------------------------------------------
async function fetchData(method, data, param) {

    if (method == 'GET') {
        const URI = `https://backend-rotas-alternativas.vercel.app/listaEscalas/show/${param}`;


        await fetch(URI)
            .then(resposta => resposta.json()) // Converte a resposta para JSON
            .then(dadosResposta => {
                listaEscalas = dadosResposta;
            })
            .catch(erro => console.error('Erro:', erro));

    }
}

function renderizarEscala(escala, operadoresForaEscala) {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    escala.sort((a, b) => {
        return a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0;
    })

    // COR ESPECIAL DE ACORDO COM O ESTADO DO EQUIPAMENTO
    escala.forEach((element, index) => {
        let className;

        if (element.nome == "falta de operador") {
            className = 'semOperador';
        } else if (element.nome == 'manutenção') {
            className = 'manutencao';
        } else if (element.nome == "indisponível") {
            className = 'indisponivel';
        } else if (element.nome == "infraestrutura") {
            className = 'infraestrutura';
        } else if (element.nome == "treinamento") {
            className = 'treinamento';
        } else {
            className = "";
        }

        let novaLinha = `
                            <tr id=${index}>
                                <td col1 class="${className}"><label for="col1${index}">${element.tag}</label></td>
                                <td col2 class="${className}"><label for="col2${index}">${element.nome}</label></td>
                                <td col3 class="${className}"><label for="col3${index}">${element.localizacao}</label></td>
                                <td col4 class="${className}"><label for="col4${index}">${element.transporte}</label></td>
                                <td col5 class="${className}"><label for="col5${index}">${element.atividade}</label></td>
                            </tr>
            
            `;
        tbody.innerHTML += novaLinha;
    });

    let ulOperadoresForaEscala = document.querySelector('.operadoresForaEscalaContainer > ul');
    ulOperadoresForaEscala.innerHTML = '';
    // console.log(operadoresForaEscala);
    if (operadoresForaEscala.length > 0) {
        operadoresForaEscala.forEach(operador => {
            let li = `
            <li>${operador.nome}</li>
        `;

            ulOperadoresForaEscala.innerHTML += li;
        });
    }
}

async function carregarAplicacao() {
    turma = sessionStorage.getItem('turma');

    listaEscalas = {};

    if (sessionStorage.getItem("idLista") != null) {

        idLista = JSON.parse(sessionStorage.getItem("idLista"));
        await fetchData("GET", "", idLista);

        renderizarEscala(listaEscalas.escala, listaEscalas.operadoresForaEscala);

    }
    atribuirEventos();
}

function atribuirEventos() {
    // // BOTAO VOLTAR DA TELA 2
    btnMostrarTela1.addEventListener('click', () => {
        window.location.replace = '../Main/index.html';
    });
}





window.addEventListener('load', async () => {
    if (sessionStorage.getItem('turma') == null) {
        window.location.replace('../Main/index.html');
    }

    let loading = document.querySelector('.screen-loading-container');

    await carregarAplicacao();
    loading.classList.toggle('mostrar');
});
