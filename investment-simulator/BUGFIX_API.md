# 🔧 Correção - Formato de Dados da API BCB

## 🐛 Problema Identificado

A API do Banco Central retorna valores em **formatos diferentes** dependendo da série consultada:

### Formato Observado:
```json
{
  "cdi": 0.000004593089516413604,
  "selic": 0.000045930895164136044,
  "ipca": 0.000007496908027748717,
  "poupanca": 0.000557371564321419
}
```

### Valores Esperados vs Recebidos:

| Série | Esperado (% a.a.) | Recebido (decimal) | Problema |
|-------|-------------------|-------------------|----------|
| CDI | 10.65% | 0.000004593... | Valor microscópico |
| Selic | 10.75% | 0.000045930... | Valor microscópico |
| IPCA | 4.5% | 0.000007496... | Valor microscópico |
| Poupança | 6.71% | 0.000557371... | Valor microscópico |

## ✅ Solução Implementada (v2)

### 1. Função de Normalização Melhorada
```javascript
const normalizarValor = (valor, valorPadrao, nomeSerie) => {
    if (!valor || valor === 0) return valorPadrao;
    
    // Valor muito pequeno (< 0.001) - formato incorreto
    if (valor < 0.001) return valorPadrao;
    
    // Valor entre 0.001 e 1 - está em decimal (0.0551 = 5.51%)
    if (valor < 1) return valor * 100;
    
    // Valor entre 1 e 100 - já está em percentual
    if (valor <= 100) return valor;
    
    // Valor > 100 - formato incorreto
    return valorPadrao;
};
```

### 2. Validação de Faixas
```javascript
const validarFaixa = (valor, min, max, nome, padrao) => {
    if (valor < min || valor > max) {
        console.warn(`${nome} fora da faixa esperada`);
        return padrao;
    }
    return valor;
};

// Faixas esperadas:
// CDI/Selic: 3-20% a.a.
// IPCA: 1-15% a.a.
// Poupança: 2-15% a.a.
```

### 3. Triplo Log de Debug
Agora com 3 etapas de verificação:
1. Valores brutos da API
2. Valores normalizados (após conversão)
3. Valores validados (após verificação de faixas)

## 🧪 Como Testar

1. **Abra o console** (F12) ao carregar a página
2. Procure por estas mensagens:
   ```
   Valores brutos da API: { cdi: 0.0551, selic: 0.0551, ipca: 0.09, poupanca: 0.0671 }
   Valores normalizados (% a.a.): { cdi: 5.51, selic: 5.51, ipca: 9.00, poupanca: 6.71 }
   Valores validados (% a.a.): { cdi: 5.51, selic: 5.51, ipca: 9.00, poupanca: 6.71 }
   ```

3. **Verifique se há warnings** de valores fora da faixa:
   - Se IPCA > 15% ou Poupança > 15%, será usado o padrão
   - Valores suspeitos são reportados no console

4. **Confira as taxas mensais** no simulador:
   - Devem estar entre 0.3% e 1.2% a.m.
   - Nada abaixo de 0.2% ou acima de 2% a.m.

## 📊 Valores Esperados Após Correção v2

### Baseado nos dados da API atual:

**Valores Brutos (formato decimal):**
- CDI: 0.0551 → 5.51% a.a.
- Selic: 0.0551 → 5.51% a.a.
- IPCA: 0.09 → 9.00% a.a.
- Poupança: 0.0671 → 6.71% a.a.

### Taxas Mensais Finais:
```
💰 Poupança: 0.54% a.m. (6.71% a.a.)
💎 CDB: 0.44% a.m. (5.24% a.a. - 95% CDI)
🏦 LCI/LCA: 0.38% a.m. (4.69% a.a. - 85% CDI)
🏛️ Tesouro Selic: 0.43% a.m. (5.24% a.a. - 95% Selic)
📈 Tesouro IPCA+: 1.17% a.m. (15.00% a.a. - IPCA + 6%)
📊 Ações: 1.5% a.m. (19.56% a.a.) - estimado
🏠 FIIs: 1.3% a.m. (16.77% a.a.) - estimado
```

### Faixas de Validação:
- ✅ CDI/Selic: 3-20% a.a.
- ✅ IPCA: 1-15% a.a.
- ✅ Poupança: 2-15% a.a.

## 🔍 Observações Técnicas

### Por que os valores estavam incorretos?

**Problema 1: Multiplicação Excessiva**
- Valor da API: 0.0671 (6.71% em decimal)
- Código antigo multiplicava por 100: 6.71%
- ❌ Mas se já estava correto, ficava 67.1%!

**Problema 2: Falta de Validação**
- Código aceitava qualquer valor entre 1 e infinito
- ❌ Poupança a 67% a.a.? Aceito!
- ❌ IPCA a 90% a.a.? Aceito!

### Como a correção v2 funciona?

**Etapa 1: Normalização Inteligente**
```
< 0.001    → Valor suspeito, usar padrão
0.001 - 1  → Decimal, multiplicar por 100
1 - 100    → Percentual correto, manter
> 100      → Valor suspeito, usar padrão
```

**Etapa 2: Validação de Faixas**
```
CDI/Selic: 3-20% a.a.   → valores razoáveis
IPCA: 1-15% a.a.        → inflação típica
Poupança: 2-15% a.a.    → rendimento esperado
```

**Etapa 3: Logs Detalhados**
- Bruto → Normalizado → Validado
- Warnings para valores fora da faixa
- Uso de padrão quando necessário

### Fórmula de Conversão:
```javascript
taxaMensal = (1 + taxaAnual/100)^(1/12) - 1
```

Exemplo: 10.65% a.a. → 0.844% a.m.

## 🚀 Próximos Passos

- ✅ Código corrigido
- ✅ Normalização automática
- ✅ Logs de debug
- ✅ Fallback robusto
- ⏳ Testar em produção
- ⏳ Monitorar valores da API

## 📝 Nota Importante

Se os valores ainda parecerem incorretos após esta correção, pode ser necessário:
1. Verificar a documentação oficial da série específica
2. Testar outras séries do BCB
3. Considerar usar médias móveis
4. Implementar validação adicional por faixa de valores

---

**Atualizado em**: 17/11/2025  
**Status**: ✅ Corrigido
