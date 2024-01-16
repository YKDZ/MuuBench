---
description: 一篇关于如何搭建 Docusaurus 的教程。使用了 Git 工具与 Nginx 中端等。
tags:
  - Linux
  - Web
---

# 使用 Docusaurus + Git 优雅地搭建自己的文档和博客站点

一篇关于如何搭建 Docusaurus 的教程。使用了 Git 工具与 Nginx 中端等。

本站点实际上就以这种方法搭建。

## 前言

Docusaurus 是一个现代且高效的静态网页生成器，专注于文档和博客的生成。它由 Facebook（现名 Meta）开源和维护。使用 Docusaurus，站长可以不必过于关注站点的外观，而专注于内容的撰写。不论是发布产品文档、维护 Minecraft 服务器维基，还是编写个人博客，Docusaurus 都可以为我们节省很多时间，同时其简约大气的外观风格也十分贴合现代网站设计审美。

Docusaurus 基于 Nodejs 与 React 构建，编写文本内容支持 Markdown 与 MDX。所有内容 100% 可自定义，且支持自动目录生成、多目录、版本分离、中文搜索、翻译和多实例等大量附加功能，同时内置 SEO 优化策略与开箱即用的 PWA 实现，Google Lighthouse 评分可以达到全站 90+ 的水准。

在本文中，我们将在一个使用 Centos 8 Stream 的云服务器中配置 Docusaurus 的运行环境并部署 Docusaurus 服务本体。之后，我们将使用 Nginx 将我们的站点绑定到特定的子域名。最后，我们将使用 Git 工具 + GitHub 储存库管理站点，以达到文档和博客的“本地编辑、实时预览、多端同步、快速更新”的效果。

笔者用到的部分软件环境：

- SSH 工具：Xshell 7 家庭版
- FTP 工具：Xftp 7 家庭版
- 本地文本编辑器：Visual Studio Code
- 本地电脑系统：Windows 11
- 云服务器使用的系统：Centos 8 Stream Server
- 云服务器使用的中端服务器：Nginx

## 正文

### 零 环境准备

显然，我们需要购买一台云服务器与一个域名，并完成域名的 ICP 备案与公安局备案，才能自己的 Docusaurus 站点对外提供服务。

首先，对于购买云服务器，你可以选择阿里云、腾讯云等大服务商，它们可以为你提供包括购买云服务器、购买域名、DNS 解析与域名备案在内的一条龙服务。本站点实际上就运行在一台阿里云的**经济型 e 实例**服务器上（年租 99 元），配置如下：

- 2 核 (vCPU)
- 2 GiB
- 3Mbps

同时，为了让你的站点更像样，你显然也需要一个解析到你站点云服务器 IP 地址的域名。本站点的域名 **muubench.cn** 也是在阿里云购买（域名年租 33 元）。

最后，为了在中国境内提供服务，你还需要对你的域名进行实名认证并备案。本站点的备案过程整理在 [这篇博客](/blog/2023/12/19/about-icp) 中，你可以参考其中的流程提前进行准备（注意备案流程随着你的备案地点变化而变化，本域名在广东备案）。

### 一 进入控制台

首先，使用 SSH 工具连接到云服务器的控制台：

![Xshell 界面](./img/set-up-docusaurus-with-git/xshell_interface.png)

（对于大部分云服务器，我们都可以直接用 root 用户进行登录，自然也不用手动获取 root 权限了）

:::info

SSH 全名 Secure Shell，是一种加密的客户端 - 服务器间连接和数据传输协议，常用于远程连接云服务器等需要保证安全性的场景中。支持密码、密钥和双因素等多种认证方式。

下文的 SFTP 就是 SSH 协议的一个子协议，利用 SSH 的传输层协议提供文件访问、传输和管理的功能。

:::

之后，使用 SFTP 工具连接到云服务器，方便之后进行文件的编辑：

![Xftp 界面](./img/set-up-docusaurus-with-git/xftp_interface.png)

