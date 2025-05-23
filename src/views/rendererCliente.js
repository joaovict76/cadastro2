// Captura dos botões (certifique-se de que eles existem no seu HTML)
const btnCreate = document.getElementById('btnCreate');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');

// Buscar CEP com validação
function buscarCEP() {
    let cep = document.getElementById('inputCEPClient').value.trim();

    // Validação básica do CEP (8 dígitos numéricos)
    if (!/^\d{8}$/.test(cep)) {
        alert("CEP inválido. Digite um CEP com 8 números.");
        return;
    }

    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            if (dados.erro) {
                alert("CEP não encontrado!");
                return;
            }
            document.getElementById('inputAddressClient').value = dados.logradouro || '';
            document.getElementById('inputNeighborhoodClient').value = dados.bairro || '';
            document.getElementById('inputCityClient').value = dados.localidade || '';
            document.getElementById('inputUFClient').value = dados.uf || '';
        })
        .catch(error => console.log(error));
}

// Foco na busca pelo nome do cliente
const foco = document.getElementById('searchClient');

// Vetor global para dados dos clientes
let arrayClient = [];

// Inputs do formulário
const frmClient = document.getElementById('formClient');
const nameClient = document.getElementById('inputNameClient');
const cpfClient = document.getElementById('inputCPFClient');
const emailClient = document.getElementById('inputEmailClient');
const phoneClient = document.getElementById('inputPhoneClient');
const cepClient = document.getElementById('inputCEPClient');
const addressClient = document.getElementById('inputAddressClient');
const numberClient = document.getElementById('inputNumberClient');
const complementClient = document.getElementById('inputComplementClient');
const neighborhoodClient = document.getElementById('inputNeighborhoodClient');
const cityClient = document.getElementById('inputCityClient');
const ufClient = document.getElementById('inputUFClient');
const idClient = document.getElementById('inputIdClient');

// Inicializar a janela e botões ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    btnCreate.disabled = false;
    foco.focus();
});

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

// Validação e feedback visual para CPF enquanto o usuário digita
cpfClient.addEventListener('input', () => {
    let mensagemCPF = document.getElementById('mensagem-cpf');
    if (!validarCPF(cpfClient.value)) {
        mensagemCPF.textContent = "CPF inválido!";
        mensagemCPF.style.color = "red";
        cpfClient.style.borderColor = "red";
    } else {
        mensagemCPF.textContent = "";
        cpfClient.style.borderColor = "";
    }
});

// Manipulação do Enter para buscar cliente com tecla Enter
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchName();
    }
}

frmClient.addEventListener('keydown', teclaEnter);

function restaurarEnter() {
    frmClient.removeEventListener('keydown', teclaEnter);
}

// Função para montar objeto cliente, evita duplicação
function montarObjetoCliente() {
    return {
        nameCli: nameClient.value,
        cpfCli: cpfClient.value,
        emailCli: emailClient.value,
        phoneCli: phoneClient.value,
        cepCli: cepClient.value,
        addressCli: addressClient.value,
        numberCli: numberClient.value,
        complementCli: complementClient.value,
        neighborhoodCli: neighborhoodClient.value,
        cityCli: cityClient.value,
        ufCli: ufClient.value
    };
}

// CRUD Create / Update - submit do formulário
frmClient.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (idClient.value === "") {
        // Criar novo cliente
        const client = montarObjetoCliente();
        api.newClient(client);
    } else {
        // Atualizar cliente existente
        const client = montarObjetoCliente();
        client.idCli = idClient.value;
        api.updateClient(client);
    }
});

// IPC para setar nome e CPF no formulário após buscas
api.setName(() => {
    let busca = foco.value;
    foco.value = "";
    nameClient.focus();
    nameClient.value = busca;
    restaurarEnter();
});

api.setCpf(() => {
    let busca = foco.value;
    foco.value = "";
    cpfClient.focus();
    cpfClient.value = busca.replace(/\D/g, "");
    restaurarEnter();
});

// Função para buscar cliente pelo nome
function searchName() {
    let cliName = foco.value;
    if (cliName === "") {
        api.validateSearch();
    } else {
        api.searchName(cliName);
        api.renderClient((event, client) => {
            const clientData = JSON.parse(client);
            arrayClient = clientData;

            arrayClient.forEach(c => {
                idClient.value = c._id;
                nameClient.value = c.nomeCliente;
                cpfClient.value = c.cpfCliente;
                emailClient.value = c.emailCliente;
                phoneClient.value = c.foneCliente;
                cepClient.value = c.cepCliente;
                addressClient.value = c.logradouroCliente;
                numberClient.value = c.numeroCliente;
                complementClient.value = c.complementoCliente;
                neighborhoodClient.value = c.bairroCliente;
                cityClient.value = c.cidadeCliente;
                ufClient.value = c.ufCliente;

                restaurarEnter();
                btnCreate.disabled = true;
                btnUpdate.disabled = false;
                btnDelete.disabled = false;
            });
        });
    }
}

// CRUD Delete
function removeClient() {
    if (idClient.value !== "") {
        api.deleteClient(idClient.value);
    } else {
        alert("Nenhum cliente selecionado para exclusão.");
    }
}

// Resetar formulário (recarregar a página)
function resetForm() {
    arrayClient = [];
    location.reload();
}

api.resetForm(() => {
    resetForm();
});
