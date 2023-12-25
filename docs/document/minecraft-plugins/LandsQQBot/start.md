---
description: 一个 Spigot 插件的文档，这个插件主要关于 QQ 机器人和 Lands 插件。
tags:
  - Spigot
  - QQ 机器人
  - Lands
position: 2
---

# 插件安装

## 下载插件

下载本插件的最新版本与前置插件 MiraiMC 的最新版本，并将它们一起放入服务器的 plugins 文件夹中，之后再重启服务器。

如果控制台中没有出现错误，那么插件的安装应该已经完成了。

## 配置 QQ 机器人账号

首先，你需要为自己服务器的 QQ 机器人注册一个 QQ 账号。

之后，将此 QQ 账号填入本插件的配置文件中：

```yml title="LandsQQBot/config.yml"
# 机器人相关的配置
bot:
  # 机器人使用的 QQ 账号
  account: 12345678
```

## 登录 QQ 机器人账号

接着，你需要在 MiraiMC 插件中登录自己的 QQ 机器人账号。

首先，在控制台中使用以下命令：

```txt
/mirai login <账号 ID> QRCode ANDROID_WATCH
```

这会在 `MiraiMC/qrcode-image/` 目录下生成一个二维码。使用你的手机或其他设备登录此 QQ 机器人账号，并扫描这个二维码进行登录授权。

登录完成后，控制台应该会显示登录成功的消息。

之后，在控制台使用以下命令将此账号设为自动登录：

```txt
/mirai autologin add <账号 ID> QRCode ANDROID_WATCH
```

这样，只要 MiraiMC 插件缓存的登录凭证没有过期，你的机器人账户就会在服务器重启后依然保持登录状态。