// script.js

document.addEventListener('DOMContentLoaded', function() {

    const menuToggle = document.getElementById('menu-toggle');
    const menuPrincipal = document.getElementById('menu-principal');
    const anoAtualSpan = document.getElementById('ano-atual');

    // --- Funcionalidade do Menu Hambúrguer ---
    if (menuToggle && menuPrincipal) {
        menuToggle.addEventListener('click', function() {
            menuPrincipal.classList.toggle('active');
            const isExpanded = menuPrincipal.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                menuToggle.innerHTML = '&times;'; // Muda para 'X' (símbolo de fechar)
                menuToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                menuToggle.innerHTML = '&#9776;'; // Volta para o ícone de hambúrguer
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });
    } else {
        console.warn("Elementos do menu hambúrguer não encontrados. Verifique os IDs 'menu-toggle' e 'menu-principal'.");
    }

    // --- Funcionalidade para Atualizar o Ano no Rodapé ---
    if (anoAtualSpan) {
        const data = new Date();
        anoAtualSpan.textContent = data.getFullYear();
    } else {
        console.warn("Elemento para exibir o ano atual não encontrado. Verifique o ID 'ano-atual'.");
    }

    // --- Opcional: Fechar o menu ao clicar em um link (para Single Page Apps ou navegação na mesma página) ---
    if (menuPrincipal) {
        const linksDoMenu = menuPrincipal.querySelectorAll('a');
        linksDoMenu.forEach(link => {
            link.addEventListener('click', function() {
                const menuEstaAtivo = menuPrincipal.classList.contains('active');
                const isMobileView = menuToggle && getComputedStyle(menuToggle).display !== 'none';

                if (menuEstaAtivo && isMobileView) {
                    menuPrincipal.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.innerHTML = '&#9776;'; // Volta para o ícone de hambúrguer
                    menuToggle.setAttribute('aria-label', 'Abrir menu');
                }
            });
        });
    }

    // --- Destaque do Link Ativo na Navegação ---
    const linksNav = document.querySelectorAll('#menu-principal a');
    const paginaAtual = window.location.pathname.split('/').pop(); // Pega o nome do arquivo atual (ex: "servicos.html", "index.html" ou "")

    linksNav.forEach(link => {
        link.classList.remove('active'); // Remove de todos primeiro
        const linkHrefBase = link.getAttribute('href').split('/').pop(); // Pega o nome do arquivo do link

        if (linkHrefBase === paginaAtual) {
            link.classList.add('active');
        }
        // Caso especial para a página inicial (index.html ou raiz)
        if ((paginaAtual === '' || paginaAtual === 'index.html') && (linkHrefBase === 'index.html' || linkHrefBase === '')) {
            link.classList.add('active');
        }
    });
    // Certifica que "Início" (index.html) é o único ativo na raiz.
    if (paginaAtual === '' || paginaAtual === 'index.html') {
        linksNav.forEach(link => {
            const linkHrefBase = link.getAttribute('href').split('/').pop();
            if (linkHrefBase !== 'index.html' && linkHrefBase !== '') {
                link.classList.remove('active');
            }
        });
    }


    // --- Resetar o menu ao redimensionar para desktop ---
    window.addEventListener('resize', function() {
        if (menuToggle && menuPrincipal) {
            const isDesktopView = getComputedStyle(menuToggle).display === 'none';

            if (isDesktopView) {
                if (menuPrincipal.classList.contains('active')) {
                    menuPrincipal.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.innerHTML = '&#9776;'; // Volta para o ícone de hambúrguer
                    menuToggle.setAttribute('aria-label', 'Abrir menu');
                }
            }
        }
    });

    // --- FUNCIONALIDADE DE FILTRO PARA A PÁGINA DE SERVIÇOS ---
    const secaoFiltros = document.getElementById('filtros-servicos');
    const listaDeServicos = document.querySelector('.lista-servicos');

    if (secaoFiltros && listaDeServicos) {
        const botoesFiltro = secaoFiltros.querySelectorAll('.filtro-btn');
        const itensServico = listaDeServicos.querySelectorAll('.servico-item');

        // Define o estado inicial dos filtros: Botão "Todos" ativo e todos os itens visíveis
        // Isso garante que, se o usuário sair e voltar para a página, os filtros estejam corretos.
        const botaoTodosInicial = secaoFiltros.querySelector('.filtro-btn[data-categoria="todos"]');
        if (botaoTodosInicial) {
            botoesFiltro.forEach(btn => btn.classList.remove('active')); // Limpa qualquer 'active' residual
            botaoTodosInicial.classList.add('active');
        }
        itensServico.forEach(item => {
            item.style.display = 'flex'; // Garante que todos estejam visíveis inicialmente
        });


        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', function() {
                botoesFiltro.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                const categoriaSelecionada = this.getAttribute('data-categoria');

                itensServico.forEach(item => {
                    const categoriaDoItem = item.getAttribute('data-categoria');
                    if (categoriaSelecionada === 'todos' || categoriaDoItem === categoriaSelecionada) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    // --- FIM DA FUNCIONALIDADE DE FILTRO ---

}); // Fim do document.addEventListener('DOMContentLoaded')
