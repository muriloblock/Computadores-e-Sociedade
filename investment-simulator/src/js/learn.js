document.addEventListener('DOMContentLoaded', () => {
    setupCalculators();
});

function setupCalculators() {
    window.calcularJuros = function calcularJuros() {
        const principal = parseFloat(document.getElementById('calc-principal')?.value || '');
        const rate = parseFloat(document.getElementById('calc-rate')?.value || '') / 100;
        const time = parseInt(document.getElementById('calc-time')?.value || '', 10);

        if (isFinite(principal) && principal > 0 && isFinite(rate) && rate > 0 && Number.isInteger(time) && time > 0) {
            const futureValue = principal * Math.pow(1 + rate, time);
            const earnings = futureValue - principal;

            const resultContainer = document.getElementById('juros-result');
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <p><strong>Valor Final:</strong> ${formatarMoeda(futureValue)}</p>
                    <p><strong>Rendimento:</strong> ${formatarMoeda(earnings)}</p>
                `;
            }
        }
    };

    window.calcularMeta = function calcularMeta() {
        const meta = parseFloat(document.getElementById('meta-valor')?.value || '');
        const anos = parseInt(document.getElementById('meta-anos')?.value || '', 10);
        const taxa = parseFloat(document.getElementById('meta-taxa')?.value || '') / 100;

        if (isFinite(meta) && meta > 0 && Number.isInteger(anos) && anos > 0 && isFinite(taxa) && taxa > 0) {
            const aporteMensal = (meta * taxa) / (12 * (Math.pow(1 + taxa, anos) - 1));

            const resultContainer = document.getElementById('meta-result');
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <p><strong>Aporte Mensal Necessário:</strong> ${formatarMoeda(aporteMensal)}</p>
                `;
            }
        }
    };
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}