# config_to_sub

免费在 Cloudflare Workers / Papes 中，搭建一个节点订阅网站，提取 [ChromeGo/EdgeGo](ChromeGo/EdgeGo) 订阅链接的代理节点，转换为 vless、vmess、ss、hysteria、hy2、tuic、naiveproxy 分享链接，提供给 NekoBox、v2rayN 等代理软件使用。

### 一、搭建教程

- Cloudflare Workers

将 `_worker.js` 的代码复制到您的 `cloudflare worker` 应用程序中，替换掉原来的 `worker.js` 代码，部署。

- Cloudflare Pages

将`_worker.js`的代码下载到本地电脑，文件名称要一样，不能修改，然后在文件外面套一层文件夹，也就是将 `_worker.js` 下载到一个空文件夹中，然后使用 git 工具，在这个文件夹的目录中执行 `git init` 命令，最后将这个文件夹以zip格式压缩，或者直接以文件夹的形式上传到 `Cloudflare Pages` 中，完成部署。

### 二、遇到问题

#### 1、出现 1102 页面错误

遇到1102错误，可以稍等一下（大概等几分钟到十多分钟，最长也就是几十分钟），再次访问应该能解决。

<img src="images\错误1102.png" />

#### 2、出现 FortiGuard Intrusion Prevention - Access Blocked 页面错误

如果绑定了自己的域名，而且使用代理访问，代理的IP地址又不干净的情况下，可能遇到下图的页面错误。

解决方法：更换其它干净的代理或不使用代理访问。

<img src="images\FortiGuard Intrusion Prevention - Access Blocked.png" />

#### 3、出现 Error: Too many subrequests 错误

原因是 `_worker.js` 中第 3105 行 `targetUrls` 的链接太多了，尽可能减少链接的数量（控制30条左右），重点剔除内容相同的链接。

#### 4、获取到的节点太少

在剔除重复节点的情况下，获取到的节点数 **少于** 配置文件中的**实际节点数**，原因：
- 1、被 Cloudflare 屏蔽了，特别是 `trojan` 的节点根本没有，在本地电脑开发测试中，能获取 `trojan` 的节点，部署到 Cloudflare 中，可以能是 `trojan` （木马）这个单词的含义而被屏蔽。
- 2、出现没有检查到的代码 bug ，导致配置文件转换为分享的链接失败，亦或者不支持这个节点转换为分享链接。
- 3、 因为`_worker.js` 第 3105 行 `targetUrls` 的链接太多了，出现 `Error: Too many subrequests` 错误，只处理到没有报 `Error: Too many subrequests` 错误之前的代理节点，导致获取到节点太少。