# ⚡ FlashDesk - Sistema de Help Desk Distribuído

![CI/CD](https://github.com/USUARIO/REPOSITORIO/actions/workflows/ARQUIVO_WORKFLOW.yml/badge.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)
![Redis](https://img.shields.io/badge/Redis-Pub%2FSub-red?logo=redis)
![Stack](https://img.shields.io/badge/Stack-MERN-green)

> Projeto desenvolvido para a disciplina de **Engineering Software Development** do curso de **Engenharia de Software** da **FIAP (2025)**.

---

## 📋 Sobre o Projeto

O **FlashDesk** é uma plataforma de gerenciamento de chamados (Help Desk) baseada em uma arquitetura de **microsserviços distribuídos**. O objetivo principal é demonstrar a comunicação assíncrona entre serviços, persistência poliglota, containerização e integração externa.

O sistema permite criar, editar, listar e excluir chamados de suporte. Toda ação crítica dispara eventos em tempo real para um canal do **Microsoft Teams** via Webhook, com notificações visuais distintas para cada status.

---

## 🚀 Arquitetura e Tecnologias

O projeto está dividido em serviços independentes que rodam em containers Docker:

### 🏗️ Estrutura
1.  **Frontend (React):** Interface do usuário para gestão dos chamados.
2.  **Ticket Service (Node.js/Express):** Microsserviço responsável pelo CRUD de chamados e persistência no MongoDB.
3.  **Notification Service (Node.js/Express):** Microsserviço "worker" que escuta eventos do Redis e envia notificações para o MS Teams.
4.  **Message Broker (Redis):** Gerencia a comunicação assíncrona (Pub/Sub) entre os serviços.
5.  **Database (MongoDB):** Banco de dados NoSQL para armazenamento dos tickets.

### 🛠️ Tech Stack
* **Frontend:** React.js, Bootstrap.
* **Backend:** Node.js, Express.
* **Banco de Dados:** MongoDB.
* **Mensageria:** Redis.
* **Infraestrutura:** Docker, Docker Compose.
* **Documentação:** Swagger (OpenAPI).
* **Integração Externa:** Microsoft Teams Webhook (Adaptive Cards).
* **CI/CD:** GitHub Actions.

---

## ✨ Funcionalidades

* ✅ **CRUD Completo:** Criação, Leitura, Atualização e Exclusão de chamados.
* ✅ **Comunicação Assíncrona:** O `Ticket Service` publica eventos que são consumidos pelo `Notification Service` via Redis.
* ✅ **Notificações Inteligentes (MS Teams):**
    * 🔵 **Criação:** Card Azul.
    * 🟡 **Edição:** Card Amarelo.
    * 🔴 **Exclusão:** Card Vermelho.
* ✅ **Documentação Automática:** Swagger UI disponível para testar a API.
* ✅ **Pipeline CI/CD:** Testes de build e sintaxe automatizados via GitHub Actions.

---

## 📦 Como Rodar o Projeto

### Pré-requisitos
* [Docker](https://www.docker.com/) instalado e rodando.
* [Git](https://git-scm.com/) instalado.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/FlashDesk-MERN-Docker-Redis-Teams.git](https://github.com/SEU_USUARIO/FlashDesk-MERN-Docker-Redis-Teams.git)
    cd FlashDesk-MERN-Docker-Redis-Teams
    ```

2.  **Suba os containers com Docker Compose:**
    ```bash
    docker compose up --build
    ```
    *Aguarde até ver a mensagem "✅ Redis Subscriber Conectado" nos logs.*

3.  **Acesse a Aplicação:**
    * **Frontend (Interface):** [http://localhost:3000](http://localhost:3000)
    * **Swagger (API Docs):** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## 🧪 Como Testar

### 1. Teste de Integração (Script Automatizado)
O projeto inclui um script simples para validar a conexão com a API. Em um novo terminal, rode:
```bash
node test_script.js

## **🧪 2. Teste Manual (Fluxo Completo)**

1. Abra o **Frontend** em:  
   👉 `http://localhost:3000`

2. Cadastre um novo chamado  
   → 🔵 Verifique o **Card Azul** no Microsoft Teams

3. Clique em **Editar** no chamado  
   → 🟡 Verifique o **Card Amarelo** no Microsoft Teams

4. Clique em **Excluir** no chamado  
   → 🔴 Verifique o **Card Vermelho** no Microsoft Teams

---

## 📂 **Estrutura de Pastas**

```text
FlashDesk/
├── frontend/               # Aplicação React (Interface)
├── ticket-service/         # API CRUD (Produtor de eventos)
│   ├── models/             # Schemas do MongoDB
│   └── server.js           # Lógica do servidor e Swagger
├── notification-service/   # Worker (Consumidor de eventos)
│   └── server.js           # Lógica de envio para o Teams
├── .github/workflows/      # Pipeline de CI/CD (GitHub Actions)
├── docker-compose.yml      # Orquestração dos containers
├── test_script.js          # Script de teste de integração
└── README.md               # Documentação do projeto


## 📄 **Licença**

Este projeto está sob a licença MIT.
Consulte o arquivo LICENSE para mais detalhes.