别忘了在 Xftp 设置中配置双击动作和本地文本编辑器，否则双击文件默认仅下载到本地，且文本默认用记事本打开（设置位于**工具 - 选项**中）：

![Xftp 设置](img/set-up-docusaurus-with-git/xftp_click_setting.png)
![Xftp 设置](img/set-up-docusaurus-with-git/xftp_editor_setting.png)

### 二 配置云服务器环境

Docusaurus 实际上是依赖于 Node.js 环境运行的一组 npm 软件包，所以我们需要先安装它们两者。

在控制台执行以下命令，安装 NodeSource 包（Docusaurus 需要 Node.js 18 才能正常运行，NodeSource 用于快速安装对应版本的 Nodejs）：

```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
```

之后等待一段时间（一开始需要等待 60 秒）。

安装完成后，使用以下命令安装 Node.js 和 npm：

```bash
yum install -y nodejs npm
```

之后，使用以下命令测试安装结果：

```bash
node -v
npm -v
```

若能看到版本号输出，则代表安装顺利完成。

若出现问题，请复制安装过程中的报错信息并在搜索引擎中寻找解决方案，抑或是询问 ChatGPT。

:::info

Node.js 是一个跨平台的 JavaScript 运行时环境，用于在浏览器外运行 JavaScript 代码。

在本例的语境下，Node.js 实际上在服务端工作。使用 Node.js 替代传统的 PHP 后端可以保证开发的一致性（站点前端与后端使用同一种语编写）。

:::

### 三 部署 Docusaurus

接着，我们要在自己的网站根目录中部署 Docusaurus 服务。

首先，使用以下命令创建并转到自己的网站根目录（本教程为 /var/www）:

```bash
mkdir /var/www
cd /var/www
```

接着，运行以下安装命令：

```bash
npx create-docusaurus@latest 你的站点名 classic
```

其中「你的站点名」可以替换为某个英文字符串（本文为 docusaurus）。

（安装过程中可能需要输入 y 表示同意安装）

安装完成后，网站根目录下应该出现了一个新的文件夹，名称为你刚刚设定的站点名：

![docusaurus 文件夹](./img/set-up-docusaurus-with-git/docusaurus_file.png)

其中包含 Docusaurus 的项目文件：

![文件夹内容](./img/set-up-docusaurus-with-git/docusaurus_file_content.png)

至此，Docusaurus 的部署实际上已经完成了。

之后，我们可以进入根目录，并通过以下命令，让 Docusaurus 帮我们生成站点的静态网页文件：

```bash
cd /var/www/docusaurus/
npm run build
```

生成完成后，我们可以看到以下文件夹，即为静态站点的根目录：

![build 文件夹](./img/set-up-docusaurus-with-git/docusaurus_file_build.png)

### 四 Nginx 配置

接下来，我们需要使用 Nginx 将站点绑定到域名。

首先，我们可以通过以下命令安装 Nginx：

```bash
yum install nginx
```

安装完成后，将其启动并添加到开机自启动行列：

```bash
systemctl start nginx
systemctl enable nginx
```

接着，进入 Nginx 配置文件根目录：

![Nginx 根目录](./img/set-up-docusaurus-with-git/nginx_file.png)

接着，在 conf.d 目录下新建一个站点配置文件：

![此处名为 docusaurus.conf](./img/set-up-docusaurus-with-git/nginx_config.png)

之后，在文件中添加以下内容，其中 SSL 证书相关文件的路径改为你自己的存放路径，域名 muubench.cn 改为你自己的域名：

