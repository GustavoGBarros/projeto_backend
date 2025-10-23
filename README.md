# Portfólio Acadêmico Web

Um site para alunos de Engenharia de Software mostrarem seus projetos e habilidades. Usa Node.js (com EJS), MongoDB e PostgreSQL.

## O Que Precisa Ter Instalado:

* Node.js e npm
* Git
* Servidor MongoDB (a rodar)
* Servidor PostgreSQL (a rodar)

## Como Rodar (Passo a Passo):

1.  **Obter o Código:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/portifolio-academico.git](https://github.com/SEU_USUARIO/portifolio-academico.git)
    cd portifolio-academico
    ```

2.  **Ir para o Back-end:**
    ```bash
    cd backend
    ```

3.  **Instalar Dependências:**
    ```bash
    npm install
    ```

4.  **Configurar Bases de Dados:**
    * **PostgreSQL:** Crie uma base de dados chamada `portfolio_db`.
    * **Ficheiro `.env`:** Copie o `.env.example` para `.env` (na pasta `backend`). Edite o `.env` e preencha:
        * `MONGO_URI` (ex: `mongodb://localhost:27017/portfolio_academico`)
        * `PG_PASSWORD` (a sua senha do PostgreSQL para o utilizador `postgres`)
        * `JWT_SECRET` (uma linha de numeros aleatorios)

5.  **Iniciar o Servidor:**
    ```bash
    npm run dev
    ```
    *(Espere pelas mensagens "conectado com sucesso" e "Servidor rodando...")*

6.  **Acessar ao Site:**
    Abra o navegador em: **`http://localhost:5000`**
