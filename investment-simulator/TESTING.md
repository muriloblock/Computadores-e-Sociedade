# 🚀 Guia Rápido - Testando a Integração do InvestSmart

## Como testar a implementação

### Opção 1: Testar no InvestSmart Principal

1. Abra o arquivo `src/index.html` no navegador
2. Observe o console do navegador (F12) para ver os logs
3. Aguarde a mensagem: "✅ Taxas atualizadas com dados do Banco Central!"
4. Veja as taxas atualizadas nos options do select
5. Use o simulador normalmente

### Opção 2: Página de Teste Dedicada

1. Abra o arquivo `tests/api-test.html` no navegador
2. A página executa automaticamente um teste completo
3. Visualize:
   - Status da conexão com a API
   - Todas as taxas obtidas
   - Comparação mensal vs anual
   - JSON completo dos dados

### Opção 3: Console do Navegador

Abra qualquer página do InvestSmart, pressione F12 e execute:

```javascript
// Buscar taxas
const taxas = await buscarTodasTaxas();
console.log(taxas);

// Ver taxa específica
console.log('Taxa CDB:', formatarTaxa(taxasInvestimento['cdb']));

// Converter para anual
console.log('CDB anual:', taxaMensalParaAnual(taxasInvestimento['cdb']).toFixed(2) + '%');
```

## ✅ Checklist de Verificação

- [ ] Notificação aparece ao carregar a página
- [ ] Box azul com informações da API é exibido
- [ ] Taxas nos selects são atualizadas
- [ ] Botão "🔄 Atualizar" funciona
- [ ] Data da última atualização é mostrada
- [ ] Simulação funciona normalmente
- [ ] Cache evita múltiplas requisições

## 🐛 Solução de Problemas

### Erro: "Failed to fetch"
- **Causa**: Sem conexão com internet ou API do BCB fora do ar
- **Solução**: O sistema usa taxas padrão automaticamente

### Taxas não atualizam
- **Causa**: Cache ativo (1 hora)
- **Solução**: Clique no botão "🔄 Atualizar" ou execute no console:
  ```javascript
  taxasCache.data = null;
  await atualizarTaxasReais();
  ```

### Console mostra erros CORS
- **Causa**: Raro, mas pode acontecer em alguns navegadores
- **Solução**: Use um servidor local ou abra diretamente o arquivo HTML

## 📊 Exemplo de Resultado Esperado

Ao abrir o console, você deve ver algo como:

```
InvestSmart Inicializado
Buscando taxas atualizadas do Banco Central...
Taxas atualizadas: {
  poupanca: 0.004845,
  cdb: 0.009234,
  lci: 0.008123,
  ...
}
✅ Taxas atualizadas com dados do Banco Central!
```

## 🎯 Próximos Passos

Após confirmar que tudo funciona:

1. ✅ Testar em diferentes navegadores
2. ✅ Verificar responsividade mobile
3. ✅ Fazer simulações com valores reais
4. ✅ Comparar resultados com calculadoras online
5. ✅ Ajustar percentuais se necessário

## 💡 Dicas

- A API do BCB é gratuita e sem limite de requisições conhecido
- O cache de 1 hora evita requisições desnecessárias
- Você pode ajustar o tempo de cache em `api.js` (linha 14)
- Para produção, considere adicionar um loading spinner
- Valores de renda variável (ações, FIIs) são estimativas

## 🔗 Links Úteis

- API BCB: https://api.bcb.gov.br
- Catálogo: https://www3.bcb.gov.br/sgspub/
- Documentação: https://dadosabertos.bcb.gov.br/

---

**Divirta-se testando! 🎉**