```nginx title="/conf.d/docusaurus.conf"
# 将来自 80 端口的请求重定向到 443
server {
    listen 80;
    server_name muubench.cn; # 你的站点域名
    # 返回一个原链接的 301 重定向
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name muubench.cn; # 你的站点域名

    # SSL 证书相关配置
    # 将其中的证书路径改为你自己的存放路径
    ssl_certificate /etc/nginx/ssl/muubench.cn/muubench.cn.pem; # 腾讯云 SSL 证书为 .crt 文件
    ssl_certificate_key /etc/nginx/ssl/muubench.cn/muubench.cn.key; 
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # 为站点开启自动 gzip 压缩
    # 如果不需要，可以全部删除
    gzip on;
    # 自动压缩的文件类型
    gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_min_length 1000;
    gzip_comp_level 4;
    gzip_vary on;
    gzip_proxied any;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";
    
    location / {
        # 修改为你站点 build 目录所在的路径
        root /var/www/muubench/build;
        index index.html;
    }
}
```

（如果获取 SSL 证书有困难，这里还有一份不使用 https 连接的配置：）

```nginx title="/conf.d/docusaurus.conf"
# http 站点配置
server {
    listen 80;
    server_name mubench.cn; # 你的站点域名

    location / {
        root /var/www/docusaurus/build; # 你的站点 build 目录位置
        index index.html index.htm index.php;
    }
}
```

:::info

HTTPS 是在 HTTP 协议的基础上使用 SSL/TLS 对传输内容进行加密的协议。主要用于确保客户收到的网站信息没有被恶意篡改。现代的浏览器基本都会对不支持 HTTPS 连接的网站进行限制（提示用户此网站不安全等）。

在 HTTPS 协议的握手过程中，服务端通过 SSL/TLS 对数据进行非对称加密。客户端收到公钥后，首先验证公钥中储存的 SSL 证书信息的真实性，之后用收到的公钥对密钥进行加密。之后，客户端将加密的密钥发回服务器。服务器将用自己的私钥对这个密钥进行解密。这样，客户端和服务端就在保证安全的情况下获得了一对相同的密钥，用于对之后交换的数据进行加密和解密。

:::

之后，保存文件，并使用以下命令重载 Nginx 服务：

```bash
systemctl restart nginx
```

别忘了赋予 build 目录访问权限：

![右键 build 目录找到更改权限选项](./img/set-up-docusaurus-with-git/build_file_permission.png)

:::info

Nginx 是一个轻量的 Web 服务器，在本例中的用途为将生成好的静态网页文件发送回请求它的客户端浏览器。当然，Nginx 也可以用于执行 PHP 脚本并返回动态的网页内容。

与同类的 Apache 相比，Nginx 更轻量且配置文件格式更简单。

:::

之后，前往域名的 DNS 控制台，使用一个 A 记录将域名（子域名）解析到你云服务器的 IP 地址。

最后，前往云服务器安全组控制台，放通 80 与 443 端口的入站流量（如果你的云服务器上还有内置的防火墙服务，如 firewalld 与 iptables 等，也需要在其中放通所需的所有端口）。

这时，你的站点应该已经可以使用域名正常访问了：

![https 连接也正常运行](./img/set-up-docusaurus-with-git/https_work_well.png)

:::info

DNS 解析是域名系统（Domain Name System）的一个过程，本质上是获取域名绑定的的 IP 地址的过程。

当用户输入一个域名时，**本地 DNS 服务器**首先查询是否缓存过此域名对应的 IP 地址。若没有缓存，则开始向**根域名服务器**发送查询请求，获取该域名顶级域的 DNS 服务器地址。之后，**本地 DNS 服务器**再向**顶级域 DNS 服务器**发送查询请求，获取该域名对应的 **DNS 服务商服务器**地址。最后，**本地 DNS 服务器**再向此 **DNS 服务商服务器**发送查询请求，获取该域名对应的 IP 地址并缓存到本地以备使用。

作为域名所有者，我们可以通过添加**域名解析记录**控制域名（子域名）解析到的 IP 地址。最常用的记录类型是 A 记录。

:::

### 五 Git + GitHub 文档管理

在本例中，我们使用 Git 来将 Docusaurus 项目托管在 GitHub 储存库中，方便我们在本地对站点进行编辑与测试。这可以避免直接修改云服务器上的站点文件，更加安全且高效，还可以充分利用 Docusaurus 自带的支持实时更新的网页应用进行测试。

