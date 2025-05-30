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
        link.classList.remove('active'); 
        const linkHrefBase = link.getAttribute('href').split('/').pop();

        if (linkHrefBase === paginaAtual) {
            link.classList.add('active');
        }
        if ((paginaAtual === '' || paginaAtual === 'index.html') && (linkHrefBase === 'index.html' || linkHrefBase === '' || linkHrefBase === './')) {
            link.classList.add('active');
        }
    });
    // Certifica que "Início" (index.html) é o único ativo na raiz, caso outros links também correspondam a "/"
    if (paginaAtual === '' || paginaAtual === 'index.html') {
        let inicioAtivado = false;
        linksNav.forEach(link => {
            const linkHrefBase = link.getAttribute('href').split('/').pop();
            if ((linkHrefBase === 'index.html' || linkHrefBase === '' || linkHrefBase === './')) {
                if (!inicioAtivado) {
                    link.classList.add('active');
                    inicioAtivado = true;
                } else {
                    link.classList.remove('active');
                }
            } else if (inicioAtivado) { // Se o link de início já foi ativado, remove 'active' dos outros
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

        // Garante que o botão "Todos" esteja ativo e todos os itens visíveis ao carregar a página de serviços
        const botaoTodosInicial = secaoFiltros.querySelector('.filtro-btn[data-categoria="todos"]');
        if (botaoTodosInicial && !botaoTodosInicial.classList.contains('active')) {
             botoesFiltro.forEach(btn => btn.classList.remove('active'));
             botaoTodosInicial.classList.add('active');
        }
        itensServico.forEach(item => {
            item.style.display = 'flex'; 
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

    // --- VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---
    const formContato = document.getElementById('form-contato');
    const formStatusDiv = document.getElementById('form-status');

    if (formContato && formStatusDiv) {

        formContato.addEventListener('submit', function(event) {
            event.preventDefault(); 

            formStatusDiv.innerHTML = '';
            formStatusDiv.className = 'form-status-mensagem'; 

            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const mensagemInput = document.getElementById('mensagem');

            let erros = []; 

            if (nomeInput.value.trim() === '') {
                erros.push('O campo Nome Completo é obrigatório.');
            }
            if (emailInput.value.trim() === '') {
                erros.push('O campo Email é obrigatório.');
            } else if (!isValidEmail(emailInput.value.trim())) {
                erros.push('Por favor, insira um endereço de email válido.');
            }
            if (mensagemInput.value.trim() === '') {
                erros.push('O campo Mensagem é obrigatório.');
            }

            if (erros.length > 0) {
                let ulErros = '<ul>';
                erros.forEach(function(erro) {
                    ulErros += '<li>' + erro + '</li>';
                });
                ulErros += '</ul>';
                
                formStatusDiv.innerHTML = ulErros;
                formStatusDiv.classList.add('error'); 
                formStatusDiv.style.display = 'block'; 
            } else {
                formStatusDiv.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                formStatusDiv.classList.add('success'); 
                formStatusDiv.style.display = 'block'; 

                formContato.reset();

                setTimeout(function() {
                    formStatusDiv.innerHTML = '';
                    formStatusDiv.className = 'form-status-mensagem';
                    formStatusDiv.style.display = 'none';
                }, 5000); 
            }
        });

        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
    }
    // --- FIM DA VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---

}); // Fim do document.addEventListener('DOMContentLoaded')
