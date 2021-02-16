# API IFriends 2.0
![Badge](https://img.shields.io/badge/MaracTech-IFriends-blueviolet)
![Badge](https://img.shields.io/badge/license-MIT-brightgreen)

## Aplicação principal

### [IFriends](https://github.com/bigMARAC/IFriends)

## Instalação

Na raiz use, isso irá instalar todas as dependencias que estão no `package.json`:
```bash
npm install
```

## Configurações
Para criar o Banco, use:
```bash
npx sequelize db:create
```
Para criar as Migrates, use:
```bash
npx sequelize db:migrate
```
Não esqueça de criar um arquivo `db.js` em `src/config/` seguindo o exemplo de `db-example.js`

Não esqueça de criar um arquivo `token.js` em `src/config/` seguindo o exemplo de `token-example.js`

## Inicialização
Para inicializar o projeto, use:
```bash
npm run serve
```

## Requisitos
- [Node](https://nodejs.org/en/download/)
- [MySQL](https://www.mysql.com/downloads/)

### Features

- [x] CRUD de Alunos
- [x] CRUD de Matérias
- [x] Match Flux
- [x] JSON Web Token

### To-Do
- [ ] Atualizar Foto de Perfil
- [ ] Atualizar Senha
- [ ] Chat

## Autor

| [<img src="https://avatars.githubusercontent.com/u/45175801?s=460&u=1d462ca5f421c1b58c4cd3b5765150da2e441038&v=4" width=115><br><sub>@bigmarac</sub>](https://github.com/bigMARAC) |
| :---: |