:::info

Git 是一种版本控制系统，可以基于目录建立本地仓库，自动跟踪和记录文件的变化并储存编写完成的文件。GitHub 则是一个基于 Git 的代码托管平台，提供了存储、管理和协作开发项目的功能。

:::

首先，前往 GitHub 新建一个储存仓库：

![新建储存库](./img/set-up-docusaurus-with-git/github_create_repo.png)
![给储存仓库起一个好名字并选一个合适的的开源协议](./img/set-up-docusaurus-with-git/github_set_up_repo.png)

之后，回到控制台，使用以下命令安装 Git 工具：

```bash
yum install git
```

接着，使用以下命令初始化 Git 用户：

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

（用于表示使用者的身份，不一定要与 GitHub 用户名和邮箱相同，但是推荐统一）

之后，回到 Docusaurus 根目录下初始化一个 本地 Git 仓库：

```bash
cd /var/www/docusaurus
git init
git config --global init.defaultBranch main
git branch -m main
```

（此处指定默认分支为 main 属于个人习惯，若不修改则默认分支是 master）

之后，使用以下命令将文件添加并提交到本地仓库：

```bash
git add .
git commit -m "初始提交"
```

接着，需要在服务器中配置 SSH 连接密钥并添加到 GitHub 中，从而使我们可以将服务器中的本地仓库内容推送到 GitHub 的仓库中。

首先，使用以下命令新建一个 SSH 密钥对：

```bash
ssh-keygen -t rsa
```

此命令在运行后会向用户请求三个参数，分别是密钥对的储存路径和密钥的密码。本教程采用的值如下：

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): /root/.ssh/docusaurus
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

即将密钥对储存在目录 /root/.ssh/ 目录下，密钥 ID 为 docusaurus，且不额外设置密码（直接按回车）。

之后，前往密钥的储存路径，打开公钥文件（.ssh 目录是一个隐藏目录，可能需要在 Xftp 设置中开启显示隐藏的文件才能看见）：

![.pub 为公钥文件](./img/set-up-docusaurus-with-git/ssh_key_file.png)

别忘了将公钥文件的权限降低：

![保证公钥安全](./img/set-up-docusaurus-with-git/keep_ssh_key_safe.png)

接着，复制文件中的内容并粘贴到 GitHub SSH 密钥配置中：

![点击头像](./img/set-up-docusaurus-with-git/github_click_avatar.png)
![进入设置](./img/set-up-docusaurus-with-git/github_ender_settings.png)
![新建 SSH 密钥](./img/set-up-docusaurus-with-git/github_create_ssh_key.png)
![给密钥起个名字并粘贴公钥内容](./img/set-up-docusaurus-with-git/github_set_up_public_key.png)

之后，回到控制台，启用 SSH 代理并添加私钥：

```bash
eval "$(ssh-agent -s)"
ssh-add /root/.ssh/docusaurus
```

接着，我们就可以配置本地 Git 仓库的远程仓库并将初始提交推送到 GitHub 了。

首先，前往 GitHub 复制远程仓库的 SSH 连接地址：

![复制连接地址](./img/set-up-docusaurus-with-git/github_copy_ssh_link.png)

接着，使用以下命令设置远程仓库：

```bash
git remote add origin 你的 GitHub 仓库的 SSH 远程连接地址
```

之后，使用以下命令合并一次远程仓库的内容以防止冲突：

```bash
git config pull.rebase true
git pull origin main
```

最后，使用以下命令将本地仓库的内容推送到远程仓库：

```bash
git push origin main
```

现在，你应该可以在 GitHub 仓库中看到 Docusaurus 站点的内容了：

![提交名称就是一开始设置的初始提交](./img/set-up-docusaurus-with-git/github_commit_name.png)

