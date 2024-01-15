---
authors:
  - ykdz
tags:
  - Minecraft
  - Server
  - Development
  - Panel
  - MCSManager
  - Pterodactyl
---

# 服务器管理面板使用日记

## 起因

想要更方便地管理服务器，实现多人同时编辑一个服务器的效果。

## 选择面板

被广泛使用的面板有 [MCSManager](https://mcsm.imlazy.ink/) 和 [Pterodactyl](https://pterodactyl-io.webpkgcache.com/doc/-/s/pterodactyl.io/) 两个。决定在这两者之间选择。

### Pterodactyl

首先尝试的是 Pterodactyl。早在 2023 年 7 月时我就已经尝试部署和使用过这个面板，所以部署过程很顺利。

它由前端页面和守护进程两部分组成。守护进程负责在对应主机中创建和管理 Docker 容器。一个前端可以连接多个守护进程（分布式工作）。

它的特点是默认以 Docker 容器模式管理服务器。很多 Docker 容器相关的配置项目都可以通过面板方便地管理。

它可以拉取名为 Egg 的预制 Docker Image 快速地部署服务器，感觉很适合用来出售面板服集群。但是对于我的需求来说属于多余功能。

它不能优雅地实现多个服务器使用同一个数据库的功能，但可以通过远程连接的方法解决（MySQL 绑定的 0.0.0.0，服务器内部使用 docker0 网桥连接）。

它主要的问题在于不支持 SSH 终端连接，只能使用自带的 SSH RCON 进行命令执行。这也意味着它不能支持 TAB 补全这类重要功能。故开始尝试使用 MCSManager。

### MCSManager