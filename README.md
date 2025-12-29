# Tech Challenge Fase 4 - Mobile

## 📌 Sobre o Projeto

Este projeto é a interface mobile da aplicação de blogging, desenvolvida em React Native. A aplicação permite que docentes e alunos interajam com os posts, além de oferecer uma área administrativa completa para gestão de usuários (professores/estudantes) e conteúdos.

---

## 🚀 Tecnologias

- **Framework:** React Native (Hooks e Componentes Funcionais)
- **Linguagem:** Typescript (TSX)
- **Navegação:** React Navigation (tabs)
- **Consumo de API:** Axios para integração com os endpoints REST

---

## 📦 Instalação e Execução

### 1. Requisitos

- Node.js 18+
- Expo Go (Opcional)

### 2. Configuração

```bash
# Clonar repositório
git clone <URL_DO_REPO>
cd mobile-techchallenge
code .

# Instalar dependências
npm install
```

### 3. Rodando o APP via Web

```bash
# Rodar o projeto
npm start
pressionar tecla "W"
```

---

## 🧱 Arquitetura do Projeto

O projeto segue uma arquitetura organizada em **camadas**, separando responsabilidades:

### 📁 Estrutura de Pastas

```
mobile-techchallenge/
├── .expo/
│    ├── types/
│    ├── web/
│    ├── devices.json
│    └── README.md
│ 
├── .vscode/
│    ├── extensions.json
│    └── settings.json
│              
├── app/
│    ├── (tabs)/
│    ├── post/
│    ├── _layout.tsx
│    ├── createProf.tsx
│    ├── home.tsx
│    ├── index.tsx
│    └── profile.tsx
│                     
├── assets/                 
├── components/             
├── constants/           
├── hooks/           
├── node_modules/              
├── scripts/             
├── src/
│    ├── api/
│    └── storage/
│
├── .gitignore
├──  app.json
├──  eslint.config.js
├──  expo-env.d.ts
├──  package-lock.json
├──  package.json
├──  README.md
└──  tsconfig.json
       
```

---

## 🔗 Funcionalidades Implementadas

### 1. Área do Aluno

- **Página Pricipal:** Lista de todos os posts com título, autor e descrição.
- **Busca:** Filtro de postagens por palavras-chave.
- **Leitura:** Visualização do conteúdo completo do post.

### 2. Área do Professor (Autenticada)

- **Gestão de Posts:** Criar, editar e excluir postagens.
- **Gestão de Professores:** Listagem paginada, cadastro e edição de outros docentes.

### 3. Segurança e Regras

- **Login:** Acesso restrito para professores.
- **Permissões:** Apenas professores podem acessar páginas de criação e edição, alunos possuem acesso apenas para leitura.

---

## 🚧 Dificuldades Encontradas

### 1. Problema 1

descrição

**✅ Solução 1:**  
solução

---

## 📚 Aprendizados

- **Desenvolvimento Mobile Cross-Platform:** Compreensão de como o React Native utiliza componentes nativos para renderizar interfaces em iOS e Android a partir de uma única base de código em JavaScript/TypeScript.
- **Gestão de Ciclo de Vida e Hooks:** Domínio do uso de useState para controle de dados locais e useEffect para sincronização de chamadas à API assim que as telas são montadas.
- **Fluxo de Autenticação Segura:** Implementação de navegação condicional, onde o usuário é redirecionado para a tela de Login caso não possua um token válido, garantindo a proteção das rotas administrativas.
- **Consumo de APIs REST:** Experiência prática na integração do front-end com o back-end, tratando diferentes status de resposta (200, 201, 401, 403) e exibindo feedbacks visuais para o usuário.
- **Navegação Complexa:** Estruturação de menus de navegação (Tab Navigation) para alternar entre a listagem de posts e as áreas de gerenciamento de professores e alunos.

---

## 🎥 Gravação

O vídeo demonstrativo com o funcionamento completo da aplicação pode ser acessado no link abaixo:
link

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais (FIAP Tech Challenge).
