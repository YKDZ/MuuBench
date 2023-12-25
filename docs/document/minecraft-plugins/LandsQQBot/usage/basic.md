---
description: 一个 Spigot 插件的文档，这个插件主要关于 QQ 机器人和 Lands 插件。
tags:
  - Spigot
  - QQ 机器人
  - Lands
position: 1
---

# 使用基础

LandsQQBot 插件可以解析 QQ 机器人账户收到的群聊或好友消息。

假如收到的消息是一条命令，那么插件就会将这条命令翻译并执行，再将对应的结果发送回对应群聊或好友。

本插件的命令格式是可以变化的，主要由语言文件中的以下部分定义：

```yml
args:
  land: "城镇"
  area: "子区域"
  nation: "国家"
  player: "玩家"
  owner: "主人"
  role: "职位"
  flag: "设置"
  action: "操作"
  value: "设置值"

command-beginner:
  - "$"
  - "/"
  - "￥"
  - "%(Lands)"

args-separators:
  - " "
  - "，"
  - ","
  - ";"

key-value-separators:
  - "："
  - ":"
  - "-"
  - "="

command-actions:
  global:
    print-basic-info: "查询基本信息"
    print-bal: "查询金库余额"
    print-members: "查询所有成员"
    print-bal-top: "查看城镇排行榜"
  friend:
    set-land-name: "设置名称"
    set-player-role: "设置他的职位"
  group:
    set-
```

对于以上默认配置来说，以下信息文本都是正确的命令格式：

```
$城镇：mytown，操作：查询基本信息
/城镇：mytown，操作：查询金库余额
￥城镇：mytown，操作：查询所有成员
￥城镇：mytown，子区域：hotel，操作：查询所有成员
￥城镇=mytown，子区域：hotel，操作：查询租客
```