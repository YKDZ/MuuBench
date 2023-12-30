---
description: 一个 Spigot 插件的文档，这个插件主要关于 QQ 机器人和 Lands 插件。
tags:
  - Spigot
  - QQ 机器人
  - Lands
sidebar_position: 3
---

# 插件使用

## 机器人命令

LandsQQBot 插件可以解析 QQ 机器人收到的群聊或好友消息。

假如收到的消息是一条命令，那么插件就会将这条命令翻译并执行，再将对应的结果发送回对应群聊或好友。

本插件的命令格式是可以配置的，主要由语言文件中的以下部分定义：

```yml title="zh-CN.yml"
args:
  land: "城镇"
  area: "子区域"
  ally: "盟友"
  nation: "国家"
  player: "玩家"
  owner: "主人"
  role: "职位"
  flag: "设置"
  action: "操作"
  value: "设置值"
  amount: "数量"
  member-type: "成员类型"

command-prefix:
  - "$"
  - "/"
  - "￥"
  - "@Lands "

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
    print-inbox: "查询日志箱"
  friend:
    set-land-name: "设置名称"
    set-player-role: "设置他的职位"
  group:
    vote-party: "投票派对"
```

对于以上默认配置来说，以下信息文本都是正确的命令格式：

```
$城镇：mytown，操作：查询基本信息
/城镇：mytown，操作：查询金库余额
￥城镇：mytown，操作：查询所有成员
￥城镇：mytown，子区域：hotel，操作：查询基本信息
￥城镇=mytown，子区域：hotel，操作：查询基本信息
￥城镇=mytown 子区域-hotel 操作：查询基本信息
```

当然，你也可以通过简单地编辑配置文件来将格式修改为类似 MC 的 / 命令模式：

```yml title="zh-CN.yml"
args:
  land: "land"
  area: "area"
  ally: "ally"
  nation: "nation"
  player: "player"
  owner: "owner"
  role: "role"
  flag: "flag"
  action: "action"
  value: "value"
  amount: "amount"
  member-type: "member-type"

command-prefix:
  - "/"

args-separators:
  - " "

key-value-separators:
  - ":"
```

修改之后，如下写法将成为一条可用命令：

```txt
/action:查询基本信息 land:YKDZ
```

对于各种操作的作用域、参数列表等，详见以下页面：

## 提示信息

除了解析和执行你发出的命令，机器人还可以在某些事件发生时向玩家发送提示信息。

想要收到玩家的提示信息，首先需要在游戏内绑定自己的 QQ 账号。MiraiMC 内置了管理员命令：

```txt
/miraimc bind add <玩家名> <QQ 号>
```

来将玩家名称与 QQ 号进行简单地绑定（没有验证过程）。如果你需要让玩家只能绑定自己的 QQ 号，请不要给玩家这条命令的使用权，而是自己制作验证系统。

对于各种事件和哪些人会收到提示信息，详见以下界面：