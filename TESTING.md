# 🧪 **Guia de Testes - FitFlow**

Este documento descreve como executar, manter e contribuir para os testes do projeto FitFlow.

## 📋 **Índice**

- [Visão Geral](#visão-geral)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Executando Testes](#executando-testes)
- [Cobertura de Testes](#cobertura-de-testes)
- [Escrevendo Novos Testes](#escrevendo-novos-testes)
- [Pipeline CI/CD](#pipeline-cicd)
- [Troubleshooting](#troubleshooting)

## 🎯 **Visão Geral**

O projeto FitFlow possui uma suite completa de testes unitários que garante:
- **Cobertura mínima de 90%** para todas as métricas
- **Validação automática** via GitHub Actions
- **Qualidade do código** com linting e type checking
- **Build verification** em cada commit

## 📁 **Estrutura dos Testes**

```
src/
├── __tests__/                    # Diretório principal de testes
│   ├── components/               # Testes dos componentes React
│   │   ├── Dashboard.test.tsx
│   │   └── EditUserForm.test.tsx
│   └── contexts/                 # Testes dos contextos
│       ├── ThemeContext.test.tsx
│       └── UserContext.test.tsx
├── utils/
│   └── __tests__/
│       └── weightUtils.test.ts   # Testes das funções utilitárias
└── setupTests.js                 # Configuração global dos testes
```

## 🚀 **Executando Testes**

### **Comandos Disponíveis**

```bash
# Executar testes em modo watch (desenvolvimento)
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo CI (sem watch)
npm run test:ci

# Executar build de produção
npm run build
```

### **Executando Testes Específicos**

```bash
# Testar apenas um arquivo
npm test -- weightUtils.test.ts

# Testar apenas um contexto
npm test -- contexts

# Testar apenas componentes
npm test -- components

# Executar testes com padrão específico
npm test -- --testNamePattern="should calculate BMI"
```

## 📊 **Cobertura de Testes**

### **Métricas Obrigatórias (90% mínimo)**

- **Branches**: 90%
- **Functions**: 90%
- **Lines**: 90%
- **Statements**: 90%

### **Verificando Cobertura**

```bash
npm run test:coverage
```

Após a execução, abra `coverage/lcov-report/index.html` no navegador para visualizar o relatório detalhado.

### **Relatório de Cobertura**

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |    95.2 |     92.1 |    94.7 |    95.2 |
```

## ✍️ **Escrevendo Novos Testes**

### **Estrutura de um Teste**

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### **Boas Práticas**

1. **Nomes descritivos**: Use `it('should do something specific')`
2. **Arrange-Act-Assert**: Estruture seus testes claramente
3. **Mocks apropriados**: Mock apenas o necessário
4. **Testes isolados**: Cada teste deve ser independente
5. **Cobertura completa**: Teste casos de sucesso e erro

### **Exemplos de Testes**

#### **Testando Componentes**

```typescript
it('should display user information correctly', () => {
  const mockUser = { name: 'John', age: 25 };
  render(<UserProfile user={mockUser} />);
  
  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('25')).toBeInTheDocument();
});
```

#### **Testando Contextos**

```typescript
it('should provide context values to children', () => {
  render(
    <TestProvider>
      <TestComponent />
    </TestProvider>
  );
  
  expect(screen.getByTestId('context-value')).toHaveTextContent('expected');
});
```

#### **Testando Funções Utilitárias**

```typescript
it('should calculate BMI correctly', () => {
  const result = calculateBMI(70, 170);
  expect(result).toBeCloseTo(24.22, 2);
});

it('should handle edge cases', () => {
  expect(calculateBMI(0, 170)).toBe(0);
  expect(calculateBMI(70, 0)).toBe(Infinity);
});
```

## 🔄 **Pipeline CI/CD**

### **GitHub Actions Workflow**

O pipeline executa automaticamente em:
- **Push** para `main` e `develop`
- **Pull Requests** para `main` e `develop`

### **Jobs do Pipeline**

1. **Test**: Executa testes em Node.js 18.x e 20.x
2. **Lint**: Verifica ESLint e TypeScript
3. **Build**: Compila a aplicação
4. **Quality Gate**: Valida se todos os jobs passaram

### **Verificações Automáticas**

- ✅ Cobertura de testes >= 90%
- ✅ Todos os testes passando
- ✅ Build bem-sucedido
- ✅ Linting aprovado
- ✅ TypeScript sem erros

### **Comentários Automáticos em PRs**

O pipeline comenta automaticamente nos Pull Requests com:
- Status dos testes
- Cobertura de código
- Resultado do build
- Qualidade geral do código

## 🛠️ **Troubleshooting**

### **Problemas Comuns**

#### **1. Testes Falhando**

```bash
# Verificar erros específicos
npm test -- --verbose

# Executar com mais detalhes
npm test -- --detectOpenHandles
```

#### **2. Problemas de Cobertura**

```bash
# Verificar cobertura atual
npm run test:coverage

# Identificar arquivos não cobertos
npm run test:coverage -- --coverageReporters=text
```

#### **3. Problemas de Mock**

```typescript
// Verificar se mocks estão funcionando
jest.clearAllMocks();
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
```

#### **4. Problemas de Async**

```typescript
// Usar waitFor para operações assíncronas
await waitFor(() => {
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

### **Debugging**

```bash
# Executar testes com debug
npm test -- --detectOpenHandles --forceExit

# Executar um teste específico com debug
npm test -- --testNamePattern="specific test" --verbose
```

## 📚 **Recursos Adicionais**

### **Documentação Oficial**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Events](https://testing-library.com/docs/user-event/intro/)

### **Ferramentas Úteis**

- **Jest**: Framework de testes
- **React Testing Library**: Utilitários para testar React
- **User Event**: Simulação de interações do usuário
- **MSW**: Mock Service Worker para APIs

### **Convenções do Projeto**

- **Naming**: `ComponentName.test.tsx` para componentes
- **Estrutura**: `describe` para grupos, `it` para casos
- **Mocks**: Centralizados em `__mocks__/`
- **Setup**: Configuração global em `setupTests.js`

## 🤝 **Contribuindo**

### **Antes de Fazer Commit**

1. ✅ Execute `npm test` localmente
2. ✅ Verifique cobertura com `npm run test:coverage`
3. ✅ Execute `npm run build` para verificar build
4. ✅ Verifique linting com `npm run lint`

### **Criando Novos Testes**

1. Identifique o componente/função a testar
2. Crie arquivo de teste seguindo a convenção
3. Implemente casos de teste abrangentes
4. Verifique se a cobertura está adequada
5. Execute testes localmente antes do commit

### **Mantendo Qualidade**

- Mantenha cobertura acima de 90%
- Atualize testes quando modificar funcionalidades
- Use mocks apropriados para dependências externas
- Documente casos de teste complexos

---

**🎯 Lembre-se**: Testes são a base da qualidade do código. Mantenha-os atualizados e abrangentes!
