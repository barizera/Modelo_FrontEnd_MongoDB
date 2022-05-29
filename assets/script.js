class Requisicoes {
  buscarTodosProdutos = async () => {
    const res = await fetch(`${baseUrl}/todos-produtos`);

    const produtos = await res.json();

    listaDeProdutos = produtos;
    console.log(listaDeProdutos);
    return produtos;
  };

  buscarProdutoPorId = async (id) => {
    const res = await fetch(`${baseUrl}/produto/${id}`);
    if (res.status === 404) {
      return false;
    }

    const produto = res.json();
    return produto;
  };

  criarProduto = async (nome, descricao, foto) => {
    const produto = {
      nome,
      descricao,
      foto,
    };

    const res = await fetch(`${baseUrl}/criar-produto`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(produto),
    });

    const novoProduto = await res.json();
    return novoProduto;
  };

  atualizarProduto = async (id, nome, descricao, foto) => {
    const produto = {
      id,
      nome,
      descricao,
      foto,
    };

    const res = await fetch(`${baseUrl}/atualizar-produto/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(produto),
    });
    const novoProduto = await res.json();
    return novoProduto;
  };

  excluirProduto = async (id) => {
    const res = await fetch(`${baseUrl}/deletar-produto/${id}`, {
      method: "DELETE",
      mode: "cors",
    });

    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  };
  //final das requisições
}
// VARIÁVEIS AUXILIARES
const requisicoes = new Requisicoes();
const baseUrl = "http://localhost:3001/produtos";
let listaDeProdutos = [];

// MANIPULAÇÃO DO DOCUMENTO - DOM (HTML)
const imprimirTodosProdutos = async () => {
  const produtos = await requisicoes.buscarTodosProdutos();

  document.querySelector("#produtosListaItem").innerHTML = "";

  produtos.forEach((produtos) => {
    document.querySelector("#produtosListaItem").insertAdjacentHTML(
      "beforeend",
      `<div class="CartaoProdutos">
            <div class="CartaoProduto__infos">
                <div>
                    <div>${produtos.nome}</div>
                    <div>${produtos.descricao}</div>
                </div>
                <div class="btn__container">
                    <button onclick="mostrarModalExclusao('${produtos._id}')" class="botao-excluir-produto">APAGAR</button>
                    <button onclick="mostrarModalEdicao('${produtos._id}')" class="botao-editar-produto">EDITAR</button>
                </div>
            </div>
                <div class="CartaoProduto_foto">    
                    <img src="${produtos.foto}" alt="Casa ${produtos.nome}" class="CartaoProduto__foto"/>
                    </div>
                </div>`
    );
  });
};
imprimirTodosProdutos();

const imprmirProdutoPorId = async () => {
  document.querySelector("#produto_escolhido").innerHTML = "";

  const nome = document.querySelector("#inputPesquisar").value;

  const produtoSelecionado = await listaDeProdutos.find(
    (elem) => elem.nome === nome
  );

  if (produtoSelecionado === undefined) {
    const errorMessage = document.createElement("p");
    errorMessage.id = "errorMessage";
    errorMessage.classList.add("ErrorMessage");
    errorMessage.innerHTML = "Produto não encontrado.";

    document.querySelector("#produto_escolhido").appendChild(errorMessage);
  }

  const id = produtoSelecionado._id;
  console.log(id);
  const produto = await requisicoes.buscarProdutoPorId(id);

  if (produto === false) {
    const errorMessage = document.createElement("p");
    errorMessage.id = "errorMessage";
    errorMessage.classList.add("ErrorMessage");
    errorMessage.innerHTML = "Produto não encontrado.";

    document.querySelector("#produto_escolhido").appendChild(errorMessage);
  } else {
    document.querySelector(
      "#produto_escolhido"
    ).innerHTML = `<div class="CartaoProdutos">
        <div class="CartaoProduto__infos">
            <div>
                <h4>${produto.nome}</h4>
                <p>${produto.descricao}</p>
            </div>
            <div class="btn__container">
                <button onclick="mostrarModalExclusao('${produto._id}')" class="botao-excluir-produto">APAGAR</button>
                <button onclick="mostrarModalEdicao('${produto._id}')" class="botao-editar-produto">EDITAR</button>
            </div>
        </div>
        <div class="CartaoProduto_foto">    
            <img src="${produto.foto}" alt="Casa ${produto.nome}" class="CartaoProduto__foto"/>
        </div>
    </div>`;
  }
};

const cadastrarNovoProduto = async () => {
  const nome = document.querySelector("#inputNome").value;
  const descricao = document.querySelector("#inputDescricao").value;
  const foto = document.querySelector("#inputFoto").value;

  const produto = await requisicoes.criarProduto(nome, descricao, foto);

  document.querySelector(".ProdutosListaItem").insertAdjacentHTML(
    "beforeend",
    `<div class="CartaoProdutos">
            <div class="CartaoProduto__infos">
                <div>
                    <div>${produto.nome}</div>
                    <div>${produto.descricao}</div>
                </div>
                <div class="btn__container">
                    <button onclick="mostrarModalExclusao('${produto._id}')" class="botao-excluir-produto">APAGAR</button>
                    <button onclick="mostrarModalEdicao('${produto._id}')" class="botao-editar-produto">EDITAR</button>
                </div>
            </div>
                <div class="CartaoProduto_foto">    
                    <img src="${produto.foto}" alt="Casa ${produto.nome}" class="CartaoProduto__foto"/>
                    </div>
                </div>`
  );

  // criar o --> fecharModalCriacao()
};

const mostrarModalCriacao = () => {
  document.querySelector("#fundoModalCriacao").style.display = "flex";
};

const mostrarModalExclusao = (id) => {
  document.querySelector("#fundoModalExclusao").style.display = "flex";

  const botaoConfirmar = document.querySelector("#botaoConfirmarExclusao");

  botaoConfirmar.addEventListener("click", async () => {
    const exclusao = await requisicoes.excluirProduto(id);

    if (exclusao) {
      mostrarNotificacao("sucesso", "Produto excluido com sucesso.");
    } else {
      mostrarNotificacao("erro", "Produto não encontrado");
    }

    esconderModalExclusao();
    imprimirTodosProdutos();
  });
};

const mostrarModalEdicao = (id) => {
  document.querySelector("#fundoModalEdicao").style.display = "flex";

  const produto = listaDeProdutos.find((elem) => elem._id === id);
  console.log(produto);
  document.querySelector("#inputNomeEdicao").value = produto.nome;
  document.querySelector("#inputDescricaoEdicao").value = produto.descricao;
  document.querySelector("#inputFotoEdicao").value = produto.foto;

  const btnAtualizar = document.querySelector("#botaoConfirmarEdicao");

  btnAtualizar.addEventListener("click", async () => {
    const nome = document.querySelector("#inputNomeEdicao").value;
    const descricao = document.querySelector("#inputDescricaoEdicao").value;
    const foto = document.querySelector("#inputFotoEdicao").value;
    console.log(nome, descricao, foto);
    await requisicoes.atualizarProduto(id, nome, descricao, foto);

    esconderModalEdicao();
    imprimirTodosProdutos();
  });
};

const mostrarNotificacao = (tipo, frase) => {
  const notificacaoP = document.querySelector("#notificacaoSpan");
  const notificacaoSpan = document.querySelector("#notificacaoP");

  if (tipo === "sucesso") {
    notificacaoSpan.innerText = "V";
    notificacaoSpan.classList.add("notificacao_span_sucesso");
  } else if (tipo === "erro") {
    notificacaoSpan.innerText = "X";
    notificacaoSpan.classList.add("notificacao_span_erro");
  }
  notificacaoP.innerText = frase;

  document.querySelector("#notificacao").style.display = "flex";

  setTimeout(() => {
    esconderNotificacao();
  }, 4000);
};

const esconderModalCriacao = () => {
  document.querySelector("#inputNome").value = "";
  document.querySelector("#inputDescricao").value = "";
  document.querySelector("#inputFoto").value = "";

  document.querySelector("#fundoModalCriacao").style.display = "none";
};

const esconderModalEdicao = () => {
  document.querySelector("#fundoModalEdicao").style.display = "none";
};

const esconderModalExclusao = () => {
  document.querySelector("#fundoModalExclusao").style.display = "none";
};

const esconderNotificacao = () => {
  document.querySelector("#notificacao").style.display = "none";
};
