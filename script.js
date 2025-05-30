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
        // Não loga erro se os elementos não estiverem presentes em todas as páginas
        // console.warn("Elementos do menu hambúrguer não encontrados nesta página.");
    }

    // --- Funcionalidade para Atualizar o Ano no Rodapé ---
    if (anoAtualSpan) {
        const data = new Date();
        anoAtualSpan.textContent = data.getFullYear();
    } else {
        // console.warn("Elemento para exibir o ano atual não encontrado nesta página.");
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
                    if(menuToggle) { // Verifica se menuToggle existe antes de modificar
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.innerHTML = '&#9776;'; 
                        menuToggle.setAttribute('aria-label', 'Abrir menu');
                    }
                }
            });
        });
    }

    // --- Destaque do Link Ativo na Navegação ---
    const linksNav = document.querySelectorAll('#menu-principal a');
    if (linksNav.length > 0) {
        const paginaAtual = window.location.pathname.split('/').pop(); 

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
                } else if (inicioAtivado) { 
                     link.classList.remove('active');
                }
            });
        }
    }


    // --- Resetar o menu ao redimensionar para desktop ---
    window.addEventListener('resize', function() {
        if (menuToggle && menuPrincipal) {
            const isDesktopView = getComputedStyle(menuToggle).display === 'none';
            if (isDesktopView) {
                if (menuPrincipal.classList.contains('active')) {
                    menuPrincipal.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.innerHTML = '&#9776;'; 
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

        const botaoTodosInicialFiltro = secaoFiltros.querySelector('.filtro-btn[data-categoria="todos"]');
        if (botaoTodosInicialFiltro && !botaoTodosInicialFiltro.classList.contains('active')) {
             botoesFiltro.forEach(btn => btn.classList.remove('active'));
             botaoTodosInicialFiltro.classList.add('active');
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
            if (nomeInput.value.trim() === '') { erros.push('O campo Nome Completo é obrigatório.'); }
            if (emailInput.value.trim() === '') { erros.push('O campo Email é obrigatório.'); } 
            else if (!isValidEmail(emailInput.value.trim())) { erros.push('Por favor, insira um endereço de email válido.');}
            if (mensagemInput.value.trim() === '') { erros.push('O campo Mensagem é obrigatório.'); }

            if (erros.length > 0) {
                let ulErros = '<ul>';
                erros.forEach(function(erro) { ulErros += '<li>' + erro + '</li>'; });
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
    }
    // --- FIM DA VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---

    // --- LÓGICA DO FORMULÁRIO DE AGENDAMENTO MULTI-PASSOS ---
    const formAgendamento = document.getElementById('form-agendamento');

    if (formAgendamento) {
        const passosFieldsets = formAgendamento.querySelectorAll('fieldset.agendamento-passo');
        const btnAnterior = document.getElementById('btn-anterior');
        const btnProximo = document.getElementById('btn-proximo');
        const btnConfirmarAgendamento = document.getElementById('btn-confirmar-agendamento');
        const indicadoresProgresso = document.querySelectorAll('.progresso-agendamento .passo-indicador');
        const divStatusAgendamento = document.getElementById('agendamento-status');

        let passoAtual = 1;
        const totalPassos = passosFieldsets.length;
        
        let dadosAgendamento = {
            servicosSelecionados: [], 
            barbeiro: { id: 'qualquer', nome: 'Qualquer Barbeiro Disponível' }, 
            data: null, horario: null,
            cliente: { nome: '', email: '', telefone: '', observacoes: '' },
            duracaoTotal: 0, precoTotal: 0.00
        };

        const horariosFuncionamento = { 
            0: null, 
            1: { inicio: '09:00', fim: '20:00', almocoInicio: '12:00', almocoFim: '13:00' }, 
            2: { inicio: '09:00', fim: '20:00', almocoInicio: '12:00', almocoFim: '13:00' }, 
            3: { inicio: '09:00', fim: '20:00', almocoInicio: '12:00', almocoFim: '13:00' }, 
            4: { inicio: '09:00', fim: '20:00', almocoInicio: '12:00', almocoFim: '13:00' }, 
            5: { inicio: '09:00', fim: '20:00', almocoInicio: '12:00', almocoFim: '13:00' }, 
            6: { inicio: '09:00', fim: '18:00', almocoInicio: '12:00', almocoFim: '13:00' }  
        };
        const agendamentosSimulados = { 
            'joao-silva': { '2025-06-02': [ { inicio: '10:00', fim: '11:00' }, { inicio: '14:00', fim: '15:30' } ], '2025-06-03': [ { inicio: '11:00', fim: '12:00' } ] },
            'ana-costa': { '2025-06-02': [ { inicio: '09:00', fim: '10:30' }, { inicio: '16:00', fim: '17:00' } ] }
        };
        const INTERVALO_SLOT_MINUTOS = 30;

        function timeStringToMinutes(timeStr) { if (!timeStr) return 0; const [hours, minutes] = timeStr.split(':').map(Number); return hours * 60 + minutes; }
        function minutesToTimeString(totalMinutes) { const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0'); const minutes = (totalMinutes % 60).toString().padStart(2, '0'); return `${hours}:${minutes}`; }
        function formatarDuracao(totalMinutos) { if (totalMinutos === 0) return '0 min'; const horas = Math.floor(totalMinutos / 60); const minutos = totalMinutos % 60; let formatado = ''; if (horas > 0) { formatado += `${horas}h`; if (minutos > 0) formatado += ` ${minutos}min`; } else { formatado += `${minutos}min`; } return formatado; }
        
        const secaoPasso1Agendamento = document.getElementById('passo1-servico');
        if (secaoPasso1Agendamento) {
            const checkboxesServicos = secaoPasso1Agendamento.querySelectorAll('input[name="servicos_selecionados"]');
            const spanDuracaoTotal = document.getElementById('duracao-total-estimada');
            const spanPrecoTotal = document.getElementById('preco-total-estimado');
            function atualizarResumoServicos() { let duracaoCalculada = 0; let precoCalculado = 0.00; dadosAgendamento.servicosSelecionados = []; checkboxesServicos.forEach(checkbox => { if (checkbox.checked) { const duracao = parseInt(checkbox.getAttribute('data-duracao'), 10); const preco = parseFloat(checkbox.getAttribute('data-preco')); const labelElement = checkbox.nextElementSibling; const nomeServico = labelElement ? labelElement.textContent.split('(')[0].trim() : checkbox.value; if (!isNaN(duracao) && !isNaN(preco)) { duracaoCalculada += duracao; precoCalculado += preco; dadosAgendamento.servicosSelecionados.push({ id: checkbox.value, nome: nomeServico, duracao: duracao, preco: preco }); } } }); dadosAgendamento.duracaoTotal = duracaoCalculada; dadosAgendamento.precoTotal = precoCalculado; if (spanDuracaoTotal) { spanDuracaoTotal.textContent = formatarDuracao(duracaoCalculada); } if (spanPrecoTotal) { spanPrecoTotal.textContent = precoCalculado.toFixed(2).replace('.', ','); } }
            if (checkboxesServicos.length > 0 && spanDuracaoTotal && spanPrecoTotal) { checkboxesServicos.forEach(checkbox => { checkbox.addEventListener('change', atualizarResumoServicos); }); atualizarResumoServicos(); }
        }

        const selectBarbeiroAgendamento = document.getElementById('selecao-barbeiro');
        if (selectBarbeiroAgendamento) {
            selectBarbeiroAgendamento.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                dadosAgendamento.barbeiro = { id: this.value, nome: selectedOption.text };
                if (passoAtual === 4) { carregarHorariosDisponiveis(); } else { limparSlotsDeHorario(); }
            });
        }
        
        const inputDataAgendamento = document.getElementById('selecao-data');
        if (inputDataAgendamento) {
            const hoje = new Date(); const hojeString = hoje.toISOString().split('T')[0]; inputDataAgendamento.setAttribute('min', hojeString);
            inputDataAgendamento.addEventListener('change', function() {
                const dataSelecionadaString = this.value; const [ano, mes, dia] = dataSelecionadaString.split('-').map(Number); const dataSelecionada = new Date(ano, mes - 1, dia);
                hoje.setHours(0,0,0,0);
                if (dataSelecionada < hoje) { divStatusAgendamento.className = 'form-status-mensagem error'; divStatusAgendamento.textContent = 'Não é possível selecionar uma data passada.'; divStatusAgendamento.style.display = 'block'; this.value = ''; dadosAgendamento.data = null; setTimeout(() => { divStatusAgendamento.style.display = 'none'; }, 3000); limparSlotsDeHorario();}
                else if (dataSelecionada.getDay() === 0) { divStatusAgendamento.className = 'form-status-mensagem error'; divStatusAgendamento.textContent = 'Desculpe, não funcionamos aos Domingos.'; divStatusAgendamento.style.display = 'block'; this.value = ''; dadosAgendamento.data = null; setTimeout(() => { divStatusAgendamento.style.display = 'none'; }, 3000); limparSlotsDeHorario();}
                else { dadosAgendamento.data = dataSelecionadaString; divStatusAgendamento.style.display = 'none'; if (passoAtual === 4) { carregarHorariosDisponiveis(); } else { limparSlotsDeHorario(); } }
            });
        }

        function limparSlotsDeHorario() { const containerSlots = document.getElementById('slots-horario-disponiveis'); if (containerSlots) { containerSlots.innerHTML = '<p class="placeholder-horarios">Por favor, selecione um serviço, barbeiro (opcional) e uma data para ver os horários disponíveis.</p>';} dadosAgendamento.horario = null; const slotsAtivos = document.querySelectorAll('.time-slot.selected'); slotsAtivos.forEach(s => s.classList.remove('selected')); }
        
        function carregarHorariosDisponiveis() {
            const containerSlots = document.getElementById('slots-horario-disponiveis'); if (!containerSlots) return; limparSlotsDeHorario();
            if (!dadosAgendamento.data || dadosAgendamento.servicosSelecionados.length === 0) { containerSlots.innerHTML = '<p class="placeholder-horarios">Selecione um serviço e uma data primeiro.</p>'; return; }
            const dataSelecionada = new Date(dadosAgendamento.data + 'T00:00:00'); const diaDaSemana = dataSelecionada.getDay(); const horarioDia = horariosFuncionamento[diaDaSemana];
            if (!horarioDia) { containerSlots.innerHTML = '<p class="placeholder-horarios">A barbearia está fechada nesta data.</p>'; return; }
            const duracaoServicoTotal = dadosAgendamento.duracaoTotal; if (duracaoServicoTotal <= 0) { containerSlots.innerHTML = '<p class="placeholder-horarios">Selecione um serviço com duração válida.</p>'; return; }
            containerSlots.innerHTML = ''; const inicioExpedienteMin = timeStringToMinutes(horarioDia.inicio); const fimExpedienteMin = timeStringToMinutes(horarioDia.fim); const inicioAlmocoMin = timeStringToMinutes(horarioDia.almocoInicio); const fimAlmocoMin = timeStringToMinutes(horarioDia.almocoFim);
            let agendamentosDoDiaParaBarbeiro = []; if (dadosAgendamento.barbeiro.id !== 'qualquer' && agendamentosSimulados[dadosAgendamento.barbeiro.id] && agendamentosSimulados[dadosAgendamento.barbeiro.id][dadosAgendamento.data]) { agendamentosDoDiaParaBarbeiro = agendamentosSimulados[dadosAgendamento.barbeiro.id][dadosAgendamento.data];}
            let encontrouHorario = false;
            for (let slotInicioMin = inicioExpedienteMin; slotInicioMin < fimExpedienteMin; slotInicioMin += INTERVALO_SLOT_MINUTOS) {
                const slotFimMin = slotInicioMin + duracaoServicoTotal; if (slotFimMin > fimExpedienteMin) continue;
                const colideComAlmoco = (slotInicioMin < fimAlmocoMin && slotFimMin > inicioAlmocoMin); if (colideComAlmoco) continue;
                let colideComAgendamentoExistente = false; if (dadosAgendamento.barbeiro.id !== 'qualquer') { for (const agendado of agendamentosDoDiaParaBarbeiro) { const inicioAgendadoMin = timeStringToMinutes(agendado.inicio); const fimAgendadoMin = timeStringToMinutes(agendado.fim); if (slotInicioMin < fimAgendadoMin && slotFimMin > inicioAgendadoMin) { colideComAgendamentoExistente = true; break; } } } if (colideComAgendamentoExistente) continue;
                const slotButton = document.createElement('button'); slotButton.type = 'button'; slotButton.classList.add('time-slot'); slotButton.textContent = minutesToTimeString(slotInicioMin); slotButton.dataset.horario = minutesToTimeString(slotInicioMin);
                slotButton.addEventListener('click', function() { const slotsAtivos = containerSlots.querySelectorAll('.time-slot.selected'); slotsAtivos.forEach(s => s.classList.remove('selected')); this.classList.add('selected'); dadosAgendamento.horario = this.dataset.horario; });
                containerSlots.appendChild(slotButton); encontrouHorario = true;
            }
            if (!encontrouHorario) { containerSlots.innerHTML = '<p class="placeholder-horarios">Nenhum horário disponível para esta data/serviço/barbeiro. Tente outras opções.</p>'; }
        }

        function validarEGuardarDadosCliente() {
            const nomeClienteInput = document.getElementById('nome-agendamento'); const emailClienteInput = document.getElementById('email-agendamento'); const telefoneClienteInput = document.getElementById('telefone-agendamento'); const observacoesClienteInput = document.getElementById('observacoes-agendamento');
            const nomeCliente = nomeClienteInput.value.trim(); const emailCliente = emailClienteInput.value.trim(); const telefoneCliente = telefoneClienteInput.value.trim(); const observacoesCliente = observacoesClienteInput.value.trim();
            let errosPasso5 = [];
            if (nomeCliente === '') { errosPasso5.push('O campo Nome Completo é obrigatório.'); }
            if (emailCliente === '') { errosPasso5.push('O campo Email é obrigatório.'); } else if (!isValidEmail(emailCliente)) { errosPasso5.push('Por favor, insira um endereço de email válido.'); }
            if (telefoneCliente === '') { errosPasso5.push('O campo Telefone é obrigatório.'); }
            if (errosPasso5.length > 0) { divStatusAgendamento.className = 'form-status-mensagem error'; let ulErros = '<ul>'; errosPasso5.forEach(function(erro) { ulErros += '<li>' + erro + '</li>'; }); ulErros += '</ul>'; divStatusAgendamento.innerHTML = ulErros; divStatusAgendamento.style.display = 'block'; setTimeout(() => { divStatusAgendamento.style.display = 'none'; }, 4000); return false; 
            } else { dadosAgendamento.cliente.nome = nomeCliente; dadosAgendamento.cliente.email = emailCliente; dadosAgendamento.cliente.telefone = telefoneCliente; dadosAgendamento.cliente.observacoes = observacoesCliente; divStatusAgendamento.style.display = 'none'; return true; }
        }
        
        function formatarDataParaExibicao(dataStringYYYYMMDD) { if (!dataStringYYYYMMDD) return 'Não selecionada'; const [ano, mes, dia] = dataStringYYYYMMDD.split('-'); return `${dia}/${mes}/${ano}`; }
        function popularResumoAgendamento() {
            document.getElementById('conf-servicos').textContent = dadosAgendamento.servicosSelecionados.map(s => s.nome).join(', ') || 'Nenhum';
            document.getElementById('conf-duracao').textContent = formatarDuracao(dadosAgendamento.duracaoTotal);
            document.getElementById('conf-preco').textContent = dadosAgendamento.precoTotal.toFixed(2).replace('.', ',');
            document.getElementById('conf-barbeiro').textContent = dadosAgendamento.barbeiro ? dadosAgendamento.barbeiro.nome : 'Não selecionado';
            document.getElementById('conf-data').textContent = formatarDataParaExibicao(dadosAgendamento.data);
            document.getElementById('conf-horario').textContent = dadosAgendamento.horario || 'Não selecionado';
            document.getElementById('conf-nome').textContent = dadosAgendamento.cliente.nome || 'Não informado';
            document.getElementById('conf-email').textContent = dadosAgendamento.cliente.email || 'Não informado';
            document.getElementById('conf-telefone').textContent = dadosAgendamento.cliente.telefone || 'Não informado';
            document.getElementById('conf-observacoes').textContent = dadosAgendamento.cliente.observacoes || 'Nenhuma';
        }

        function mostrarPasso(numeroDoPasso) {
            passosFieldsets.forEach((fieldset, indice) => { fieldset.style.display = (indice + 1 === numeroDoPasso) ? 'block' : 'none'; });
            indicadoresProgresso.forEach((indicador, indice) => { indicador.classList.remove('ativo', 'completo'); if (indice + 1 < numeroDoPasso) { indicador.classList.add('completo'); } else if (indice + 1 === numeroDoPasso) { indicador.classList.add('ativo'); } });
            if(btnAnterior) btnAnterior.style.display = (numeroDoPasso === 1) ? 'none' : 'inline-block';
            if(btnProximo) btnProximo.style.display = (numeroDoPasso === totalPassos) ? 'none' : 'inline-block';
            if(btnConfirmarAgendamento) btnConfirmarAgendamento.style.display = (numeroDoPasso === totalPassos) ? 'inline-block' : 'none';
        }

        if(btnProximo) {
            btnProximo.addEventListener('click', function() {
                let validoParaAvancar = true;
                if(divStatusAgendamento) divStatusAgendamento.style.display = 'none';

                if (passoAtual === 1) { if (dadosAgendamento.servicosSelecionados.length === 0) { if(divStatusAgendamento) {divStatusAgendamento.className = 'form-status-mensagem error'; divStatusAgendamento.textContent = 'Por favor, selecione pelo menos um serviço.';} validoParaAvancar = false; } }
                else if (passoAtual === 3) { if (!dadosAgendamento.data) { if(divStatusAgendamento) {divStatusAgendamento.className = 'form-status-mensagem error'; divStatusAgendamento.textContent = 'Por favor, selecione uma data válida.';} validoParaAvancar = false; } }
                else if (passoAtual === 4) { if (!dadosAgendamento.horario) { if(divStatusAgendamento) {divStatusAgendamento.className = 'form-status-mensagem error'; divStatusAgendamento.textContent = 'Por favor, selecione um horário.';} validoParaAvancar = false; } }
                else if (passoAtual === 5) { validoParaAvancar = validarEGuardarDadosCliente(); }

                if (!validoParaAvancar) { if(divStatusAgendamento) {divStatusAgendamento.style.display = 'block'; if (passoAtual !== 5) { setTimeout(() => { divStatusAgendamento.style.display = 'none'; }, 3000);}} return; }
                if (passoAtual < totalPassos) { passoAtual++; mostrarPasso(passoAtual); if(passoAtual === 4) { carregarHorariosDisponiveis(); } else if (passoAtual === 6) { popularResumoAgendamento(); } }
            });
        }

        if(btnAnterior) {
            btnAnterior.addEventListener('click', function() {
                if(divStatusAgendamento) divStatusAgendamento.style.display = 'none';
                if (passoAtual > 1) { passoAtual--; mostrarPasso(passoAtual); }
            });
        }
        
        formAgendamento.addEventListener('submit', function(event) {
            event.preventDefault(); 
            if (!validarEGuardarDadosCliente()) { passoAtual = 5; mostrarPasso(passoAtual); const nomeAgendamentoEl = document.getElementById('nome-agendamento'); if(nomeAgendamentoEl) nomeAgendamentoEl.focus(); return; }
            console.log('Dados Finais do Agendamento para Envio (Simulação):', dadosAgendamento);
            try { let agendamentosSalvos = JSON.parse(localStorage.getItem('meusAgendamentos')) || []; agendamentosSalvos.push(dadosAgendamento); localStorage.setItem('meusAgendamentos', JSON.stringify(agendamentosSalvos)); console.log('Agendamento salvo no localStorage.'); } catch (e) { console.error('Erro ao salvar no localStorage:', e); }
            if(divStatusAgendamento) { divStatusAgendamento.className = 'form-status-mensagem success'; divStatusAgendamento.textContent = 'Seu agendamento foi realizado com sucesso! (Simulação)'; divStatusAgendamento.style.display = 'block';}
            passosFieldsets.forEach(fieldset => { fieldset.style.display = 'none'; });
            const agendamentoNavEl = document.querySelector('.agendamento-navegacao');
            if(agendamentoNavEl) agendamentoNavEl.style.display = 'none';
            const progressoAgendamentoEl = document.querySelector('.progresso-agendamento');
            if(progressoAgendamentoEl) progressoAgendamentoEl.style.display = 'none';
            const formLegend = formAgendamento.querySelector('legend'); //Pode não existir se o fieldset atual não for o primeiro
            if(formLegend && formLegend.parentElement.style.display !== 'none') formLegend.parentElement.style.display = 'none';


            setTimeout(() => {
                formAgendamento.reset(); 
                dadosAgendamento = { servicosSelecionados: [], barbeiro: { id: 'qualquer', nome: 'Qualquer Barbeiro Disponível' }, data: null, horario: null, cliente: { nome: '', email: '', telefone: '', observacoes: '' }, duracaoTotal: 0, precoTotal: 0.00 };
                const secaoPasso1AgendamentoReset = document.getElementById('passo1-servico'); if(secaoPasso1AgendamentoReset) atualizarResumoServicos(); // Precisa garantir que a função tem acesso aos elementos corretos
                limparSlotsDeHorario();    
                const selectBarbeiroReset = document.getElementById('selecao-barbeiro'); if(selectBarbeiroReset) selectBarbeiroReset.value = 'qualquer'; 
                const inputDataReset = document.getElementById('selecao-data'); if(inputDataReset) inputDataReset.value = ''; 
                passoAtual = 1; mostrarPasso(passoAtual);
                if(divStatusAgendamento) divStatusAgendamento.style.display = 'none';
                if(agendamentoNavEl) agendamentoNavEl.style.display = 'flex'; 
                if(progressoAgendamentoEl) progressoAgendamentoEl.style.display = 'flex'; 
            }, 7000); 
        });

        // Função isValidEmail (necessária para validação de contato e agendamento)
        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        // Inicializa mostrando o primeiro passo
        mostrarPasso(passoAtual);

    } // Fim do if (formAgendamento)
    // --- FIM DA LÓGICA DO FORMULÁRIO DE AGENDAMENTO ---

}); // Fim do document.addEventListener('DOMContentLoaded')
