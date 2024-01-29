# config_to_sub

【Cloudflare Workers】在线提取ChromeGo/EdgeGo里面的代理节点，然后转换成vless、vmess、ss、trojan、hysteria、hy2、tuic链接，也可以作为订阅地址使用。

## 注意：
worker.js代码部署后，频繁访问`*.*.workers.dev`或你的域名链接时，会遇到如图的错误：

<img src="images\错误1102.png" />

遇到这个错误，隔一段时间再回来访问（大概几分钟到十多分钟，最长也就是几十分钟；这个时长，已经够用了，也不用频繁更新订阅链接）；萌新写Cloudflare Workers、wrangler的代码也就是这几天，导致上图的问题，具体原因不太清楚，个人猜测频繁请求url太多（访问`*.*.workers.dev`或你的域名链接时，就要执行一次代码里面的几十条url链接，如果频繁访问呢？Cloudflare就会显示上图的页面），也可能是其它原因导致的。[link](https://developers.cloudflare.com/workers/platform/limits/)
