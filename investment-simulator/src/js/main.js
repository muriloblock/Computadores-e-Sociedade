// Simulador de Investimentos - Arquivo principal JavaScript
// Inicializa a aplicação e gerencia funcionalidades gerais

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Simulador de Investimentos Inicializado');
    
    // Configurar ouvintes de eventos
    setupEventListeners();
    
    // Inicializar gráfico vazio
    initializeChart();
    
    // Buscar taxas reais da API do Banco Central
    await atualizarTaxasReais();
    
    // Adicionar botão de atualizar taxas
    adicionarBotaoAtualizarTaxas();
});

function adicionarBotaoAtualizarTaxas() {
    const simulatorForm = document.querySelector('.simulator-form');
    if (!simulatorForm) return;
    
    const divInfo = document.createElement('div');
    divInfo.className = 'info-taxas';
    divInfo.style.cssText = `
        margin-top: 15px;
        padding: 12px;
        background: #e3f2fd;
        border-radius: 5px;
        border-left: 4px solid #2196F3;
        font-size: 0.9em;
    `;
    
    divInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>📊 Taxas Reais do Banco Central</strong>
                <div id="data-atualizacao" style="font-size: 0.85em; color: #666; margin-top: 5px;">
                    Carregando...
                </div>
            </div>
            <button id="btn-atualizar-taxas" style="
                padding: 8px 15px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
            ">🔄 Atualizar</button>
        </div>
    `;
    
    simulatorForm.appendChild(divInfo);
    
    // Adicionar evento ao botão
    document.getElementById('btn-atualizar-taxas').addEventListener('click', async (e) => {
        e.preventDefault();
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = '⏳ Atualizando...';
        
        await atualizarTaxasReais();
        
        btn.disabled = false;
        btn.textContent = '🔄 Atualizar';
    });
    
    // Atualizar data
    atualizarInfoData();
}

function atualizarInfoData() {
    const dataElement = document.getElementById('data-atualizacao');
    if (dataElement && infoTaxas.dataAtualizacao) {
        let html = `Última atualização: ${infoTaxas.dataAtualizacao}`;
        
        if (infoTaxas.valoresAnuais) {
            html += `<br><small>CDI: ${infoTaxas.valoresAnuais.cdi.toFixed(2)}% a.a. | Selic: ${infoTaxas.valoresAnuais.selic.toFixed(2)}% a.a.</small>`;
        }
        
        dataElement.innerHTML = html;
    }
}

function setupEventListeners() {
    const simularButton = document.getElementById('simular');
    if (simularButton) {
        simularButton.addEventListener('click', handleSimulation);
    }
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function handleSimulation() {
    const tipoInvestimento = document.getElementById('tipo-investimento').value;
    const valorInicial = parseFloat(document.getElementById('valor-inicial').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporte-mensal').value) || 0;
    const periodo = parseInt(document.getElementById('periodo').value) || 1;
    
    if (valorInicial <= 0 && aporteMensal <= 0) {
        alert('Por favor, insira um valor inicial ou aporte mensal válido.');
        return;
    }
    
    if (periodo <= 0) {
        alert('Por favor, insira um período válido.');
        return;
    }
    
    // Executar simulação
    const resultados = simularInvestimento(tipoInvestimento, valorInicial, aporteMensal, periodo);
    exibirResultados(resultados);
    atualizarGrafico(resultados);
}

function exibirResultados(resultados) {
    const totalInvestido = resultados.valorInvestido;
    const valorFinal = resultados.valorFinal;
    const rendimento = valorFinal - totalInvestido;
    const rentabilidade = ((valorFinal / totalInvestido - 1) * 100);
    
    document.getElementById('total-investido').textContent = formatarMoeda(totalInvestido);
    document.getElementById('valor-final').textContent = formatarMoeda(valorFinal);
    document.getElementById('rendimento').textContent = formatarMoeda(rendimento);
    document.getElementById('rentabilidade').textContent = rentabilidade.toFixed(2) + '%';
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}