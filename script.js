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
                // Verifica se o botão de toggle está visível (indicando que estamos em visualização mobile)
                // getComputedStyle é usado para obter o estilo real do elemento, mesmo que definido em CSS externo
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
    // Esta funcionalidade básica destaca o link da página atual.
    const linksNav = document.querySelectorAll('#menu-principal a');
    const urlAtual = window.location.href;
    const paginaAtual = window.location.pathname; // Ex: "/", "/servicos.html"

    linksNav.forEach(link => {
        // Remove a classe 'active' de todos os links primeiro para garantir que apenas o correto seja destacado
        link.classList.remove('active');

        const linkHref = link.getAttribute('href');

        // Lógica para destacar o link correto
        if (linkHref === paginaAtual || linkHref === paginaAtual.substring(1) || (paginaAtual === '/' && (linkHref === 'index.html' || linkHref === './'))) {
            link.classList.add('active');
        } else if (urlAtual.includes(linkHref) && linkHref !== '#' && !linkHref.endsWith('index.html') && paginaAtual !== '/') {
            // Caso mais genérico para outras páginas, evitando index.html se não for a raiz
             link.classList.add('active');
        }
    });
    // Tratamento especial para o link "Início" na raiz do site
    if (paginaAtual === '/' || paginaAtual.endsWith('index.html') || paginaAtual === '') {
        const linkInicio = document.querySelector('#menu-principal a[href="index.html"]');
        if(linkInicio) linkInicio.classList.add('active');
        // Se houver um link para "/" ou "./"
        const linkRaiz = document.querySelector('#menu-principal a[href="/"], #menu-principal a[href="./"]');
        if(linkRaiz) linkRaiz.classList.add('active');
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

}); // Fim do document.addEventListener('DOMContentLoaded')
