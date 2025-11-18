# Simulador de Investimentos

Bem-vindo ao projeto **Simulador de Investimentos**! Este site interativo foi criado para ensinar usuários sobre finanças e estratégias de investimento por meio de uma experiência prática de simulação.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
investment-simulator
├── src
│   ├── index.html          # Ponto de entrada principal do site
│   ├── css
│   │   ├── styles.css      # Estilos principais do site
│   │   ├── simulator.css    # Estilos específicos do simulador de investimentos
│   │   └── responsive.css   # Estilos responsivos para diversos dispositivos
│   ├── js
│   │   ├── api.js          # 🆕 Integração com API do Banco Central
│   │   ├── main.js         # Arquivo JavaScript principal para inicialização e funcionalidade
│   │   ├── simulator.js     # Lógica do simulador de investimentos
│   │   └── charts.js       # Renderização e visualização de gráficos
│   └── pages
│       ├── dashboard.html   # Página de painel com visão geral dos investimentos
│       ├── learn.html       # Conteúdo educativo sobre finanças
│       └── portfolio.html    # Página para gerenciamento de portfólio de investimentos
├── tests
│   └── api-test.html       # 🆕 Página de teste da integração com API
├── assets
│   └── fonts
│       └── custom-fonts.css # Estilos de fontes personalizadas
├── API_INTEGRATION.md      # 🆕 Documentação da integração com API
└── README.md               # Documentação do projeto
```

## Funcionalidades

* **Simulador de Investimentos Interativo**: Os usuários podem simular diferentes cenários de investimento e visualizar os resultados potenciais.
* **🆕 Taxas Reais da API do Banco Central**: Integração com a API oficial do BCB para obter taxas atualizadas de CDI, Selic, IPCA e Poupança em tempo real.
* **Conteúdo Educacional**: Aprenda sobre finanças e estratégias de investimento por meio de conteúdos envolventes.
* **Design Responsivo**: O site foi projetado para ser totalmente responsivo, garantindo uma ótima experiência em todos os dispositivos.
* **Visualização de Dados**: Gráficos e diagramas para ajudar a visualizar dados e desempenho de investimentos.
* **Atualização Automática**: As taxas são atualizadas automaticamente, com opção de atualização manual e sistema de cache inteligente.

## Instruções de Configuração

1. Clone o repositório para sua máquina local.
2. Abra o arquivo `index.html` em seu navegador para visualizar o site.
3. Para desenvolvimento, você pode modificar os arquivos HTML, CSS e JavaScript no diretório `src`.

## Como Usar o Simulador de Investimentos

1. Navegue até a seção **Simulador** do site.
2. As taxas serão atualizadas automaticamente com dados reais do Banco Central do Brasil.
3. Insira seus parâmetros de investimento (valor inicial, aporte mensal, período).
4. Clique no botão **Simular Investimento** para ver os resultados.
5. Analise os resultados e explore diferentes cenários para compreender a dinâmica dos investimentos.
6. Use o botão **🔄 Atualizar** para buscar as taxas mais recentes a qualquer momento.

### 🧪 Testar a API

Para verificar se a integração com a API está funcionando:
1. Abra o arquivo `tests/api-test.html` no seu navegador.
2. A página exibirá automaticamente as taxas obtidas da API do BCB.
3. Confira a documentação completa em `API_INTEGRATION.md`.

## 📚 Documentação Adicional

- **[API_INTEGRATION.md](investment-simulator/API_INTEGRATION.md)**: Documentação detalhada sobre a integração com a API do Banco Central, incluindo séries utilizadas, cálculos e manutenção.

Sinta-se à vontade para contribuir com o projeto enviando *issues* ou *pull requests*!

Boas simulações e bons investimentos!
