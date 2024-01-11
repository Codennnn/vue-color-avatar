<div align="center">
  <h1>Vue Color Avatar</h1>

  <p>🧑‍🦱 A playful avatar generator 🧑‍🦳</p>

[简体中文](./README-CN.md)

</div>

<a href="https://vue-color-avatar.leoku.dev">
  <img src="./images/social-preview-1.png" alt="website-cover" />
</a>

## Preview

[`https://vue-color-avatar.leoku.dev`](https://vue-color-avatar.leoku.dev)

## Introduction

**This is a vector style avatar generator, you can match different material components to generate your own personalized avatar.**

Features you might be interested in:

- Visual component configuration bar
- Randomly generate an avatar
- Redo/Undo
- i18n
- Generate multiple avatars in batch

## Assets

> **Note**  
> The avatar assets implementation of [Avatar Illustration System](https://www.figma.com/community/file/829741575478342595) by Micah Lanier. And the licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Develop

This project is built with `Vue3` + `Vite`.

```sh
# 1. Clone project
git clone https://github.com/Codennnn/vue-color-avatar.git

# 2. Install dependencies
yarn install

# 3. Run
yarn dev
```

## Docker deploy

You can directly run using the image I have already built.

```sh
docker run -d -t -p 5173:8080 \
--name=vue-color-avatar \
--restart=always \
docker.io/wenyang0/vue-color-avatar:latest

```

Or, you can manually compile it yourself if you prefer.

```sh
#clone the code
git clone https://github.com/Codennnn/vue-color-avatar.git

#docker build
cd vue-color-avatar/
docker build -t vue-color-avatar:v1 .

#start server
docker run -d -t -p 5173:8080 --name vue-color-avatar --restart=always vue-color-avatar:v1
```

Finally, open your browser and access the service's address at http://serverIP:5173.

### Deployed on Zeabur

Our project is powered by [Zeabur](https://zeabur.com?referralCode=Codennnn&utm_source=Codennnn). Their high-quality server services ensure the stable operation of our project. Need quality server services? Check them out via the link!

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com?referralCode=Codennnn&utm_source=Codennnn)
