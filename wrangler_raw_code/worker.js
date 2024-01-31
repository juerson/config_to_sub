import yaml from 'js-yaml'; // npm install js-yaml

// ------------------------------------------ 解析数组中的hysteria节点 ------------------------------------------

function parse_hysteria(outbounds_n) {
  let server = findFieldValue(outbounds_n, "server");
  let port = findFieldValue(outbounds_n, "server_port") || findFieldValue(outbounds_n, 'port');

  let upmbps_str = findFieldValue(outbounds_n, "up_mbps") || findFieldValue(outbounds_n, 'up');
  let downmbps_str = findFieldValue(outbounds_n, "down_mbps") || findFieldValue(outbounds_n, 'down');
  // 不管upmbps_str是纯数字的字符串呢，还是数字和其它字符的字符串，都只保留数字，其它的字符都丢弃
  let upmbps = parseInt(String(upmbps_str).replace(/\D/g, ''), 10) || 0;
  let downmbps = parseInt(String(downmbps_str).replace(/\D/g, ''), 10) || 0;

  let auth = findFieldValue(outbounds_n, "auth_str") || findFieldValue(outbounds_n, 'auth-str');
  let peer = findFieldValue(outbounds_n, "server_name") || findFieldValue(outbounds_n, 'sni') || "";

  let protocolValue = findFieldValue(outbounds_n, 'protocol');
  let protocol = protocolValue === "hysteria" ? "" : protocolValue || "";

  let insecureFieldValue = findFieldValue(outbounds_n, "insecure");
  let insecure;
  if (insecureFieldValue === null || insecureFieldValue === true) {
    insecure = 1
  } else if (insecureFieldValue === false) {
    insecure = ""
  }

  let alpnValue = findFieldValue(outbounds_n, "alpn");
  var alpn;
  if (alpnValue.length === 1) {
    // 如果数组只有一个元素，直接获取该元素
    alpn = alpnValue[0].toString();
  } else {
    // 如果数组有多个元素，使用逗号连接
    alpn = alpnValue.join(',');
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
  // 拼接链接
  let hy1 = `hysteria://${server}:${port}?${encodedParams}#[hysteria]_${server}:${port}`;

  return hy1;
}

// ------------------------------------------ 解析数组中的hy2节点 ------------------------------------------

function parse_hy2(outbounds_n) {
  let server = findFieldValue(outbounds_n, 'server');
  if (server.startsWith("127.0.0.1")) {
    return "";
  }

  let port = findFieldValue(outbounds_n, 'port');
  if (!server.includes(":")) {
    server = `${server}:${port}`;
  }

  let password = findFieldValue(outbounds_n, 'password');
  let obfs = findFieldValue(outbounds_n, 'obfs') || "";
  let obfs_password = findFieldValue(outbounds_n, 'obfs-password') || "";
  let sni = findFieldValue(outbounds_n, 'sni') || "";

  let up = findFieldValue(outbounds_n, 'up') || "0";
  let down = findFieldValue(outbounds_n, 'down') || "0";
  // 不管upmbps_str是纯数字的字符串呢，还是数字和其它字符组合的字符串，都只保留数字，其它的字符都丢弃
  let upmbps = parseInt(String(up).replace(/\D/g, ''), 10) || 0;
  let downmbps = parseInt(String(down).replace(/\D/g, ''), 10) || 0;

  let insecureFieldValue = findFieldValue(outbounds_n, "insecure");
  let insecure;
  if (insecureFieldValue === null || insecureFieldValue === true) {
    insecure = 1
  } else if (insecureFieldValue === false) {
    insecure = ""
  }

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

function parse_vless(outbounds_n) {
  let address = findFieldValue(outbounds_n, "address") || findFieldValue(outbounds_n, 'server'); // "||" 左边为json，右边是yaml
  if (address === "127.0.0.1" || address === null) {
    return "";
  }
  let port = findFieldValue(outbounds_n, "port");
  let uuid = findFieldValue(outbounds_n, "id") || findFieldValue(outbounds_n, 'uuid'); // "||" 左边为json，右边是yaml
  let encryption = findFieldValue(outbounds_n, "encryption") || "none"; // 加密方式
  let flow = findFieldValue(outbounds_n, 'flow') || "";
  let network = findFieldValue(outbounds_n, "network");
  let host = findFieldValue(outbounds_n, "Host") || findFieldValue(outbounds_n, 'host');
  let path = findFieldValue(outbounds_n, "path") || "";
  // 传输层安全(TLS)
  let tls_security;
  if (findFieldValue(outbounds_n, 'reality-opts')) {
    tls_security = "reality";
  } else {
    let tls = findFieldValue(outbounds_n.streamSettings, 'security') || findFieldValue(outbounds_n, 'tls') || "";
    tls_security = tls === true ? 'tls' || "" : tls;
  }
  let serverName = findFieldValue(outbounds_n, "serverName") || findFieldValue(outbounds_n, 'servername');
  let fingerprint = findFieldValue(outbounds_n, "fingerprint") || findFieldValue(outbounds_n, 'client-fingerprint');
  let public_key = findFieldValue(outbounds_n, 'public-key') || "";
  let short_id = findFieldValue(outbounds_n, 'short-id') || "";
  let vlessDict = {
    "encryption": encryption, // 加密方式
    "flow": flow,
    "security": tls_security, // 传输层安全(TLS)
    "sni": serverName,
    "fp": fingerprint,
    "pbk": public_key,
    "sid": short_id,
    "type": network, // 传输协议(network)
    "host": host, // 伪装域名(host)
    "path": path,
    "headerType": "none" // 伪装类型
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

function parse_vmess(outbounds_n) {
  let address = findFieldValue(outbounds_n, "address") || findFieldValue(outbounds_n, 'server');
  if (address === "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(outbounds_n, 'port');
  let uuid = findFieldValue(outbounds_n, 'id') || findFieldValue(outbounds_n, 'uuid');
  let alterId = findFieldValue(outbounds_n, 'alterId') || "";

  // 加密方式(security)
  let auto_security = findFieldValue(outbounds_n, 'cipher') || findFieldValue(outbounds_n.settings, 'security') || "auto";

  // 传输协议(network)
  let network = findFieldValue(outbounds_n, 'network');
  // 伪装类型(type)
  let type_encryption = findFieldValue(outbounds_n, 'encryption') || "none";

  // 传输层安全(TLS)
  let tls = findFieldValue(outbounds_n.streamSettings, 'security') || findFieldValue(outbounds_n, 'tls') || "";
  let tls_security = tls === true ? 'tls' || "" : tls

  let path = findFieldValue(outbounds_n, 'path') || findFieldValue(outbounds_n, 'ws-path') || "/";
  // 伪装域名(host)
  let host = findFieldValue(outbounds_n, 'Host') || findFieldValue(outbounds_n, 'host') || "";
  let serverName = findFieldValue(outbounds_n, 'sni') || findFieldValue(outbounds_n, 'serverName') || "";
  if (serverName === "" && host === "") {
    host = address;
  }
  let fp = findFieldValue(outbounds_n, 'client-fingerprint') || "";
  let vmess_dict = {
    "v": "2",
    "ps": `[vmess]_${address}:${port}`,
    "add": address,
    "port": port,
    "id": uuid,
    "aid": alterId, // 额外ID(alterId)
    "scy": auto_security, // 加密方式(security)
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

function parse_shadowsocks(outbounds_n) {
  let address = findFieldValue(outbounds_n, 'address') || findFieldValue(outbounds_n, 'server');
  if (address === "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(outbounds_n, 'port');

  let method = findFieldValue(outbounds_n, 'method') || findFieldValue(outbounds_n, 'cipher');
  let password = findFieldValue(outbounds_n, 'password');
  let method_with_password = `${method}:${password}`;
  let base64EncodedString = btoa(method_with_password);

  let ss = `ss://${base64EncodedString}@${address}:${port}#[ss]_${address}`;

  return ss;
}

// ------------------------------------------ 解析数组中的trojan节点 ------------------------------------------

function parse_trojan(outbounds_n) {
  let server = findFieldValue(outbounds_n, "server");
  if (server === "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(outbounds_n, 'port');
  let password = findFieldValue(outbounds_n, 'password');
  let network = findFieldValue(outbounds_n, 'network') || "tcp";
  let path = findFieldValue(outbounds_n, 'path') || "";
  let host = findFieldValue(outbounds_n, 'Host') || "";
  let sni = findFieldValue(outbounds_n, 'sni') || "";
  let alpn = findFieldValue(outbounds_n, 'alpn') || ""; // 没有确定字段是否这个名字
  let tls_security = "";
  if (sni) {
    tls_security = "tls"
  }
  let trojanDict = {
    "security": tls_security,
    "allowInsecure": 1,
    "sni": sni,
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

function parse_tuic(outbounds_n) {
  let uuid = findFieldValue(outbounds_n, 'uuid');
  let password = findFieldValue(outbounds_n, 'password');
  let server = findFieldValue(outbounds_n, 'server');
  if (server == "127.0.0.1") {
    return "";
  }
  let port = findFieldValue(outbounds_n, 'port');
  let congestion_controller = findFieldValue(outbounds_n, 'congestion-controller');
  let udp_relay_mode = findFieldValue(outbounds_n, 'udp-relay-mode');
  let sni = findFieldValue(outbounds_n, 'sni') || "";
  let alpnValue = findFieldValue(outbounds_n, "alpn");
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

// ----------------------------------------------------------------------------------------------------------

// 操作url，获取网页中的节点
async function fetchAndProcessUrl(url) {
  const content = await fetchWebPageContent(url);
  let jsonObject;
  let outbounds; // 可能是字段outbounds值的列表，也可能是字段proxies值的列表
  try {
    jsonObject = JSON.parse(content);
    outbounds = findFieldValue(jsonObject, "outbounds");
  } catch (jsonError) {
    let yamlObject = yaml.load(content); // 使用js-yaml库解析yaml
    if (yamlObject !== null && typeof yamlObject === 'object') {
      outbounds = findFieldValue(yamlObject, "proxies");
    }
  }
  // 节点只有一个，且占一个文件
  if (outbounds === null && jsonObject) {
    /** 判断该json数据只有一个节点 */

    // hy2
    let server = findFieldValue(jsonObject, "server");
    let password = findFieldValue(jsonObject, "auth");
    let sni = findFieldValue(jsonObject, "sni");

    let insecureFieldValue = findFieldValue(jsonObject, "insecure");

    let insecure;
    if (insecureFieldValue === null || insecureFieldValue === true) {
      insecure = 1;
    } else if (insecureFieldValue === false) {
      insecure = "";
    }

    // hy1
    let upmbps = findFieldValue(jsonObject, "up_mbps");
    let downmbps = findFieldValue(jsonObject, "down_mbps");
    let obfsParam = findFieldValue(jsonObject, "obfs") || "";
    let auth = findFieldValue(jsonObject, "auth_str") || "";
    let protocol = findFieldValue(jsonObject, "protocol") || "";
    let peer = findFieldValue(jsonObject, "server_name") || "";
    let alpn = findFieldValue(jsonObject, "alpn");
    let recv_window = findFieldValue(jsonObject, "recv_window") || "";
    let recv_window_conn = findFieldValue(jsonObject, "recv_window_conn") || "";

    // naive
    let proxyFieldValue = findFieldValue(jsonObject, "proxy");

    // 使用正则表达式进行匹配
    const pattern = /^https:\/\/.*@.*$/;
    const isMatch = pattern.test(proxyFieldValue);

    if (server !== null && password !== null) {
      // 判断是hy2

      let hy2 = `hy2://${password}@${server}?insecure=${insecure}&sni=${sni}#[hy2]_${server}`

      return hy2
    } else if (server !== null && upmbps !== null && downmbps !== null && auth !== null && alpn !== null) {
      // 判断是hy1

      let hysteriaDict = {
        "upmbps": upmbps,
        "downmbps": downmbps,
        "obfs": "xplus",
        "obfsParam": obfsParam,
        "auth": auth,
        "protocol": protocol,
        "insecure": insecure,
        "peer": peer,
        "alpn": alpn,
        "recv_window": recv_window,
        "recv_window_conn": recv_window_conn
      }
      // 没有对应的值，就从hysteriaDict中删除
      if (hysteriaDict["obfsParam"] == "") {
        delete hysteriaDict["obfs"];
      }
      // 过滤掉值为空的键值对
      const filteredParams = Object.fromEntries(
        Object.entries(hysteriaDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
      );
      // 进行 URL 参数编码
      const encodedParams = new URLSearchParams(filteredParams).toString();
      // 拼接链接
      let hy1 = `hysteria://${server}?${encodedParams}#[hysteria]_${server}`;

      return hy1
    } else if (proxyFieldValue !== null && isMatch && (typeof proxyFieldValue === "string")) {
      // 判断是naive

      // 从右侧找到 ":" 和 "@" 的索引
      const colonIndex = proxyFieldValue.lastIndexOf(":");
      const atIndex = proxyFieldValue.lastIndexOf("@");
      // 截取 "@" 后到 ":" 之间的内容
      const extractedContent = proxyFieldValue.substring(atIndex + 1, colonIndex);
      let naive = `naive+${proxyFieldValue}#[naive]_${extractedContent}`;

      return naive
    }
    // 以下为同一个json或yaml文件中，可能含多个节点
  } else if (outbounds !== null && Array.isArray(outbounds)) {
    /** 判断该json数据可能有多个节点 */

    // 创建一个空的 Set，存储可能是多个节点的链接
    const uniqueSet = new Set();
    // 遍历数组中的节点
    for (var i = 0; i < outbounds.length; i++) {
      // 左边protocol为json、右边type为yaml
      let proxyType = findFieldValue(outbounds[i], "protocol") || findFieldValue(outbounds[i], "type");
      // 检查到是hysteria类型的节点
      if (proxyType === "hysteria") {
        let hy1 = parse_hysteria(outbounds[i]);
        if (hy1) {
          uniqueSet.add(hy1);
        }
        // 检查到是vless类型的节点
      } else if (proxyType === "vless") {
        let vless = parse_vless(outbounds[i]);
        if (vless) {
          uniqueSet.add(vless);
        }
        // 检查到是vmess类型的节点
      } else if (proxyType === "vmess") {
        let vmess = parse_vmess(outbounds[i]);
        if (vmess) {
          uniqueSet.add(vmess)
        }
        // 检查到是shadowsocks类型的节点
      } else if (proxyType === "shadowsocks" || proxyType === 'ss') {
        let ss = parse_shadowsocks(outbounds[i]);
        if (ss) {
          uniqueSet.add(ss);
        }
        // 检查到是trojan类型的节点
      } else if (proxyType === "trojan") {
        let trojan = parse_trojan(outbounds[i]);
        if (trojan) {
          uniqueSet.add(trojan);
        }
        // 检查到是hy2类型的节点
      } else if (proxyType === "hysteria2" || proxyType === "hy2") {
        let hy2 = parse_hy2(outbounds[i]);
        if (hy2) {
          uniqueSet.add(hy2);
        }
        // 检查到是tuic类型的节点
      } else if (proxyType === "tuic") {
        let tuic = parse_tuic(outbounds[i]);
        if (tuic) {
          uniqueSet.add(tuic);
        }
      }
    }
    // 转换为数组
    const uniqueArray = Array.from(uniqueSet);

    return uniqueArray;
  }
}

// ----------------------------------------------------------------------------------------------------------

// 获取url网页的内容(字符串)
async function fetchWebPageContent(url) {
  try {
    // 使用fetch函数获取网页内容
    let response = await fetch(url);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`获取失败: ${response.status}`);
    }

    // 读取并返回文本内容，同时替换"!<str>"
    let content = await response.text();
    return content.replace(/!<str>/g, "");
  } catch (error) {
    console.error(`获取${url} 网页内容失败: ${error.message}`);
    return {};
  }
}

// 查找json中的指定字段对应的值
function findFieldValue(obj, targetField) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key == targetField) {
        return obj[key];
      } else if (typeof obj[key] == 'object') {
        const result = findFieldValue(obj[key], targetField);
        if (result != undefined) {
          return result;
        }
      }
    }
  }
  return null; // 如果未找到字段，返回null
}

async function processUrls(targetUrls) {
  // 用于存储结果的数组
  const results = [];

  // 并发执行的最大任务数量
  const maxConcurrency = 2; // 你可以根据需求调整这个数值

  // 辅助函数，限制并发执行的异步任务数量
  const asyncPool = async (poolLimit, array, iteratorFn) => {
    const results = [];
    const executing = [];

    for (const item of array) {
      const promise = Promise.resolve().then(() => iteratorFn(item));
      results.push(promise);

      if (executing.length < poolLimit) {
        const executingPromise = promise.then(() =>
          executing.splice(executing.indexOf(executingPromise), 1)
        );
        executing.push(executingPromise);
      } else {
        await Promise.race(executing);
      }
    }
    return Promise.all(results);
  };

  // 使用asyncPool并发执行异步任务
  await asyncPool(maxConcurrency, targetUrls, async (url) => {
    const link = await fetchAndProcessUrl(url);
    if (Array.isArray(link)) {
      // 如果 link 是数组，将数组中不在 results 中的元素添加到 results 中
      link.forEach(item => {
        if (!results.includes(item)) {
          results.push(item);
        }
      });
    } else if (link && !results.includes(link)) {
      // 如果 link 是单个链接，并且不在 results 中，添加到 results 中
      results.push(link);
    }
  });

  // 返回结果数组
  return results;
}

// 定义一个包含多个URL的数组(顺序随意，json、yaml都可以)
const targetUrls = [
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
  'https://fastly.jsdelivr.net/gh/jsvpn/jsproxy@dev/cbnews/20200809/1366909.md',
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
];

// 程序总入口
export default {
  async fetch(request, env, ctx) {
    try {
      // 调用函数并处理结果
      const resultsArray = await processUrls(targetUrls);

      // 使用Set数据结构的特性去重（再次去重）
      const uniqueStrings = [...new Set(resultsArray)];

      // 排序
      const sortedArray = uniqueStrings.sort((a, b) => {
        // 先按字母顺序排序
        const compareByLetters = a.localeCompare(b);
        // 如果字母相同，则按数字大小排序
        if (compareByLetters === 0) {
          const numA = parseInt(a, 10) || 0; // 将非数字的字符串转换为0
          const numB = parseInt(b, 10) || 0;
          const compareByNumbers = numA - numB;

          // 如果数字相同，则按字符串长度排序
          if (compareByNumbers === 0) {
            return a.length - b.length;
          }
          return compareByNumbers;
        }
        return compareByLetters;
      });

      // 将结果数组拼接成一个字符串，每个结果之间添加换行符
      const resultString = sortedArray.join('\n');

      // 在这里可以对内容进行处理
      return new Response(resultString, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
        },
      });
    } catch (error) {
      console.error(`Error in fetch function: ${error.message}`);
      // 返回一个带有错误信息的响应
      return new Response(`Error fetching web page: ${error.message}`, { status: 500 });
    }
  },
};
