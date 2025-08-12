# FitFlow - Seu Personal Trainer Digital

![FitFlow Logo](https://img.shields.io/badge/FitFlow-Personal%20Trainer%20Digital-brightgreen)

FitFlow é um aplicativo front-end moderno e responsivo para dispositivos móveis e web que ajuda o usuário a alcançar objetivos de treino e dieta. Com armazenamento local, o aplicativo funciona offline e não depende de backend.

## 🚀 Funcionalidades

### ✨ Cadastro e Perfil
- **Cadastro simples** com dados pessoais básicos (idade, peso, altura)
- **Definição de objetivos**: emagrecer, ganhar massa muscular, manter saúde
- **Nível de atividade**: baixo, médio, alto
- **Perfil personalizado** baseado nas informações fornecidas

### 💪 Sistema de Treinos
- **Registro de treinos diários** com tipo, duração e exercícios
- **Sugestões inteligentes** baseadas no objetivo do usuário
- **Diferentes tipos**: força, cardio, flexibilidade, misto
- **Controle de séries, repetições e pesos**
- **Observações e notas** para cada treino

### 🍽️ Sistema de Nutrição
- **Registro de refeições** (café da manhã, almoço, jantar, lanche)
- **Controle nutricional** com calorias, proteínas, carboidratos e gorduras
- **Sugestões alimentares** personalizadas para cada objetivo
- **Histórico de refeições** com detalhamento nutricional

### 📊 Dashboard e Progresso
- **Dashboard principal** com sugestões diárias personalizadas
- **Gráficos interativos** mostrando evolução do peso e medidas
- **Frequência de treinos** por semana
- **Distribuição de tipos de treino**
- **Histórico completo** de progresso

### 💡 Dicas e Informações
- **Dicas personalizadas** baseadas no objetivo e progresso
- **Categorias**: treino, nutrição, estilo de vida, motivação
- **Diferentes níveis**: iniciante, intermediário, avançado
- **Conteúdo educacional** sobre fitness e saúde

### 🔒 Armazenamento Local
- **IndexedDB e localStorage** para persistência de dados
- **Funcionamento offline** completo
- **Sincronização automática** entre sessões
- **Backup local** de todos os dados

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Gráficos**: Chart.js + React-Chartjs-2
- **Ícones**: Lucide React
- **Roteamento**: React Router DOM
- **Estado**: React Context API
- **Responsividade**: Mobile-first design

## 📱 Design e UX

- **Interface moderna** com cores vibrantes (verde, azul, laranja)
- **Design responsivo** para smartphones, tablets e desktops
- **Navegação intuitiva** com menu inferior para mobile
- **Animações suaves** e transições elegantes
- **Tema de saúde e energia** com elementos visuais atrativos

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/fitflow.git
cd fitflow
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Execute o aplicativo
```bash
npm start
# ou
yarn start
```

O aplicativo estará disponível em `http://localhost:3000`

### 4. Build para produção
```bash
npm run build
# ou
yarn build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Welcome.tsx     # Tela de boas-vindas e cadastro
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── WorkoutForm.tsx # Formulário de treinos
│   ├── MealForm.tsx    # Formulário de refeições
│   ├── Progress.tsx    # Tela de progresso e gráficos
│   ├── Tips.tsx        # Dicas e informações
│   └── Navigation.tsx  # Navegação inferior
├── contexts/           # Contextos React
│   └── UserContext.tsx # Gerenciamento de estado global
├── index.tsx           # Ponto de entrada
├── App.tsx             # Componente principal
└── index.css           # Estilos globais e Tailwind
```

## 🎯 Como Usar

### 1. Primeiro Acesso
- Acesse o aplicativo
- Preencha seus dados pessoais
- Defina seu objetivo de fitness
- Escolha seu nível de atividade

### 2. Dashboard Principal
- Visualize sugestões diárias de treino e dieta
- Acompanhe seu resumo do dia
- Veja dicas personalizadas

### 3. Registrar Treinos
- Acesse "Treino" no menu
- Escolha o tipo de treino
- Adicione exercícios com séries e repetições
- Use sugestões automáticas baseadas no seu objetivo

### 4. Registrar Refeições
- Acesse "Refeição" no menu
- Escolha o tipo de refeição
- Adicione alimentos com informações nutricionais
- Use sugestões alimentares personalizadas

### 5. Acompanhar Progresso
- Acesse "Progresso" no menu
- Registre peso e medidas regularmente
- Visualize gráficos de evolução
- Acompanhe estatísticas de treinos

### 6. Aprender com Dicas
- Acesse "Dicas" no menu
- Filtre por categoria e dificuldade
- Leia conteúdo personalizado
- Aplique conhecimento na prática

## 🔧 Configuração

### Personalização de Cores
Edite `tailwind.config.js` para alterar o esquema de cores:

```javascript
colors: {
  primary: {
    // Tons de verde para saúde
  },
  secondary: {
    // Tons de azul para confiança
  },
  accent: {
    // Tons de laranja para energia
  }
}
```

### Adicionar Novos Tipos de Exercício
Modifique o componente `WorkoutForm.tsx` para incluir novos tipos de treino.

### Personalizar Sugestões
Edite as funções de sugestão nos componentes para adaptar às suas necessidades.

## 📱 PWA (Progressive Web App)

O FitFlow é configurado como PWA, permitindo:
- Instalação no dispositivo
- Funcionamento offline
- Experiência similar a app nativo
- Notificações push (futuro)

## 🔮 Funcionalidades Futuras

- [ ] Notificações push para lembretes
- [ ] Sincronização com wearables
- [ ] Comunidade e social features
- [ ] Planos de treino pré-definidos
- [ ] Receitas e planos alimentares
- [ ] Exportação de dados
- [ ] Backup na nuvem
- [ ] Múltiplos usuários

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**FitFlow Team**
- Desenvolvido com ❤️ para a comunidade fitness

## 🙏 Agradecimentos

- Comunidade React
- Tailwind CSS
- Chart.js
- Lucide Icons
- Todos os usuários que testaram e deram feedback

---

**FitFlow** - Transformando vidas através da tecnologia e fitness! 💪✨
