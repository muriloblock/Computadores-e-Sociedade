# 📝 Notas da Versão 2.0 - Integração API Banco Central

**Data**: 17 de Novembro de 2025  
**Versão**: 2.0.0

## 🎉 Novidades

### ✨ Integração com API do Banco Central do Brasil

O simulador agora utiliza **taxas reais e atualizadas** diretamente da API oficial do Banco Central do Brasil!

#### O que mudou:

**ANTES:**
- ❌ Taxas fixas e desatualizadas
- ❌ Valores estimados manualmente
- ❌ Sem conexão com dados reais

**AGORA:**
- ✅ Taxas reais do CDI, Selic, IPCA e Poupança
- ✅ Atualização automática ao carregar
- ✅ Botão de atualização manual
- ✅ Cache inteligente (1 hora)
- ✅ Fallback para valores estimados se API falhar
- ✅ Notificações visuais de status
- ✅ Display de data de atualização

## 📦 Arquivos Adicionados

```
src/js/api.js              → Módulo de integração com API BCB
tests/api-test.html        → Página de teste da API
API_INTEGRATION.md         → Documentação técnica completa
TESTING.md                 → Guia de testes
CHANGELOG.md               → Este arquivo
```

## 📦 Arquivos Modificados

```
src/js/simulator.js        → Uso de taxas dinâmicas
src/js/main.js             → Inicialização da API
src/index.html             → Ordem de carregamento dos scripts
README.md                  → Atualização da documentação
```

## 🔧 Detalhes Técnicos

### Séries do BCB Utilizadas

| Série | ID  | Descrição |
|-------|-----|-----------|
| CDI   | 12  | Taxa CDI  |
| Selic | 11  | Taxa Selic |
| IPCA  | 433 | Inflação  |
| Poupança | 195 | Taxa Poupança |

### Cálculos Implementados

- **Poupança**: Valor direto da API
- **CDB**: 95% do CDI (padrão de mercado)
- **LCI/LCA**: 85% do CDI (isento IR)
- **Tesouro Selic**: 95% da Selic
- **Tesouro IPCA+**: IPCA + 6% a.a.
- **Ações**: 1.5% a.m. (média histórica)
- **FIIs**: 1.3% a.m. (média histórica)

### Conversões

Todas as taxas são convertidas de anuais (fornecidas pela API) para mensais usando juros compostos:

```
Taxa Mensal = (1 + Taxa Anual/100)^(1/12) - 1
```

## 🎯 Funcionalidades

### 1. Atualização Automática
- Busca taxas ao carregar a página
- Notificação visual de sucesso/erro
- Logs no console para debug

### 2. Atualização Manual
- Botão "🔄 Atualizar" na interface
- Atualiza data e valores instantaneamente
- Feedback visual durante carregamento

### 3. Cache Inteligente
- Armazena taxas por 1 hora
- Evita múltiplas requisições desnecessárias
- Melhora performance

### 4. Fallback Robusto
- Se API falhar, usa taxas estimadas
- Aplicação continua funcionando
- Usuário é notificado do modo offline

### 5. Interface Informativa
- Box azul com informações das taxas
- Data da última atualização
- Valores anuais de CDI e Selic

## 🧪 Como Testar

### Teste Rápido
1. Abra `src/index.html`
2. Observe a notificação verde
3. Veja as taxas atualizadas no select

### Teste Completo
1. Abra `tests/api-test.html`
2. Visualize todas as taxas
3. Compare valores mensais vs anuais

### Teste Avançado
```javascript
// No console do navegador
const taxas = await buscarTodasTaxas();
console.table(taxas);
```

## ⚠️ Requisitos

- **Navegador moderno** com suporte a async/await
- **Conexão com internet** para buscar taxas (opcional)
- **JavaScript habilitado**

## 🔄 Compatibilidade

- ✅ Chrome 55+
- ✅ Firefox 52+
- ✅ Safari 11+
- ✅ Edge 79+

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento.

## 📈 Melhorias Futuras

- [ ] Histórico de taxas (gráfico temporal)
- [ ] Comparação com períodos anteriores
- [ ] Alertas quando taxas mudarem significativamente
- [ ] Exportar dados para CSV/Excel
- [ ] Modo dark theme
- [ ] PWA (Progressive Web App)

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Enviar pull requests

## 📚 Documentação

- **README.md**: Visão geral do projeto
- **API_INTEGRATION.md**: Documentação técnica da API
- **TESTING.md**: Guia de testes

## 👨‍💻 Desenvolvedor

Murilo - [GitHub: @muriloblock](https://github.com/muriloblock)

---

**Agradecimentos especiais ao Banco Central do Brasil por fornecer a API pública de dados!**

🎉 **Aproveite o simulador com taxas reais!** 🎉
