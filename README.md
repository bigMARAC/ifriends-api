# API IFriends 2.0
![Badge](https://img.shields.io/badge/MaracTech-IFriends-blueviolet)

## Instalação

Na raiz use, isso irá instalar todas as dependencias que estão no `package.json`:
```bash
npm install
```

## Configurações
Para criar o Banco use:
```bash
npx sequelize db:create
```
Para criar as Migrates use:
```bash
npx sequelize db:migrate
```
Não esqueça de criar um arquivo `db.js` em `src/config/` seguindo o exemplo de `db-example.js`

## Requisitos
- [Node](https://nodejs.org/en/download/)
- [MySQL](https://www.mysql.com/downloads/)

### Features

- [x] Cadastro de Aluno
- [x] Cadastro de Matérias
- [x] Vincular Matérias aos Alunos
- [x] Listar todos os alunos
- [x] Criar e Autenticar auth_token
