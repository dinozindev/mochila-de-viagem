// Seleciona o formulário <form> do documento HTML
const form = document.getElementById("newItem");
// Seleciona o elemento <ul> do documento HTML
const list = document.getElementById("lista");

// array criada para armazenar os itens da localStorage.
// quando enviamos os itens para a array "items", eles chegam como forma de string, e não como array. Por isso, devemos usar a propriedade 'JSON.parse' para transformar as strings em arrays novamente para que possamos executar funções como o 'forEach' novamente.
// antes de criar um array vazio, o JS irá procurar se ja há algum item existente. Caso o contrário, um array vazio será criado. 
const items = JSON.parse(localStorage.getItem("items")) || []

// a página, ao ser carregada, busca os elementos da localStorage dentro da array 'items', aplicando a função createItem, criando cada um dos elementos na lista que é mostrada na página, mesmo após ser atualizada.
items.forEach ((elemento) => {
    createItem(elemento)
})

// localStorage.clear()

    // Ao formulário ser enviado, o evento será acionado através de 'submit', executando a arrow function. 'e.preventDefault()' fará com que o evento de envio do formulário seja cancelado para que o restante da arrow function seja executada.
    form.addEventListener("submit", (e) => {
    e.preventDefault();

    // variáveis para os dois parâmetros obtidos através do formulário a fim de diminuir linhas de código.
    const name = e.target.elements['name']
    const quantity = e.target.elements['quantity']

    // toda vez que um novo item é enviado, perguntamos ao array items se ele já existe através do .find. Caso ele exista, ele é guardado na const exist. Caso contrário, ele é definido como undefined.
    const exist = items.find( elemento => elemento.name === name.value )
    
    // o item a ser adicionado na localStorage foi transformado em um objeto JS, com 2 propriedades: nome e quantidade, que serão obtidas após o envio do formulário, obtendo os valores informados.
    const actualItem = {
        'name': name.value,
        'quantity': quantity.value
    }
    
    // caso o item adicionado através do formulário já exista, o item será atualizado através da function updateElement.
    if(exist) {
        actualItem.id = exist.id

        updateElement(actualItem)

    // dentro da array, sobreescrevemos/trocamos o conteúdo já existente pelo item atual informado de mesmo id, passando a informação para o localStorage. Buscamos dentro do array o índice do elemento que possui o mesmo id da const exist.
        items[items.findIndex(elemento => elemento.id === exist.id)] = actualItem;
    } else { 
        // caso existirem elementos dentro do array items, o id do elemento novo será o id do último elemento do array + 1. Caso não houverem elementos dentro do array, ou seja, um array vazio, o id do elemento será 0. Ex: se o último item tiver o id = 2, o próximo item adicionado terá id = 3.
        actualItem.id = items[items.length -1] ? (items[items.length-1]).id + 1 : 0

    // o evento aciona a function createItem, que irá criar um item dentro da array items a partir das informações obtidas na variável objeto actualItem.
    createItem(actualItem);

    // envia os itens adicionados para a array items.
    items.push(actualItem);
    }

    // para adicionarmos itens na localStorage, usamos .setItem. Porém, como nosso item está em formato de objeto, precisamos modificar seu valor. Para isso, utilizamos a propriedade JSON.stringify, que transformará o objeto em uma string. No entanto, quando adicionamos um item a localStorage, ele sobrepõe outro já existente. Para que isso não aconteça, criamos uma array (const items = []) em que os itens adicionados serão armazenados como uma lista. Portanto, não estamos transformando apenas o item recém adicionado em uma string, mas sim a array como um todo. 
    localStorage.setItem("items", JSON.stringify(items));
    
   // esvaziar a caixa de texto após dar submit em um item ou valor.
    name.value = ""
    quantity.value = ""
})

function createItem(item) {
    // Cria um elemento com a tag <li>
    const addItem = document.createElement('li')
    // Adiciona a classe 'item' em <li>
    addItem.classList.add("item");

    // Cria o elemento <strong>
    const numberItem = document.createElement('strong')
    // Insere o conteúdo 'quantity' (quantidade informada no formulário) dentro de <strong>
    numberItem.innerHTML = item.quantity;
    
    // Adiciona um data-id em <strong> baseado na const actualItem.
    numberItem.dataset.id = item.id

    // Anexa o elemento numberItem (<strong>quantity</strong>) como elemento filho de addItem (<li>)
    addItem.appendChild(numberItem);
    // Insere o valor de 'name' (nome do item informado no formulário) dentro de <li>
    addItem.innerHTML += item.name;
    // Insere o botão criado através da function deleteButton dentro de <li>
    addItem.appendChild(deleteButton(item.id));
    // Anexa o elemento addItem (<li><strong>quantity</strong>name</li>) como elemento filho de list (<ul>)
    list.appendChild(addItem);


    // os elementos criados via JavaScript são objetos manipulados como objetos através do appendChild. 
}

   
function updateElement(item) {
    // busca o <strong> do item que precisa ser atualizado, através de seu data-id e seu valor (item.id), atualizando o conteúdo do item adicionado, ou seja, a quantity do item.
    document.querySelector("[data-id= '"+ item.id +"']").innerHTML = item.quantity;
}

function deleteButton(id) {
    // cria um botão com o texto de X.
    const elementButton = document.createElement("button");
    elementButton.innerText = "X";

    // como a arrow function não carrega o this do JavaScript para frente, devemos declarar uma function de verdade para poder usá-lo. Ao clicar no botão de deletar, a function elementDelete será chamada, informando qual botão de qual item foi pressionado, e irá selecionar seu elemento pai (<li>) através da propriedade .parentNode.
    elementButton.addEventListener('click', function() {
        elementDelete(this.parentNode, id);
    })

    // toda vez que elementButton é chamado (toda vez que a página é carregada), ele retorna o botão na tela.
    return elementButton;
}

    // function que servirá para deletar o elemento que teve o botão de deletar pressionado (parâmetro).
    function elementDelete(tag, id) {
    tag.remove();

    // será buscado dentro do array items o item que possui o id igual ao id do elemento que teve o deleteButton pressionado.
    items.splice(items.findIndex(elemento => elemento.id === id), 1)
    
    // escrever que o item foi removido da localStorage. 
    localStorage.setItem("items", JSON.stringify(items))
}