现在，我们需要在本地拉取这个仓库，这样，我们就可以在自己的主机上编辑站点的文档内容，并且使用 Docusaurus 自带的预览工具在本地预览修改后的效果，并且由 GitHub 仓库做中转站，将修改后的内容同步到服务器主机上。

首先，在电脑中安装 Git 工具。前往 Git 官网下载安装包：

![此为 Windows 系统适用的版本](./img/set-up-docusaurus-with-git/windows_download_git.png)

并跟随提示安装 Git 工具：

![安装中](./img/set-up-docusaurus-with-git/windows_install_git.png)

安装完毕后，打开 Git Bash 控制台：

![控制台内容](./img/set-up-docusaurus-with-git/windows_git_bash_content.png)

并在其中使用以下命令克隆远程仓库：

```bash
cd d:
git clone 你的 GitHub 仓库的 SSH 远程连接地址
```

（cd 前往的目录是储存远程仓库内容的目录，这里直接放到 D 盘下）

（克隆远程仓库时可能需要为本地的新 SSH 密钥指定一个密码，跟随指引操作即可）

克隆完成后，你应该可以在指定目录下看到仓库中的内容了：

![文件夹名就是 GitHub 仓库的名称](./img/set-up-docusaurus-with-git/windows_docusaurus_file.png)

为了更方便地管理站点内容，我们使用 VSCode 打开这个目录：

![右键目录文件夹](./img/set-up-docusaurus-with-git/windows_right_click_docusaurus.png)

并尝试修改站点的显示内容：

![这里我翻译了默认文档内的一句话](./img/set-up-docusaurus-with-git/vscode_translate_sentence.png)

同时，因为我的 VSCode 插件 Local History 在目录内产生了备份文件，所以我还修改了 .gitignore 文件的内容，让备份文件不被同步到仓库中（因为没必要）：

![备份文件夹 .history](./img/set-up-docusaurus-with-git/vscode_local_history_gitignore.png)

若想要在本地测试修改的结果是否可以正常被解析或修改的效果是否令人满意，我们可以在本地启动测试服务器。

首先，我们需要在自己的主机中安装 Node.js 运行时环境。

