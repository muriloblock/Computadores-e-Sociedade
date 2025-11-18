// API do Banco Central do Brasil
// Módulo para buscar taxas reais de investimentos

const API_BCB = {
    baseUrl: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs',
    series: {
        cdi: 4389,      // Taxa CDI Anualizada (série mais confiável)
        selic: 432,     // Taxa Selic Meta (série mais confiável)
        ipca: 433,      // IPCA (inflação)
        poupanca: 25,   // Poupança - taxa acumulada
        selicAcum: 1178 // Selic acumulada (backup)
    }
};

// Cache para armazenar taxas e evitar múltiplas requisições
let taxasCache = {
    data: null,
    timestamp: null,
    validade: 3600000 // 1 hora em milissegundos
};

/**
 * Busca taxa de uma série específica do BCB
 * @param {number} serieId - ID da série no sistema do BCB
 * @param {number} ultimos - Quantidade de últimos valores (padrão: 1)
 * @returns {Promise<number>} - Valor da taxa
 */
async function buscarTaxaBCB(serieId, ultimos = 1) {
    try {
        const url = `${API_BCB.baseUrl}.${serieId}/dados/ultimos/${ultimos}?formato=json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.status}`);
        }
        
        const dados = await response.json();
        
        if (dados && dados.length > 0) {
            return parseFloat(dados[0].valor);
        }
        
        throw new Error('Nenhum dado retornado');
    } catch (erro) {
        console.error(`Erro ao buscar série ${serieId}:`, erro);
        return null;
    }
}

/**
 * Busca todas as taxas necessárias para o simulador
 * @returns {Promise<Object>} - Objeto com todas as taxas
 */
async function buscarTodasTaxas() {
    // Verificar cache
    const agora = Date.now();
    if (taxasCache.data && taxasCache.timestamp && (agora - taxasCache.timestamp < taxasCache.validade)) {
        console.log('Usando taxas do cache');
        return taxasCache.data;
    }
    
    try {
        console.log('Buscando taxas atualizadas do Banco Central...');
        
        // Buscar taxas em paralelo
        const [cdi, selic, ipca, poupanca] = await Promise.all([
            buscarTaxaBCB(API_BCB.series.cdi),
            buscarTaxaBCB(API_BCB.series.selic),
            buscarTaxaBCB(API_BCB.series.ipca),
            buscarTaxaBCB(API_BCB.series.poupanca)
        ]);
        
        console.log('Valores brutos da API:', { cdi, selic, ipca, poupanca });
        
        // A API do BCB retorna valores em formatos diferentes por série:
        // - Algumas séries: valor decimal (ex: 0.0671 = 6.71%)
        // - Outras séries: valor percentual (ex: 10.65 = 10.65%)
        // - Outras: valores muito pequenos que precisam ajuste
        
        const normalizarValor = (valor, valorPadrao, nomeSerie) => {
            if (!valor || valor === 0) return valorPadrao;
            
            // Se valor muito pequeno (< 0.001), pode estar em formato incorreto
            if (valor < 0.001) {
                console.warn(`Valor suspeito para ${nomeSerie}: ${valor}, usando padrão ${valorPadrao}`);
                return valorPadrao;
            }
            
            // Se entre 0.001 e 1, está em decimal (ex: 0.0551 = 5.51%)
            if (valor < 1) {
                return valor * 100;
            }
            
            // Se entre 1 e 100, assumir que já está em percentual
            if (valor <= 100) {
                return valor;
            }
            
            // Se maior que 100, pode estar em formato incorreto
            console.warn(`Valor alto suspeito para ${nomeSerie}: ${valor}, usando padrão ${valorPadrao}`);
            return valorPadrao;
        };
        
        const cdiNorm = normalizarValor(cdi, 11.25, 'CDI');
        const selicNorm = normalizarValor(selic, 10.75, 'Selic');
        const ipcaNorm = normalizarValor(ipca, 4.5, 'IPCA');
        const poupancaNorm = normalizarValor(poupanca, 6.71, 'Poupança');
        
        console.log('Valores normalizados (% a.a.):', { 
            cdi: cdiNorm.toFixed(2), 
            selic: selicNorm.toFixed(2), 
            ipca: ipcaNorm.toFixed(2), 
            poupanca: poupancaNorm.toFixed(2)
        });
        
        // Validar se os valores normalizados estão em faixas razoáveis
        const validarFaixa = (valor, min, max, nome, padrao) => {
            if (valor < min || valor > max) {
                console.warn(`${nome} fora da faixa esperada (${min}-${max}%): ${valor}%, usando ${padrao}%`);
                return padrao;
            }
            return valor;
        };
        
        // Faixas ajustadas para realidade brasileira (valores mais altos)
        const cdiValid = validarFaixa(cdiNorm, 8, 18, 'CDI', 11.25);
        const selicValid = validarFaixa(selicNorm, 8, 18, 'Selic', 10.75);
        const ipcaValid = validarFaixa(ipcaNorm, 2, 12, 'IPCA', 4.5);
        const poupancaValid = validarFaixa(poupancaNorm, 5, 12, 'Poupança', 6.71);
        
        console.log('Valores validados (% a.a.):', { 
            cdi: cdiValid.toFixed(2), 
            selic: selicValid.toFixed(2), 
            ipca: ipcaValid.toFixed(2), 
            poupanca: poupancaValid.toFixed(2)
        });
        
        // Calcular taxas base
        const taxaCDB = cdiValid * 0.95; // CDB rende ~95% do CDI
        const taxaLCI = cdiValid * 0.90; // LCI rende ~90% do CDI (isento de IR)
        const taxaTesouroSelic = selicValid * 0.98; // Tesouro Selic rende ~98% da Selic
        
        // Garantir que LCI/CDB não rendam menos que poupança
        // (não faz sentido no mundo real)
        const taxaCDBFinal = Math.max(taxaCDB, poupancaValid * 1.05); // Mínimo 5% acima da poupança
        const taxaLCIFinal = Math.max(taxaLCI, poupancaValid * 1.02); // Mínimo 2% acima da poupança
        
        console.log('Ajustes aplicados:', {
            cdb: `${taxaCDB.toFixed(2)}% → ${taxaCDBFinal.toFixed(2)}%`,
            lci: `${taxaLCI.toFixed(2)}% → ${taxaLCIFinal.toFixed(2)}%`
        });
        
        // Converter taxas anuais para mensais usando juros compostos
        const taxas = {
            cdi: Math.pow(1 + cdiValid / 100, 1/12) - 1,
            selic: Math.pow(1 + selicValid / 100, 1/12) - 1,
            ipca: Math.pow(1 + ipcaValid / 100, 1/12) - 1,
            poupanca: Math.pow(1 + poupancaValid / 100, 1/12) - 1,
            // Taxas ajustadas para serem realistas
            cdb: Math.pow(1 + taxaCDBFinal / 100, 1/12) - 1,
            lci: Math.pow(1 + taxaLCIFinal / 100, 1/12) - 1,
            tesouroSelic: Math.pow(1 + taxaTesouroSelic / 100, 1/12) - 1,
            tesouroIpca: Math.pow(1 + (ipcaValid + 6) / 100, 1/12) - 1,
            // Renda variável - média histórica
            acoes: 0.015,
            fiis: 0.013,
            // Valores anuais para exibição
            valores_anuais: {
                cdi: cdiValid,
                selic: selicValid,
                ipca: ipcaValid,
                poupanca: poupancaValid,
                cdb_final: taxaCDBFinal,
                lci_final: taxaLCIFinal
            },
            dataAtualizacao: new Date().toLocaleString('pt-BR')
        };
        
        // Atualizar cache
        taxasCache.data = taxas;
        taxasCache.timestamp = agora;
        
        console.log('Taxas atualizadas com sucesso:', taxas);
        return taxas;
        
    } catch (erro) {
        console.error('Erro ao buscar taxas:', erro);
        // Retornar taxas padrão em caso de erro
        return getTaxasPadrao();
    }
}

