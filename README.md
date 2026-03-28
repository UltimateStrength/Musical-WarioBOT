# 🎵 Musical WarioBOT

> Bot de música para Discord feito em JavaScript com Node.js — toca músicas diretamente do YouTube no seu servidor!

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Hospedagem](#-hospedagem)
- [Créditos](#-créditos)

---

## 🤖 Sobre o Projeto

O **Musical WarioBOT** é um bot de música para servidores Discord que permite buscar e tocar músicas do YouTube diretamente nos canais de voz. Desenvolvido em JavaScript utilizando Node.js v16.

---

## 📦 Pré-requisitos

Antes de tudo, certifique-se de ter instalado:

- [Node.js v16](https://nodejs.org/en/blog/release/v16.0.0)
- [npm](https://www.npmjs.com/)
- Uma conta no [Google Cloud Console](https://console.cloud.google.com/) com a **YouTube Data API v3** habilitada

---

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/UltimateStrength/Musical-WarioBOT.git
   cd Musical-WarioBOT
   ```

2. Instale as dependências:
   ```bash
   npm install @discordjs/opus@0.5.3 discord.js@12.5.3 ffmpeg-static@4.3.0 googleapis@92.0.0 lib@4.3.3 ytdl-core@4.9.2
   ```

   | Pacote | Versão |
   |---|---|
   | `@discordjs/opus` | 0.5.3 |
   | `discord.js` | 12.5.3 |
   | `ffmpeg-static` | 4.3.0 |
   | `googleapis` | 92.0.0 |
   | `lib` | 4.3.3 |
   | `ytdl-core` | 4.9.2 |

   > ⚠️ **Atenção:** Sem essas bibliotecas, o bot não funcionará.

---

## ⚙️ Configuração

### 1. Token do Discord

- Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
- Crie uma nova aplicação e gere um **Bot Token**
- Adicione o token no arquivo `config.json`

### 2. Chave da API do YouTube

- Acesse o [Google Cloud Console](https://console.cloud.google.com/)
- Crie um projeto e ative a **YouTube Data API v3**
- Gere uma **API Key** e adicione no `config.json`

### 3. Exemplo de `config.json`

```json
{
  "token": "SEU_TOKEN_DO_DISCORD_AQUI",
  "youtubeApiKey": "SUA_CHAVE_DA_API_DO_YOUTUBE_AQUI",
  "prefix": "!"
}
```

---

## ▶️ Como Usar

Inicie o bot com:

```bash
node index.js
```

Depois, use os comandos no Discord (prefixo padrão: `!`):

| Comando | Descrição |
|---|---|
| `!play <nome ou URL>` | Toca uma música do YouTube |
| `!skip` | Pula para a próxima música |
| `!stop` | Para a música e desconecta o bot |
| `!queue` | Exibe a fila de músicas |

> 💡 Consulte o código em `index.js` para ver todos os comandos disponíveis.

---

## ☁️ Hospedagem

Para manter o bot online 24h por dia, você pode hospedá-lo em plataformas como:

- **[Railway](https://railway.app/)** — recomendado atualmente (Heroku encerrou o plano gratuito)
- **[Render](https://render.com/)**
- **[Fly.io](https://fly.io/)**

---

## 📚 Créditos

- Baseado na playlist de tutoriais: [YouTube Playlist](https://www.youtube.com/watch?v=a05WgeeNVOk&list=PLOZo9XFXVMXfSB4ivmxIO98BX8oEW1b1J)
- Desenvolvido por [UltimateStrength](https://github.com/UltimateStrength)

---

## Stay Determined! 💛
