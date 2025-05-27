[![Test](https://github.com/anabrag/desafio-ntt-data/actions/workflows/ci.yaml/badge.svg)](https://github.com/anabrag/desafio-ntt-data/actions/workflows/ci.yaml)
# Desafio NTT Data: Video playlist

![Screenshot do sistema](./imgs/screenshot.png "Screenshot")


Foi desenvolvido neste monorepo uma api utilizando nodejs, express e mongoose para conexão com banco de dados. Para o frontend uma aplicação react, utilizando a biblioteca gráfica React Suite. Os testes foram criados utilizando Jest e também foi utilizada a API TMDB para alimentar os dados do sistema.
A arquitetura da aplicação foi pensada na simplificadade para cumprir os objetivos do desafio no prazo definido. Abaixo segue um pequeno exemplo da arquitetura da aplicação

# Arquitetura

```mermaid
flowchart TD
  subgraph Frontend[Frontend React and React Suite]
    FE[Interface Web do Usuário]
  end

  subgraph Backend[Backend Node.js and Express]
    API[API REST]
    S1[Playlist Service]
    S2[Movie Service]
    S3[TMDB Service]
  end

  subgraph Database[MongoDB]
    DB[(MongoDB)]
  end

  subgraph External[Serviço Externo]
    TMDB[(TMDB API)]
  end

  FE -->|Requisições HTTP| API
  API -->|Gerencia Playlists| S1
  API -->|Gerencia Filmes| S2
  API -->|Busca Dados TMDB| S3
  S1 -->|Playlists/Refs de Filmes| DB
  S2 -->|Dados de Filmes| DB
  S3 -->|Salva Filmes| DB
  S3 -->|Busca Filmes/Trailers| TMDB
```

# Como rodar o projeto

## NodeJS Local + Docker para Database

```bash
make run_backend
make run_frontend
```


## Docker para Backend e Database

```bash
make run_docker
```