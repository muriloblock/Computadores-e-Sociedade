# Integração com API do Banco Central do Brasil

## 📊 Visão Geral

O **ModelaInvest** utiliza **taxas reais** obtidas da API oficial do Banco Central do Brasil para fornecer simulações mais precisas e atualizadas.

## 🔗 API Utilizada

**Banco Central do Brasil - Sistema Gerenciador de Séries Temporais (SGS)**
- URL Base: `https://api.bcb.gov.br/dados/serie/bcdata.sgs`
- Documentação: https://dadosabertos.bcb.gov.br/

## 📈 Séries Utilizadas

| Investimento | Série BCB | Descrição |
|-------------|-----------|-----------|
| **CDI** | 12 | Taxa referencial para CDB |
| **Selic** | 11 | Taxa básica de juros (Tesouro) |
| **IPCA** | 433 | Inflação (Tesouro IPCA+) |
| **Poupança** | 195 | Taxa da caderneta de poupança |

## 💡 Como Funciona

### 1. Busca Automática
- As taxas são buscadas automaticamente ao carregar a página
- Cache de 1 hora para evitar requisições desnecessárias

### 2. Cálculo de Taxas

**Taxas Diretas da API:**
- Poupança: valor direto da API
- CDI: base para cálculos de renda fixa

**Taxas Calculadas:**
- **CDB**: 95% do CDI (típico do mercado)
- **LCI/LCA**: 85% do CDI (isento de IR)
- **Tesouro Selic**: 95% da Selic
- **Tesouro IPCA+**: IPCA + 6% a.a. (média de mercado)

**Taxas Estimadas (média histórica):**
- **Ações**: 1.5% a.m. (~19.56% a.a.)
- **FIIs**: 1.3% a.m. (~16.77% a.a.)

### 3. Conversão de Taxas
```javascript
// As taxas da API são anuais
// Convertemos para mensais usando juros compostos:
taxaMensal = (1 + taxaAnual/100)^(1/12) - 1
```

## 🎯 Funcionalidades

### ✅ Atualização Automática
- Taxas atualizadas ao carregar a página
- Botão manual de atualização disponível
- Notificações visuais de status

### ✅ Fallback Inteligente
- Se a API falhar, usa taxas estimadas
- Aplicação continua funcionando normalmente

### ✅ Cache Eficiente
- Taxas armazenadas por 1 hora
- Reduz requisições à API
- Melhor performance

### ✅ Interface Informativa
- Exibe data da última atualização
- Mostra valores anuais de CDI e Selic
- Feedback visual de sucesso/erro

## 🚀 Exemplo de Uso

```javascript
// Buscar taxas manualmente
const taxas = await buscarTodasTaxas();

// Acessar taxa mensal do CDB
const taxaCDB = taxasInvestimento['cdb']; // ex: 0.0095 (0.95% a.m.)

// Converter para anual
const taxaAnual = taxaMensalParaAnual(taxaCDB); // ex: 12.01%
```

## 📋 Estrutura dos Arquivos

```
src/js/
  ├── api.js          ← Nova: Integração com API BCB
  ├── simulator.js    ← Atualizado: Usa taxas reais
  ├── main.js         ← Atualizado: Inicializa API
  └── charts.js       ← Inalterado
```

## 🔧 Manutenção

### Atualizar Séries BCB
Se precisar adicionar novas séries, edite o objeto em `api.js`:

```javascript
const API_BCB = {
    baseUrl: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs',
    series: {
        cdi: 12,
        selic: 11,
        // Adicione mais séries aqui
        novaSerieId: 999
    }
};
```

### Ajustar Percentuais
Para modificar os percentuais do CDI, edite em `api.js`:

```javascript
// Linha ~70
cdb: cdi ? (Math.pow(1 + (cdi * 0.95) / 100, 1/12) - 1) : 0.010,
//                              ^^^^
//                         Percentual do CDI (95%)
```

## ⚠️ Observações Importantes

1. **Conectividade**: Requer conexão com internet
2. **CORS**: A API do BCB permite requisições diretas do navegador
3. **Limite**: Sem limite conhecido de requisições, mas use cache
4. **Precisão**: Taxas de CDB/LCI variam por banco - valores são estimativas
5. **Renda Variável**: Ações e FIIs usam médias históricas (não há API pública)

## 🌐 URLs Úteis

- **API BCB**: https://api.bcb.gov.br
- **Catálogo de Séries**: https://www3.bcb.gov.br/sgspub/
- **Documentação**: https://dadosabertos.bcb.gov.br/dataset/11-taxa-de-juros---selic

## 📝 Licença

Este código é de uso educativo, seguindo os termos de uso da API do Banco Central do Brasil.
