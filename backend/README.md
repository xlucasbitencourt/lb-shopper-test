# Backend projeto transporte particular

## Descrição

A aplicação está programada para rodar na porta 8080
localhost:8080

Será necessário o arquivo .env com as seguinte chave:
- GOOGLE_API_KEY

Essa chave é necessária para a utilização da api do Google Maps
Deve ser colocado na pasta backend (a mesma onde encontra-se esse README), ou na raiz do projeto caso use a aplicação com Docker.

As chaves abaixo são opicionais, e só serão usadas caso não rode a aplicação com Docker:

- DB_USER
- DB_PASSWORD
- B_NAME
- DB_HOST

Deixar um ou mais campos em branco fara a aplicação usar os valores default.
Caso queira mudar as variáveis utilizando Docker, será necessário modificar o arquivo docker-compose.yml