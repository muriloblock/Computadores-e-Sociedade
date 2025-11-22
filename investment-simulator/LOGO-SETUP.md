# 🎨 Guia de Instalação do Logo InvestSmart

## 📥 PASSO 1: Salvar o Logo

1. **Clique com botão direito** na imagem do logo que você enviou
2. **Salvar imagem como...**
3. Salve com o nome exato: `investsmart-logo.png`
4. Salve na pasta: 
   ```
   investment-simulator/assets/images/investsmart-logo.png
   ```

## 📍 Caminho Completo

```
c:\Users\Murilo Block\Desktop\Computadores-e-Sociedade-main\investment-simulator\assets\images\investsmart-logo.png
```

## ✅ Verificação

Após salvar, você deve ter:
```
investment-simulator/
├── assets/
│   └── images/
│       ├── investsmart-logo.png  ← SEU LOGO AQUI
│       └── README.md
├── src/
│   ├── index.html
│   └── ...
```

## 🎯 Onde o Logo Aparece

### ✨ Página Principal (index.html)
- ✅ **Header**: Logo pequeno no topo (50px altura)
- ✅ **Hero Section**: Logo grande centralizado (300px largura)
- ✅ **Footer**: Logo médio com opacidade (150px largura)
- ✅ **Favicon**: Ícone na aba do navegador

### 📊 Outras Páginas
- ✅ **Dashboard**: Logo no header
- ✅ **Aprender**: Logo no header
- ✅ **Portfólio**: Logo no header
- ✅ **Favicon**: Em todas as páginas

## 🎨 Recursos Visuais Implementados

### Animações
- Logo principal com fade-in suave
- Hover effect com scale (aumenta 5%)
- Brilho ao passar mouse
- Transições suaves

### Responsividade
- **Desktop**: Logo 50px
- **Tablet**: Logo 40px
- **Mobile**: Logo 35px
- Adapta automaticamente

## 🔧 Personalizações Disponíveis

Se quiser ajustar o tamanho do logo, edite `src/css/logo.css`:

```css
/* Tamanho do logo no header */
.logo-header img {
    height: 50px;  /* Mude aqui */
}

/* Tamanho do logo na hero */
.hero img {
    max-width: 300px;  /* Mude aqui */
}

/* Tamanho do logo no footer */
footer img {
    max-width: 150px;  /* Mude aqui */
}
```

## 🚀 Como Testar

1. Salve o logo no local correto
2. Abra `src/index.html` no navegador
3. Deve ver o logo:
   - No topo da página
   - Grande no centro (seção hero)
   - No rodapé
   - Como favicon na aba

## ❓ Problemas?

### Logo não aparece?
- ✅ Verifique se salvou com nome exato: `investsmart-logo.png`
- ✅ Verifique se está na pasta: `assets/images/`
- ✅ Limpe cache do navegador (Ctrl + F5)

### Logo muito grande/pequeno?
- Edite os valores em `src/css/logo.css` conforme mostrado acima

### Logo pixelado?
- Use uma imagem PNG de alta resolução
- Recomendado: mínimo 800px de largura

## 🎉 Resultado Final

Você terá um site profissional com:
- ✅ Logo bonito e consistente em todas as páginas
- ✅ Animações suaves e modernas
- ✅ Design responsivo
- ✅ Identidade visual forte

---

**Pronto!** Agora é só salvar a imagem e aproveitar o novo visual do InvestSmart! 💡✨