前往 [Node.js 官网](https://nodejs.org/en/download/) 下载所需版本的下载器，跟随指示安装即可。

![选择所需的 Node.js 版本](./img/set-up-docusaurus-with-git/windows_download_nodejs.png)

安装完成后，重新打开 VSCode 以应用新的环境。

在本地的仓库文件夹中右键单击空白的位置，并用点击用终端打开：

![其实就是替代 cd 的作用](./img/set-up-docusaurus-with-git/windows_file_cd_shell.png)

在打开的命令行中输入以下命令：

```bash
npm install
npm run start
```

这实际上在本地初始化并运行了 Docusaurus 自带的测试服务器。

执行完成后，浏览器应该被自动打开了，刚刚进行的修改也被应用了：

![IP 是代表本地的 localhost](./img/set-up-docusaurus-with-git/windows_localhost_test.png)

值得一提的是，这个本地网站是实时更新的，这意味着你的所有修改都可以直接反映在网站中，而不需要重新执行命令，比如修改主页内容：

![翻译主页面上的一句话](./img/set-up-docusaurus-with-git/vscode_translate_word_in_index.png)

更改便直接反映在了本地站点中：

![刚刚翻译的内容](./img/set-up-docusaurus-with-git/windows_translate_content.png)

善用这个功能，可以方便且高效地自定义自己的文档站点。这也是我们费劲折腾 Git 来将站点同步到本地的主要原因。

所有对站点文件的修改完成且测试完毕后，便可以进入 VSCode 版本管理工具栏内并提交这些更改到本地仓库：

![给这次提交起个名字](./img/set-up-docusaurus-with-git/vscode_name_commit.png)

提交完成后，同步更改到远程仓库：

![可能会向你请求刚刚设置的本地密钥密码](./img/set-up-docusaurus-with-git/vscode_push_remote.png)

同步完成后，你应该可以在 Github 仓库看到刚刚的提交了：

![刚刚设置的提交名称](./img/set-up-docusaurus-with-git/github_local_commit_name.png)

同时远程仓库的文件内容当然也有所改变：

![刚刚翻译的中文](./img/set-up-docusaurus-with-git/github_local_translate_sentence.png)

之后，我们可以回到服务器控制台，将刚刚的更改拉取到云服务器并应用更改。

在服务器控制台执行以下命令：

```bash
git pull origin main
```

其作用为拉取远程仓库的更改到云服务器。

接着，重新运行生成静态网页的命令：

```bash
npm run build
```

生成完成后，你应该可以在你的云服务器站点中看到你进行的更改了：

![IP 是云服务器站点的域名](./img/set-up-docusaurus-with-git/windows_server_test.png)

现在，我们已经完成了一个完整的更改和同步的过程。想要在多个设备上同时修改文档站点的内容，只需要在多个设备上安装 Git 工具并照常克隆、拉取和提交仓库即可。

至此，本教程的目的已经完全达成了。

### 六 一些小优化

每次在云服务器上应用提交，都需要运行两个命令，这一步骤可以被脚本简化。

在本地仓库中新建一个脚本文件，并写入一段简单的 shell 脚本：

```bash title="update.sh"
#!/bin/bash

# 拉取远程仓库的最新内容到本地的 main 分支
git fetch origin main

# 切换到本地的 main 分支
git checkout main

# 合并远程仓库的 main 分支到本地的 main 分支
git merge origin/main

# 执行 npm run build 命令
npm run build
```

接着，将这个脚本提交并推送到远程仓库：

![提交需要有名字](./img/set-up-docusaurus-with-git/vscode_commit_need_name.png)

并在云服务器上用命令拉取远程仓库的内容：

```bash
git pull origin main
```

之后，我们 就可以通过命令运行这个脚本来更新站点的内容了：

```bash
cd /var/www/docusaurus
bash update.sh
```

## 后记

本教程到此为止，至于版本控制、博客功能、SEO、网站搜索、Markdown 语法、React 自定义样式等等的其他内容，请访问 [官网文档](https://docusaurus.io/docs) 自行学习。

通过搭建这样一个简单的文档站点，我们可以学习到静态网页和 Nginx 的工作原理、Git 工具的使用和 SSH 密钥鉴权等等全方面的知识，就算没有实际需求的人，拥有搭建这样一个站点的经历应该也是不坏的。

若在安装过程中遇到了问题（肯定会遇到的吧），请先询问搜索引擎和 ChatGPT，没有找到答案或无法理解答案则欢迎发到评论区供大家讨论。

## 附录

### 常见的问题

1. 没有权限访问 GitHub 远程仓库：检查 GitHub 公钥的配置是否正确，以及控制台中是否开启了 SSH 代理。

2. 如何关闭本地的测试站点：在本地控制台中使用 Ctrl + C 快捷键。

3. 合并时发生了冲突：直接在远程仓库中编辑文件，抑或是编辑了云服务器站点内的文件并推送到远程仓库之后都有可能发生这个问题，问题的本质是文件的版本发生了混乱（若正常操作不应出现这种问题）。你需要手动处理这些冲突（编辑冲突的文件）：

```git
<<<<<<< HEAD
内容 A（当前分支的内容）
=======
内容 B（合并的另一分支内容）
>>>>>>> feature-branch
```

（冲突的文件内容会变成以上这样，手动修改文件内容并删除这些特殊标识符即可完成冲突处理）

之后使用以下命令将处理好的文件添加到本地仓库并提交到远程仓库：

```bash
git add 发生冲突的文件的地址
git commit
git push origin main
```
（当然也可以直接在 VSCode 图形界面内进行提交和推送）

接着再正常从远程仓库拉取更改即可。

### 实用链接

- **Docusaurus 官网**：[https://docusaurus.io/](https://docusaurus.io/)
