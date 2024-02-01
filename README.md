# config_to_sub

【Cloudflare Workers】在线提取ChromeGo/EdgeGo里面的代理节点，然后转换成vless、vmess、ss、hysteria、hy2、tuic、naiveproxy链接，也可以作为订阅地址使用。

## 使用方法：

将根目录中的`worker.js`代码复制到`Cloudflare Workers`中部署；`wrangler_raw_code/worker.js`为开发中写的源码，直接复制到Cloudflare Workers中无法使用的。

## 注意：
worker.js代码部署后，频繁访问`*.*.workers.dev`或访问您的域名链接时，可能会遇到如图的错误：

<img src="images\错误1102.png" />

遇到1102错误，隔一段时间再回来访问（大概几分钟到十多分钟，最长也就是几十分钟；这个间隔时间，等得起，订阅链接也不用频繁更新，一次获取后，可以用很久）；萌新写Cloudflare Workers、wrangler的代码也就是这几天，导致上图的问题，具体原因不太清楚，个人猜测频繁请求url太多（访问`*.*.workers.dev`或你的域名链接时，就要执行一次代码里面的几十条url链接，如果频繁访问呢？Cloudflare就会显示上图的页面），也可能是其它原因导致的。[link](https://developers.cloudflare.com/workers/platform/limits/)

发现本地电脑运行worker.js脚本，有trojan节点的，但是在Cloudflare Workers边缘服务器运行没有对应的trojan节点（也就是节点可能会缺失一些，在本地电脑运行脚本获取到的节点比较多）。

如果使用代理IP访问网页时，代理IP不干净可能遇到如下图的页面，解决方法：更换其它干净的节点。

<img src="images\FortiGuard Intrusion Prevention - Access Blocked.png" />