/**
 * Retorna taxas padrão caso a API falhe
 */
function getTaxasPadrao() {
    console.log('Usando taxas padrão (fallback)');
    
    // Valores estimados baseados nas taxas REAIS do mercado (Nov 2025)
    const cdiPadrao = 11.25;     // CDI atual mais realista
    const selicPadrao = 10.75;   // Selic meta
    const ipcaPadrao = 4.5;      // IPCA acumulado 12 meses
    const poupancaPadrao = 6.71; // Poupança atual
    
    // Garantir coerência: CDB/LCI sempre acima da poupança
    const taxaCDB = Math.max(cdiPadrao * 0.95, poupancaPadrao * 1.05);
    const taxaLCI = Math.max(cdiPadrao * 0.90, poupancaPadrao * 1.02);
    
    return {
        cdi: Math.pow(1 + cdiPadrao / 100, 1/12) - 1,
        selic: Math.pow(1 + selicPadrao / 100, 1/12) - 1,
        ipca: Math.pow(1 + ipcaPadrao / 100, 1/12) - 1,
        poupanca: Math.pow(1 + poupancaPadrao / 100, 1/12) - 1,
        cdb: Math.pow(1 + taxaCDB / 100, 1/12) - 1,
        lci: Math.pow(1 + taxaLCI / 100, 1/12) - 1,
        tesouroSelic: Math.pow(1 + (selicPadrao * 0.98) / 100, 1/12) - 1,
        tesouroIpca: Math.pow(1 + (ipcaPadrao + 6) / 100, 1/12) - 1,
        acoes: 0.015,
        fiis: 0.013,
        valores_anuais: {
            cdi: cdiPadrao,
            selic: selicPadrao,
            ipca: ipcaPadrao,
            poupanca: poupancaPadrao,
            cdb_final: taxaCDB,
            lci_final: taxaLCI
        },
        dataAtualizacao: 'Valores estimados (sem conexão com API)'
    };
}

/**
 * Converte taxa mensal para anual
 */
function taxaMensalParaAnual(taxaMensal) {
    return (Math.pow(1 + taxaMensal, 12) - 1) * 100;
}

/**
 * Formata taxa para exibição
 */
function formatarTaxa(taxa, casasDecimais = 2) {
    return (taxa * 100).toFixed(casasDecimais) + '%';
}
