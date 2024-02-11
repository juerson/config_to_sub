import yaml from 'js-yaml';

const urls = [
  // hysteria
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria/1/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/config.json',
  'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria/config.json',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria/config.json',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria/13/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/2/config.json',
  'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria/2/config.json',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria/2/config.json',
  // hysteria2
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria2/1/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria2/config.json',
  'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria2/config.json',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/config.json',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria2/13/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria2/2/config.json',
  'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria2/2/config.json',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/2/config.json',
  // naiveproxy
  'https://www.gitlabip.xyz/Alvin9999/PAC/master/naiveproxy/1/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/naiveproxy/config.json',
  'https://www.githubip.xyz/Alvin9999/PAC/master/naiveproxy/config.json',
  'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/naiveproxy/config.json',
  // singbox
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/singbox/1/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/singbox/config.json',
  'https://www.githubip.xyz/Alvin9999/pac2/master/singbox/config.json',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/singbox/config.json',
  // xray
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/xray/1/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/config.json',
  'https://www.githubip.xyz/Alvin9999/pac2/master/xray/config.json',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/xray/config.json',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/xray/3/config.json',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/2/config.json',
  'https://www.githubip.xyz/Alvin9999/pac2/master/xray/2/config.json',
  // v2rayB
  'https://fastly.jsdelivr.net/gh/jsvpn/jsproxy@dev/cbnews/20200809/1366909.md', // 失败的链接
  'https://www.githubip.xyz/jsvpn/jsproxy/dev/cbnews/20200809/1366909.md',
  // clash.meta
  'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta/config.yaml',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta/1/config.yaml',
  'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta/2/config.yaml',
  'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta/3/config.yaml',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta/config.yaml',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta/2/config.yaml',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta/3/config.yaml',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta/13/config.yaml',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta/15/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta/2/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta/3/config.yaml',
  // clash.meta2
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta2/1/config.yaml',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta2/config.yaml',
  'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta2/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta2/config.yaml',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta2/13/config.yaml',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta2/2/config.yaml',
  'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta2/2/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta2/2/config.yaml',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta2/15/config.yaml',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta2/3/config.yaml',
  'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta2/3/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta2/3/config.yaml',
  // clashB
  'https://fastly.jsdelivr.net/gh/jsvpn/jsproxy@dev/baitai/20200329/1302338.md',
  'https://www.githubip.xyz/jsvpn/jsproxy/dev/baitai/20200329/1302338.md',
  // v2go
  'https://www.githubip.xyz/jsvpn/jsproxy/dev/yule/20200325/1299699.md',
  'https://fastly.jsdelivr.net/gh/jsvpn/jsproxy@dev/yule/20200325/1299699.md',
  // quick
  'https://gitlab.com/free9999/ipupdate/-/raw/master/quick/config.yaml',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/quick/1/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/quick/config.yaml',
  'https://www.githubip.xyz/Alvin9999/pac2/master/quick/config.yaml',
  'https://gitlab.com/free9999/ipupdate/-/raw/master/quick/3/config.yaml',
  'https://www.gitlabip.xyz/Alvin9999/pac2/master/quick/3/config.yaml',
  'https://www.githubip.xyz/Alvin9999/pac2/master/quick/4/config.yaml',
  'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/quick/4/config.yaml',
  // 其它
  'https://raw.githubusercontent.com/aiboboxx/clashfree/main/clash.yml',
];
const batchSize = 20; // 最大并行请求数量，免费的cf账号最多60
const failedURLs = []; // 存储请求失败的链接


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  // 根据相对路径判断要返回的页面
  if (pathname === '/') {
    let jsonObject = await read_htmlContent_convert_json(urls, batchSize);
    console.log(`共${jsonObject.length}个节点(没有去重)`);

    // 创建一个空的 Set，存储可能是多个节点的链接
    const uniqueSet = new Set();

    let allProxyType = ["hysteria", "hysteria1", "hy1", "hysteria2", "hy2", "vless", "vmess", "trojan", "ss", "shadowsocks", "tuic"]
    for (let i = 0; i < jsonObject.length; i++) {
      const jsonObject_n = JSON.parse(jsonObject[i]) // 将原来为JSON字符串的转为JSON对象
      let proxyType = findFieldValue(jsonObject_n, "protocol") || "";
      if (!allProxyType.includes(proxyType)) {
        proxyType = findFieldValue(jsonObject_n, "type")
      }
      let auth;
      let alpn;
      let proxyFieldValue; // naive节点
      if (!allProxyType.includes(proxyType)) {
        auth = findFieldValue(jsonObject_n, "auth_str"); // hy1节点
        alpn = findFieldValue(jsonObject_n, "alpn"); // hy1节点
        proxyFieldValue = findFieldValue(jsonObject_n, "proxy"); // naive节点
      }
      // 是naiveproxy节点
      if (proxyFieldValue) {
        let naive = parse_naive(proxyFieldValue);
        uniqueSet.add(naive);
      }
      // 检查到是hysteria类型的节点
      if (["hysteria", "hysteria1", "hy1"].includes(proxyType) || (auth && alpn)) {
        let hy1 = parse_hysteria(jsonObject_n);
        if (hy1) {
          uniqueSet.add(hy1);
        }
        // 检查到是hy2类型的节点
      } else if (["hy2", "hysteria2"].includes(proxyType) || findFieldValue(jsonObject_n, "auth")) {
        let hy2 = parse_hy2(jsonObject_n);
        if (hy2) {
          uniqueSet.add(hy2);
        }
        // 检查到是shadowsocks类型的节点
      } else if (["ss", "shadowsocks"].includes(proxyType)) {
        let ss = parse_shadowsocks(jsonObject_n);
        if (ss) {
          uniqueSet.add(ss);
        }
        // 检查到是vless类型的节点
      } else if (proxyType === "vless") {
        let vless = parse_vless(jsonObject_n);
        if (vless) {
          uniqueSet.add(vless);
        }
        // 检查到是vmess类型的节点
      } else if (proxyType === "vmess") {
        let vmess = parse_vmess(jsonObject_n);
        if (vmess) {
          uniqueSet.add(vmess)
        }
        // 检查到是trojan类型的节点
      } else if (proxyType === "trojan") {
        let trojan = parse_trojan(jsonObject_n);
        if (trojan) {
          uniqueSet.add(trojan);
        }
        // 检查到是tuic类型的节点
      } else if (proxyType === "tuic") {
        let tuic = parse_tuic(jsonObject_n);
        if (tuic) {
          uniqueSet.add(tuic);
        }
      }
    }
    // 将 Set 转换为数组，并按字母顺序排序
    let sortedArray = Array.from(uniqueSet).sort();
    let nodes_links = sortedArray.join("\n");

    return new Response(nodes_links, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
  } else if (pathname === '/ok') {
    failedURLs.length = 0; // 防止刷新网页，没有把原来的数据清理掉
    try {
      const results = await fetchMultiplePages(urls, batchSize); // urls中的所有url都发出请求
    } catch (error) {
      console.error(error);
    }
    let successful_urls = urls.filter(item => !failedURLs.includes(item));
    let successful_count = successful_urls.length;
    let successful_urls_str = successful_urls.join("\n")
    return new Response(`成功的URL请求(共${successful_count}个):\n${successful_urls_str} \n\n带有引号和括号的字符串形式的数组(跟上面的一样):\n${JSON.stringify(successful_urls)}`,
      { headers: { 'Content-Type': 'text/javascript;charset=UTF-8' } })
  } else if (pathname === '/failedURLs' || pathname === "/failedurl" || pathname === "/failedlink" || pathname === "/failedlinks") {
    failedURLs.length = 0; // 防止刷新网页，没有把原来的数据清理掉
    try {
      const results = await fetchMultiplePages(urls, batchSize); // urls中的所有url都发出请求
    } catch (error) {
      console.error(error);
    }
    if (failedURLs.length > 0) {
      let failedURLs_string = failedURLs.join("\n")
      return new Response(failedURLs_string, { headers: { 'Content-Type': 'text/javascript;charset=UTF-8' } })
    } else {
      return new Response("没有失败的URL", { headers: { 'Content-Type': 'text/plain;charset=UTF-8' } })
    }
  } else {
    return new Response('页面未找到', { status: 404 })
  }
}
async function read_htmlContent_convert_json() {
  const jsonString_set = new Set();
  const yamlString_set = new Set();

  const yaml_proxies_set = new Set();
  try {
    const results = await fetchMultiplePages(urls, batchSize);
    results.forEach(element => {
      // 假设是JSON数据
      try {
        let jsonObject_str = JSON.stringify(JSON.parse(element), null, 2); // 格式化为带缩进的JSON字符串
        let outbounds = findFieldValue(JSON.parse(jsonObject_str), "outbounds") || "";
        if (outbounds.length > 0) {  // 同一个文件中，有多个节点时
          outbounds.forEach(function (item) {
            if (typeof item === "object") {
              let node = JSON.stringify(item, null, 2); // item指的是json文件中字段outbounds里面的数组的每个节点
              jsonString_set.add(node);
            }
          });
        } else {
          jsonString_set.add(jsonObject_str); // 同一个文件中，只有一个节点时
        }
      } catch (error) {
        // 假设是yaml数据
        try {
          const yamlString = yaml.load(element.replace(/!<str>/g, ""));
          yaml_proxies_set.add(findFieldValue(yamlString, "proxies")); // 只将yaml文件中字段proxies的内容添加到集合中
        } catch (error) {
          // 不是json、yaml的对象
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
  // 提取yaml中的节点到yamlString_set中
  yaml_proxies_set.forEach(function (item) {
    if (typeof item === "object") {
      item.forEach(function (subItem) {
        let node = JSON.stringify(subItem, null, 2); // subItem指的是yaml文件中字段proxies里面的数组的每个节点
        yamlString_set.add(node);
      });
    }
  });
  const uniqueYamlResults = Array.from(yamlString_set); // 将 yamlString_set 转换为数组
  const uniqueJsonResults = Array.from(jsonString_set); // 将 jsonString_set 转换为数组
  // 合并两个数组
  let mergedArray = uniqueYamlResults.concat(uniqueJsonResults);
  return mergedArray
}

async function fetchMultiplePages(urls, batchSize, timeout = 8000) { // 单位ms，这里设置8秒，相当于只给你们10秒跑完100米，只要有一个没有跑完，这批次就有超时
  const results = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batchUrls = urls.slice(i, i + batchSize);
    const batchPromises = batchUrls.map(url => {
      const fetchPromise = fetch(url).then(response => response.text());
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request to ${url} timed out after ${timeout}ms`));
        }, timeout);
      });
      return Promise.race([fetchPromise, timeoutPromise]);
    });

    const batchResults = await Promise.allSettled(batchPromises);
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') { // 在设置的超时范围内，完成的
        results.push(result.value);
      } else {
        const failedUrl = batchUrls[index];
        console.error(`warning: Failed to fetch ${failedUrl}: ${result.reason}`);
        failedURLs.push(batchUrls[index]); // 记录失败的链接
      }
    });
  }
  return results;
}

// 查找json中的指定字段对应的值
function findFieldValue(obj, targetField) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === targetField) {
        return obj[key];
      } else if (typeof obj[key] === 'object') {
        const result = findFieldValue(obj[key], targetField);
        if (result != undefined) {
          return result;
        }
      }
    }
  }
  return null; // 如果未找到字段，返回null
}

// ------------------------------------------ 解析数组中的hysteria节点 ------------------------------------------

function parse_hysteria(jsonObject_n) {
  let server = findFieldValue(jsonObject_n, "server");
  if (server.startsWith("127.0.0.1")) {
    return "";
  }
  let port = findFieldValue(jsonObject_n, "server_port") || findFieldValue(jsonObject_n, 'port') || "";

  let upmbps_str = findFieldValue(jsonObject_n, "up_mbps") || findFieldValue(jsonObject_n, 'up');
  let downmbps_str = findFieldValue(jsonObject_n, "down_mbps") || findFieldValue(jsonObject_n, 'down');
  // 不管upmbps_str是纯数字的字符串呢，还是数字和其它字符的字符串，都只保留数字，其它的字符都丢弃
  let upmbps = parseInt(String(upmbps_str).replace(/\D/g, ''), 10) || 0;
  let downmbps = parseInt(String(downmbps_str).replace(/\D/g, ''), 10) || 0;

  let auth = findFieldValue(jsonObject_n, "auth_str") || findFieldValue(jsonObject_n, 'auth-str');
  let peer = findFieldValue(jsonObject_n, "server_name") || findFieldValue(jsonObject_n, 'sni') || "";

  let protocolValue = findFieldValue(jsonObject_n, 'protocol');
  let protocol = protocolValue !== "hysteria" ? protocolValue : ""

  let insecureFieldValue = findFieldValue(jsonObject_n, "insecure");
  let insecure = [null, true].includes(insecureFieldValue) ? 1 : "";

  let alpnValue = findFieldValue(jsonObject_n, "alpn");
  let alpn;
  if (typeof alpnValue === "string") {
    alpn = alpnValue;
  } else {
    alpn = alpnValue.length === 1 ? alpnValue[0].toString() : alpnValue.join(',');
  }
  let hysteriaDict = {
    "upmbps": upmbps,
    "downmbps": downmbps,
    "auth": auth,
    "protocol": protocol,
    "insecure": insecure,
    "peer": peer,
    "alpn": alpn,
  }
  // 过滤掉值为空的键值对
  const filteredParams = Object.fromEntries(
    Object.entries(hysteriaDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
  );
  // 进行 URL 参数编码
  const encodedParams = new URLSearchParams(filteredParams).toString();
  let hy1;
  if (port) {
    hy1 = `hysteria://${server}:${port}?${encodedParams}#[hysteria]_${server}:${port}`;
  } else {
    hy1 = `hysteria://${server}?${encodedParams}#[hysteria]_${server}`; // 针对port在server中的
  }
  return hy1;
}

// ------------------------------------------ 解析数组中的hy2节点 ------------------------------------------

function parse_hy2(jsonObject_n) {
  let server = findFieldValue(jsonObject_n, 'server');
  if (server.startsWith("127.0.0.1")) {
    return "";
  }
  let port = findFieldValue(jsonObject_n, 'port') || "";

  // 排除"domain:port"、"ipv4:port" 或 "ipv6:port" 这三种情况地址的正则表达式
  let genericAddressRegex = /^(?!.*:\d+$)(?!\[.*\].*:\d+$)/
  if (genericAddressRegex.test(server)) {
    server = `${server}:${port}`;
  }

  let password = findFieldValue(jsonObject_n, 'password') || findFieldValue(jsonObject_n, 'auth');
  let obfs = findFieldValue(jsonObject_n, 'obfs') || "";
  let obfs_password = findFieldValue(jsonObject_n, 'obfs-password') || "";
  let sni = findFieldValue(jsonObject_n, 'sni') || "";

  let up = findFieldValue(jsonObject_n, 'up') || "100";
  let down = findFieldValue(jsonObject_n, 'down') || "100";
  // 不管upmbps_str是纯数字的字符串呢，还是数字和其它字符组合的字符串，都只保留数字，其它的字符都丢弃
  let upmbps = parseInt(String(up).replace(/\D/g, ''), 10) || 100;
  let downmbps = parseInt(String(down).replace(/\D/g, ''), 10) || 100;

  let insecureFieldValue = findFieldValue(jsonObject_n, "insecure");
  let insecure = [null, true].includes(insecureFieldValue) ? 1 : "";

  let hy2Dict = {
    "upmbps": upmbps,
    "downmbps": downmbps,
    "obfs": obfs,
    "obfs-password": obfs_password,
    "sni": sni,
    "insecure": insecure
  }

  // 过滤掉值为空的键值对
  const filteredParams = Object.fromEntries(
    Object.entries(hy2Dict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
  );
  // 进行 URL 参数编码
  const encodedParams = new URLSearchParams(filteredParams).toString();

  let hy2 = `hy2://${password}@${server}?${encodedParams}#[hy2]_${server}`;

  return hy2;
}

// ------------------------------------------ 解析数组中的vless节点 ------------------------------------------

function parse_vless(jsonObject_n) {
  let address = findFieldValue(jsonObject_n, "address") || findFieldValue(jsonObject_n, 'server'); // "||" 左边为json，右边是yaml
  if (address === "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(jsonObject_n, "port");
  let uuid = findFieldValue(jsonObject_n, "id") || findFieldValue(jsonObject_n, 'uuid'); // "||" 左边为json，右边是yaml
  let encryption = findFieldValue(jsonObject_n, "encryption") || "none"; // 加密方式
  let flow = findFieldValue(jsonObject_n, 'flow') || "";
  let network = findFieldValue(jsonObject_n, "network");
  let host = findFieldValue(jsonObject_n, "Host") || findFieldValue(jsonObject_n, 'host') || "";
  let path = findFieldValue(jsonObject_n, "path") || "";
  // 目前发现publicKey和shortId是reality独有
  let public_key = findFieldValue(jsonObject_n, 'public-key') || findFieldValue(jsonObject_n, 'publicKey') || "";
  let short_id = findFieldValue(jsonObject_n, 'short-id') || findFieldValue(jsonObject_n, 'shortId') || "";
  // sni
  let serverName = findFieldValue(jsonObject_n, "serverName") || findFieldValue(jsonObject_n, 'servername') || "";
  if (host === "" && serverName === "") {
    host = address
  } else if (host === "" && serverName !== "") {
    host = serverName
  }
  // 传输层安全(TLS)
  let tls_security;
  if (public_key !== "") {
    tls_security = "reality";
  } else {
    let tls = findFieldValue(jsonObject_n.streamSettings, 'security') || findFieldValue(jsonObject_n, 'tls') || "";
    if (tls === "none") {
      tls_security = "";
    } else if (tls === true) {
      tls_security = "tls";
    } else {
      tls_security = "";
    }
  }
  if (tls_security === "" && network === "ws" && serverName !== "") {
    tls_security = "tls";
  }
  let fp = findFieldValue(jsonObject_n, "fingerprint") || findFieldValue(jsonObject_n, 'client-fingerprint') || "";
  let vlessDict = {
    "encryption": encryption, // 加密方式
    "flow": flow,
    "security": tls_security, // 传输层安全(TLS)
    "sni": serverName,
    "fp": fp,
    "pbk": public_key,
    "sid": short_id,
    "type": network, // 传输协议(network)
    "host": host, // 伪装域名(host)
    "path": path,
    "headerType": "" // 伪装类型(type)
  }

  // 过滤掉值为空的键值对
  const filteredParams = Object.fromEntries(
    Object.entries(vlessDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
  );
  // 进行 URL 参数编码
  const encodedParams = new URLSearchParams(filteredParams).toString();

  let vless = `vless://${uuid}@${address}:${port}?${encodedParams}#[vless]_${address}:${port}`;

  return vless;
}

// ------------------------------------------ 解析数组中的vmess节点 ------------------------------------------

function parse_vmess(jsonObject_n) {
  let address = findFieldValue(jsonObject_n, "address") || findFieldValue(jsonObject_n, 'server');
  if (address === "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(jsonObject_n, 'port');
  let uuid = findFieldValue(jsonObject_n, 'id') || findFieldValue(jsonObject_n, 'uuid');
  let alterId = findFieldValue(jsonObject_n, 'alterId') || "";

  // 加密方式(security)
  let scy_security = findFieldValue(jsonObject_n, 'cipher') || findFieldValue(jsonObject_n.settings, 'security') || "auto";

  // 传输协议(network)
  let network = findFieldValue(jsonObject_n, 'network');
  // 伪装类型(type)
  let type_encryption = findFieldValue(jsonObject_n, 'encryption') || "auto";

  // 传输层安全(TLS)
  let tls = findFieldValue(jsonObject_n.streamSettings, 'security') || findFieldValue(jsonObject_n, 'tls') || "";
  let tls_security = tls === true ? 'tls' || "" : tls

  let path = findFieldValue(jsonObject_n, 'path') || findFieldValue(jsonObject_n, 'ws-path') || "/";
  // 伪装域名(host)
  let host = findFieldValue(jsonObject_n, 'Host') || findFieldValue(jsonObject_n, 'host') || "";
  let serverName = findFieldValue(jsonObject_n, 'sni') || findFieldValue(jsonObject_n, 'serverName') || findFieldValue(jsonObject_n, 'servername') || "";
  if (host === "" && serverName === "") {
    host = address
  } else if (host === "" && serverName !== "") {
    host = serverName
  }
  let fp = findFieldValue(jsonObject_n, 'client-fingerprint') || findFieldValue(jsonObject_n, 'fingerprint') || "";
  let vmess_dict = {
    "v": "2",
    "ps": `[vmess]_${address}:${port}`,
    "add": address,
    "port": port,
    "id": uuid,
    "aid": alterId, // 额外ID(alterId)
    "scy": scy_security, // 加密方式(security)
    "net": network, // 传输协议(network)
    "type": type_encryption, // 伪装类型(type)
    "host": host, // 伪装域名(host)
    "path": path, // 路径
    "tls": tls_security, // 传输层安全(TLS)
    "sni": serverName,
    "alpn": "",
    "fp": fp
  }
  // 将对象转换为 JSON 字符串（方便后面进行base64编码）
  const jsonString = JSON.stringify(vmess_dict);

  /*
    由于btoa主要用于处理 Latin-1 字符串，如果字符串包含非 Latin-1 字符（比如 Unicode 字符），
    要编码成Base64字符串，就使用 TextEncoder 和 Uint8Array。
  */
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(jsonString);
  const base64EncodedString = btoa(String.fromCharCode.apply(null, uint8Array));
  const vmess = `vmess://${base64EncodedString}`;

  return vmess;
}

// ------------------------------------------ 解析数组中的shadowsocks节点 ------------------------------------------

function parse_shadowsocks(jsonObject_n) {
  let address = findFieldValue(jsonObject_n, 'address') || findFieldValue(jsonObject_n, 'server');
  if (address === "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(jsonObject_n, 'port');

  let method = findFieldValue(jsonObject_n, 'method') || findFieldValue(jsonObject_n, 'cipher');
  let password = findFieldValue(jsonObject_n, 'password');
  let method_with_password = `${method}:${password}`;
  let base64EncodedString = btoa(method_with_password);

  let ss = `ss://${base64EncodedString}@${address}:${port}#[ss]_${address}`;

  return ss;
}

// ------------------------------------------ 解析数组中的trojan节点 ------------------------------------------

function parse_trojan(jsonObject_n) {
  let server = findFieldValue(jsonObject_n, "server");
  if (server.startsWith("127.0.0.1")) {
    return "";
  }
  let port = findFieldValue(jsonObject_n, 'port');
  let password = findFieldValue(jsonObject_n, 'password');
  let network = findFieldValue(jsonObject_n, 'network') || "tcp";
  let path = findFieldValue(jsonObject_n, 'path') || "";
  let host = findFieldValue(jsonObject_n, 'Host') || findFieldValue(jsonObject_n, 'host') || "";
  let sni = findFieldValue(jsonObject_n, 'sni') || "";

  let fp = findFieldValue(jsonObject_n, 'client-fingerprint') || findFieldValue(jsonObject_n, 'fingerprint') || "";
  let alpn = findFieldValue(jsonObject_n, 'alpn') || ""; // 没有确定字段是否这个名字
  let tls_security = "";
  if (sni) {
    tls_security = "tls";
  }
  let trojanDict = {
    "security": tls_security,
    "allowInsecure": 1,
    "sni": sni,
    "fp": fp,
    "type": network,
    "host": host,
    "alpn": alpn,
    "path": path
  }

  // 过滤掉值为空的键值对
  const filteredParams = Object.fromEntries(
    Object.entries(trojanDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
  );
  // 进行 URL 参数编码
  const encodedParams = new URLSearchParams(filteredParams).toString();

  let trojan = `trojan://${password}@${server}:${port}?${encodedParams}#[trojan]_${server}`;

  return trojan;
}

// ------------------------------------------ 解析数组中的tuic节点 ------------------------------------------

function parse_tuic(jsonObject_n) {
  let uuid = findFieldValue(jsonObject_n, 'uuid');
  let password = findFieldValue(jsonObject_n, 'password');
  let server = findFieldValue(jsonObject_n, 'server');
  if (server === "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(jsonObject_n, 'port');
  let congestion_controller = findFieldValue(jsonObject_n, 'congestion-controller');
  let udp_relay_mode = findFieldValue(jsonObject_n, 'udp-relay-mode');
  let sni = findFieldValue(jsonObject_n, 'sni') || "";
  let alpnValue = findFieldValue(jsonObject_n, "alpn");
  var alpn;
  if (alpnValue.length === 1) {
    // 如果数组只有一个元素，直接获取该元素
    alpn = alpnValue[0].toString();
  } else {
    // 如果数组有多个元素，使用逗号连接
    alpn = alpnValue.join(',');
  }
  let tuicDict = {
    "congestion_control": congestion_controller,
    "udp_relay_mode": udp_relay_mode,
    "alpn": alpn,
    "sni": sni,
    "allow_insecure": 1
  }
  // 过滤掉值为空的键值对
  const filteredParams = Object.fromEntries(
    Object.entries(tuicDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
  );
  // 进行 URL 参数编码
  const encodedParams = new URLSearchParams(filteredParams).toString();
  let tuic = `tuic://${uuid}:${password}@${server}:${port}?${encodedParams}#[tuic]_${server}`;

  return tuic;
}

// ------------------------------------------ 解析数组中的naive节点 ------------------------------------------

function parse_naive(proxyFieldValue) {
  // 使用正则表达式进行匹配naive配置文件中proxy中的值
  const pattern = /^https:\/\/.*@.*$/
  const isMatch = pattern.test(proxyFieldValue);
  if (proxyFieldValue && isMatch && typeof proxyFieldValue === "string") {
    // 从右侧找到 ":" 和 "@" 的索引
    const colonIndex = proxyFieldValue.lastIndexOf(":");
    const atIndex = proxyFieldValue.lastIndexOf("@");
    // 截取 "@" 后到 ":" 之间的内容
    const extractedContent = proxyFieldValue.substring(atIndex + 1, colonIndex);
    let naive = `naive+${proxyFieldValue}#[naive]_${extractedContent}`;
    return naive;
  } else {
    return "";
  }
}
