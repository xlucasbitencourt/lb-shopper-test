# Projeto trasporte particular

## Descrição

Esse é um projeto fullstack que tem como objetivo simular um sistema de transporte particular, onde o usuário pode solicitar uma corrida e ver os motoristas disponíveis para realizar.

O projeto foi construído para rodar em Docker, e para isso é necessário ter o Docker e o Docker Compose instalados.

Para rodar o projeto, basta executar o comando `docker-compose up` na raiz do projeto.

O frontend estará disponível em `localhost:80` e o backend em `localhost:8080`.

É necessário criar um arquivo `.env` na raiz do projeto com as seguintes chaves:

- GOOGLE_API_KEY

Essa chave é utilizada no frontend e no backend para realizar a comunicação com a API do Google Maps.

Caso não queira utilizar Docker para rodar a aplicação, verifique dentro de cada pasta (frontend e backend) o arquivo `README.md` com as instruções para rodar a aplicação sem Docker.