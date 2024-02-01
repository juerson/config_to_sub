# config_to_sub

【Cloudflare Workers】在线提取ChromeGo/EdgeGo里面的代理节点，然后转换成vless、vmess、ss、hysteria、hy2、tuic、naiveproxy链接，也可以作为订阅地址使用。

### 一、使用方法：

将根目录中的`worker.js`代码复制到`Cloudflare Workers`中部署；`wrangler_raw_code/worker.js`为开发中写的源码，直接复制到Cloudflare Workers中无法使用的。

### 二、出现的问题：

#### 1、有一定几率出现 1102 错误

worker.js代码部署后，频繁访问`*.*.workers.dev`或访问您的域名链接时，可能会遇到如图的错误：

<img src="images\错误1102.png" />

遇到1102错误，隔一段时间再回来访问（大概几分钟到十多分钟，最长也就是几十分钟；这个间隔时间，等得起，订阅链接也不用频繁更新，一次获取后，可以用很久）；具体原因不太清楚，个人猜测频繁请求url太多（访问`*.*.workers.dev`或你的域名链接时，就要执行一次代码里面的几十条url链接，如果频繁访问呢？Cloudflare就会显示上图的页面），也可能是其它原因导致的。[link](https://developers.cloudflare.com/workers/platform/limits/)

#### 2、获取到的节点数量少

<p>该代码搭建的Cloudflare Workers获取的节点数量比较少。即：Cloudflare Workers运行获取的节点数 < 在本地电脑运行获取的节点数，</p>
<p>特别是trojan的节点根本没有，本地电脑运行，能获取trojan的节点的。</p>

<p>如果测试到可用的节点少，无非两种情况，第一种，节点本来都不能使用了，第二种，代码运行后，组合成的节点链接有问题。</p>

#### 3、使用代理IP访问自定义域的订阅链接，出现 FortiGuard Intrusion Prevention - Access Blocked 页面错误

如果使用代理IP访问代码搭建的订阅链接网页时，代理IP不干净可能遇到下图的情况，解决方法：更换其它干净的节点或不使用代理访问。

<img src="images\FortiGuard Intrusion Prevention - Access Blocked.png" />
