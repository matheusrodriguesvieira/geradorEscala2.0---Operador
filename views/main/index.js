var turma;
var listaEscalaDaTurma;
var token;
var usuario;
// -----------------------------VARIÁVEIS DE BANCO DE DADOS-----------------------------

// USADA PARA GUARDAR OS OPERADORES DISPONÍVEIS DO BANCO DE DADOS;
// USADA PARA GUARDAR A ESCALA FINAL;
// USADA PARA GUARDAR TODAS AS ESCALAS
var listaEscalas = [];
// ---------------------------------------------------------------------------------------


// -----------------------------VARIÁVEIS DE EVENTOS-----------------------------


var tituloEscalas = document.querySelector('[tituloEscalas]');
let select = document.querySelector('[name = selectTurmas]');
var ulListaEscalas = document.querySelector('.listaContainer > ul');
// ---------------------------------------------------------------------------------------

// FUNÇÕES DO BANCO DE DADOS
// ---------------------------------------------------------------------------------------

async function resetarParametros() {
    const listaEscalaUrl = `https://backend-rotas-alternativas.vercel.app/listaEscalas/index?turma=${turma}`;
    const CONFIGURACAO = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: token
        }
    };


    await fetch(listaEscalaUrl, CONFIGURACAO)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            return response.json();
        })
        .then(dados => {

            if (dados.error) {
                Toastify({
                    text: dados.message,
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "rgba(192, 57, 43,1.0)",
                    }
                }).showToast();
                setTimeout(() => {
                    window.location.replace('../login/index.html');
                }, 3000);
            } else {
                listaEscalaDaTurma = dados;
            }
        })
        .catch(error => {
            // Lida com erros durante a requisição
            console.error(error);
            console.error('Erro na requisição:', error);
            console.error('Resposta do servidor:', error.response);
        });
}



// ATUALIZA O TÍTULO E O PARAMETRO DA TURMA
function atualizarTituloEscalas() {
    turma = select.value;
    // console.log(turma);
    // console.log(tituloEscalas);
    tituloEscalas.innerHTML = '';
    tituloEscalas.innerHTML = `Escalas Turma ${turma.toUpperCase()}`;
}

function atualizarTelaEscalas() {
    ulListaEscalas.innerHTML = '';

    if (listaEscalaDaTurma.message != null) {
        ulListaEscalas.innerHTML += `
        <li>
            ${listaEscalaDaTurma.message}
        </li>
        `;
    } else {
        listaEscalaDaTurma.forEach((escala, index) => {
            ulListaEscalas.innerHTML += `
            <li id="${escala.idlista}">
                <div class="liContainer">
                    <div id="nome-lista-${index}">${escala.nomelista}</div>
                    <div>${escala.datacriacao} ${escala.horariocriacao}</div>
                    <div class="controlesContainer">
                        <a class="icon" infoEscala${index}>
                            <img src="../../assets/images/info.png" alt="" srcset="">
                        </a>
                    </div>
                </div>
            </li>
            `;
        });

        let lis = document.querySelectorAll(`.listaContainer > ul > li`);
        lis.forEach((li, index) => {
            let btnInfoEscala = document.querySelector(`[infoEscala${index}]`);
            let nomeLista = document.querySelector(`#nome-lista-${index}`);


            // PARTE RESPONSÁVEL POR DETALHES DA ESCALA
            btnInfoEscala.addEventListener('click', () => {
                let idLista = listaEscalaDaTurma[index].idlista;
                sessionStorage.setItem('idLista', JSON.stringify(idLista));
                mostrarTela2();
            });


            nomeLista.addEventListener('click', () => {
                let idLista = listaEscalaDaTurma[index].idlista;
                sessionStorage.setItem('idLista', JSON.stringify(idLista));
                mostrarTela2();
            });

        });
    }




}

// FUNÇÃO RESPONSÁVEL POR CARREGAR TODOS OS EVENTOS E FUNCIONALIDADES DA APLICAÇÃO
async function carregarAplicacao() {
    atualizarTituloEscalas();
    await resetarParametros();
    atribuirEventos();
    atualizarTelaEscalas();
}

function mostrarTela2() {

    window.location.href = '../table/index.html';
    sessionStorage.setItem('turma', turma);
}

function atribuirEventos() {
    select.addEventListener('change', async () => {
        let componentLoading = document.querySelector('.component-loading-container');
        componentLoading.classList.toggle('mostrar');
        atualizarTituloEscalas();
        await resetarParametros();
        atualizarTelaEscalas();
        componentLoading.classList.toggle('mostrar');
    })

}


window.addEventListener('load', async () => {

    if (sessionStorage.getItem('data') == null) {

        window.location.replace('../login/index.html');
    } else {
        let loading = document.querySelector('.screen-loading-container');
        let data = JSON.parse(sessionStorage.getItem('data'));
        token = data.token;
        usuario = data.usuario;


        const URI = `https://backend-rotas-alternativas.vercel.app/validate-token/operador`;
        const CONFIGURAÇÃO = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
        }

        await fetch(URI, CONFIGURAÇÃO)
            .then(response => {
                return response.json();
            })
            .then(async dados => {
                if (dados.error) {
                    Toastify({
                        text: dados.message,
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "rgba(192, 57, 43,1.0)",
                        }
                    }).showToast();

                    setTimeout(() => {
                        window.location.replace('../login/index.html');
                    }, 3000);
                } else {
                    await carregarAplicacao();
                }
            })
            .catch(error => error.response);

        loading.classList.toggle('mostrar');
    }
});
