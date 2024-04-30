import yaml from 'js-yaml'; // npm install js-yaml

// ----------------------------------------- 解析和构建 hysteria 节点 ---------------------------------------

function parse_hysteria(outbounds_n) {
	let server = findFieldValue(outbounds_n, "server") || "";
	if (server.startsWith("127.0.0.1") || server === "") {
		return "";
	}
	let port = findFieldValue(outbounds_n, "server_port") || findFieldValue(outbounds_n, 'port');

	let upmbps_str = findFieldValue(outbounds_n, "up_mbps") || findFieldValue(outbounds_n, 'up');
	let downmbps_str = findFieldValue(outbounds_n, "down_mbps") || findFieldValue(outbounds_n, 'down');
	
  // 提取字符串中的数字，然后转换为数字类型
	let upmbps = parseInt(String(upmbps_str).replace(/\D/g, ''), 10) || 0;
	let downmbps = parseInt(String(downmbps_str).replace(/\D/g, ''), 10) || 0;

	let auth = findFieldValue(outbounds_n, "auth_str") || findFieldValue(outbounds_n, 'auth-str');
	let peer = findFieldValue(outbounds_n, "server_name") || findFieldValue(outbounds_n, 'sni') || "";

	let protocolValue = findFieldValue(outbounds_n, 'protocol');
	let protocol = protocolValue !== "hysteria" ? protocolValue : ""

	let insecureFieldValue = findFieldValue(outbounds_n, "insecure");
	let insecure = [null, true].includes(insecureFieldValue) ? 1 : "";

	let alpnValue = findFieldValue(outbounds_n, "alpn");
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
	// 拼接链接
	let hy1 = `hysteria://${server}:${port}?${encodedParams}#[hysteria]_${server}:${port}`;

	return hy1;
}

// ------------------------------------------ 解析和构建 hy2 节点 -------------------------------------------

function parse_hy2(outbounds_n) {
	let server = findFieldValue(outbounds_n, 'server') || "";
	if (server.startsWith("127.0.0.1") || server === "") {
		return "";
	}
	let port = findFieldValue(outbounds_n, 'port');

	// 排除"domain:port"、"ipv4:port" 或 "ipv6:port" 这三种情况地址的正则表达式
	let genericAddressRegex = /^(?!.*:\d+$)(?!\[.*\].*:\d+$)/
	if (genericAddressRegex.test(server)) {
		server = `${server}:${port}`;
	}

	let password = findFieldValue(outbounds_n, 'password') || findFieldValue(outbounds_n, 'auth');
	let obfs = findFieldValue(outbounds_n, 'obfs') || "";
	let obfs_password = findFieldValue(outbounds_n, 'obfs-password') || "";
	let sni = findFieldValue(outbounds_n, 'sni') || "";

	let up = findFieldValue(outbounds_n, 'up') || "80";
	let down = findFieldValue(outbounds_n, 'down') || "100";
	// 提取字符串中的数字，然后转换为数字类型
	let upmbps = parseInt(String(up).replace(/\D/g, ''), 10) || 0;
	let downmbps = parseInt(String(down).replace(/\D/g, ''), 10) || 0;

	let insecureFieldValue = findFieldValue(outbounds_n, "insecure");
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

// ----------------------------------------- 解析和构建 vless 节点 ------------------------------------------

function parse_vless(outbounds_n) {
	let address = findFieldValue(outbounds_n, "address") || findFieldValue(outbounds_n, 'server') || "";
	if (address === "127.0.0.1" || address === "") {
		return "";
	}
	let port = findFieldValue(outbounds_n, "port");
	let uuid = findFieldValue(outbounds_n, "id") || findFieldValue(outbounds_n, 'uuid');
	let encryption = findFieldValue(outbounds_n, "encryption") || "none"; // 加密方式
	let flow = findFieldValue(outbounds_n, 'flow') || "";
	let network = findFieldValue(outbounds_n, "network");
	let host = findFieldValue(outbounds_n, "Host") || findFieldValue(outbounds_n, 'host') || "";
	let path = findFieldValue(outbounds_n, "path") || "";
	// 目前发现publicKey和shortId是reality独有
	let public_key = findFieldValue(outbounds_n, 'public-key') || findFieldValue(outbounds_n, 'publicKey') || "";
	let short_id = findFieldValue(outbounds_n, 'short-id') || findFieldValue(outbounds_n, 'shortId') || "";
	// sni
	let serverName = findFieldValue(outbounds_n, "serverName") || findFieldValue(outbounds_n, 'servername') || "";
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
		let tls = findFieldValue(outbounds_n.streamSettings, 'security') || findFieldValue(outbounds_n, 'tls') || "";
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
	let fp = findFieldValue(outbounds_n, "fingerprint") || findFieldValue(outbounds_n, 'client-fingerprint') || "";
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

// ----------------------------------------- 解析和构建 vmess 节点 ------------------------------------------

function parse_vmess(outbounds_n) {
	let address = findFieldValue(outbounds_n, "address") || findFieldValue(outbounds_n, 'server') || "";
	if (address === "127.0.0.1" || address === "") {
		return "";
	}
	let port = findFieldValue(outbounds_n, 'port');
	let uuid = findFieldValue(outbounds_n, 'id') || findFieldValue(outbounds_n, 'uuid');
	let alterId = findFieldValue(outbounds_n, 'alterId') || 0;

	// 加密方式(security)
	let auto_security = findFieldValue(outbounds_n, 'cipher') || findFieldValue(outbounds_n.settings, 'security') || "auto";

	// 传输协议(network)
	let network = findFieldValue(outbounds_n, 'network');
	// 伪装类型(type)
	let type_encryption = findFieldValue(outbounds_n, 'encryption') || "none";

	// 传输层安全(TLS)
	let tls = findFieldValue(outbounds_n.streamSettings, 'security') || findFieldValue(outbounds_n, 'tls') || "";
	let tls_security = tls === true ? 'tls' || "" : tls

	let path = findFieldValue(outbounds_n, 'path') || findFieldValue(outbounds_n, 'ws-path') || findFieldValue(outbounds_n, 'grpc-service-name') || "/";
	// 伪装域名(host)
	let host = findFieldValue(outbounds_n, 'Host') || findFieldValue(outbounds_n, 'host') || "";
	let serverName = findFieldValue(outbounds_n, 'sni') || findFieldValue(outbounds_n, 'serverName') || "";
	if (serverName === "" && host === "") {
		host = address;
	}
	let fp = findFieldValue(outbounds_n, 'client-fingerprint') || findFieldValue(outbounds_n, 'fingerprint') || "";
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

// -------------------------------------- 解析和构建 shadowsocks 节点 ---------------------------------------

function parse_shadowsocks(outbounds_n) {
	let address = findFieldValue(outbounds_n, 'address') || findFieldValue(outbounds_n, 'server') || "";
	if (address === "127.0.0.1" || address === "") {
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

// ----------------------------------------- 解析和构建 trojan 节点 -----------------------------------------

function parse_trojan(outbounds_n) {
	let server = findFieldValue(outbounds_n, "server") || "";
	if (server.startsWith("127.0.0.1") || server === "") {
		return "";
	}
	let port = findFieldValue(outbounds_n, 'port');
	let password = findFieldValue(outbounds_n, 'password');
	let network = findFieldValue(outbounds_n, 'network') || "tcp";
	let path = findFieldValue(outbounds_n, 'path') || "";
	let host = findFieldValue(outbounds_n, 'Host') || findFieldValue(outbounds_n, 'host') || "";
	let sni = findFieldValue(outbounds_n, 'sni') || "";
	let fp = findFieldValue(outbounds_n, 'client-fingerprint') || findFieldValue(outbounds_n, 'fingerprint') || "";
	let alpn = findFieldValue(outbounds_n, 'alpn') || ""; // 没有确定字段是否这个名字
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

// ------------------------------------------ 解析和构建 tuic 节点 ------------------------------------------

function parse_tuic(outbounds_n) {
	let uuid = findFieldValue(outbounds_n, 'uuid');
	let password = findFieldValue(outbounds_n, 'password');
	let server = findFieldValue(outbounds_n, 'server') || "";
	if (server === "127.0.0.1" || server === "") {
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

// ------------------------------------------- 递归查找字段对应的值 ------------------------------------------

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

// ------------------------------------------- 抓取网页内容的函数 -------------------------------------------

async function fetchWebPageContent(url) {
	try {
		// 发送请求
		let response = await fetch(url);

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

// ---------------------------------------- 抓取网页并返回节点的分享链接 --------------------------------------

async function fetchAndProcessUrl(url) {
	const content = await fetchWebPageContent(url);
	let jsonObject;
	let outbounds; // 可能是字段outbounds值的列表，也可能是字段proxies值的列表
	try {
		jsonObject = JSON.parse(content);
		outbounds = findFieldValue(jsonObject, "outbounds");
	} catch (jsonError) {
		let yamlObject = yaml.load(content); // 使用js-yaml库解析yaml
		if (yamlObject && typeof yamlObject === 'object') {
			outbounds = findFieldValue(yamlObject, "proxies");
		}
	}

	if (outbounds === null && jsonObject) {
		/** 处理一个节点 */

		// hy2
		let server = findFieldValue(jsonObject, "server");
		let pwd_auth = findFieldValue(jsonObject, "auth");
		let sni = findFieldValue(jsonObject, "sni");

		let insecureFieldValue = findFieldValue(jsonObject, "insecure");
		let insecure = [null, true].includes(insecureFieldValue) ? 1 : "";

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

		// 使用正则表达式进行匹配naive配置文件中proxy中的值
		const pattern = /^https:\/\/.*@.*$/
		const isMatch = pattern.test(proxyFieldValue);

		if (server && pwd_auth) {
			// 判断是hy2

			let hy2 = `hy2://${pwd_auth}@${server}?insecure=${insecure}&sni=${sni}#[hy2]_${server}`

			return hy2
		} else if (server && auth && alpn && upmbps !== null && downmbps !== null) {
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
			if (hysteriaDict["obfsParam"] === "") {
				delete hysteriaDict["obfs"];
			}
			// 过滤掉值为空的键值对
			const filteredParams = Object.fromEntries(
				Object.entries(hysteriaDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
			);
			// 进行 URL 参数编码
			const encodedParams = new URLSearchParams(filteredParams).toString();

			let hy1 = `hysteria://${server}?${encodedParams}#[hysteria]_${server}`;

			return hy1
		} else if (proxyFieldValue && isMatch && (typeof proxyFieldValue === "string")) {
			// 判断是naive

			// 从右侧找到 ":" 和 "@" 的索引
			const colonIndex = proxyFieldValue.lastIndexOf(":");
			const atIndex = proxyFieldValue.lastIndexOf("@");
			// 截取 "@" 后到 ":" 之间的内容
			const extractedContent = proxyFieldValue.substring(atIndex + 1, colonIndex);
			let naive = `naive+${proxyFieldValue}#[naive]_${extractedContent}`;

			return naive
		}
	} else if (outbounds && Array.isArray(outbounds)) {
		/** 处理多个节点 */

		// 存储多个节点链接
		const uniqueSet = new Set();

		let allProxyType = ["hysteria", "hysteria1", "hy1", "hysteria2", "hy2", "vless", "vmess", "trojan", "ss", "shadowsocks", "tuic"]
		// 遍历数组中的节点
		for (var i = 0; i < outbounds.length; i++) {
			let proxyType = findFieldValue(outbounds[i], "protocol");
			if (!allProxyType.includes(proxyType)) {
				proxyType = findFieldValue(outbounds[i], "type")
			}
			// 检查到是hysteria类型的节点
			if (["hysteria", "hysteria1", "hy1"].includes(proxyType)) {
				let hy1 = parse_hysteria(outbounds[i]);
				if (hy1) {
					uniqueSet.add(hy1);
				}
				// 检查到是hy2类型的节点
			} else if (["hy2", "hysteria2"].includes(proxyType)) {
				let hy2 = parse_hy2(outbounds[i]);
				if (hy2) {
					uniqueSet.add(hy2);
				}
				// 检查到是shadowsocks类型的节点
			} else if (["ss", "shadowsocks"].includes(proxyType)) {
				let ss = parse_shadowsocks(outbounds[i]);
				if (ss) {
					uniqueSet.add(ss);
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
				// 检查到是trojan类型的节点
			} else if (proxyType === "trojan") {
				let trojan = parse_trojan(outbounds[i]);
				if (trojan) {
					uniqueSet.add(trojan);
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

// -------------------------------------------- 要抓取的网页链接 --------------------------------------------

/**
 * 要抓取的网页，目标urls集
 * 顺序随意，json、yaml数据都可以。
 * 不能太多，容易出现"Error: Too many subrequests"错误，
 * 这里已经剔除重复内容的url
 */
const targetUrls = [
	// hysteria
	'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/config.json',
	'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria/config.json',
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria/13/config.json',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/2/config.json',
	// hysteria2
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria2/1/config.json',
	'https://www.githubip.xyz/Alvin9999/pac2/master/hysteria2/config.json',
	'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/config.json',
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/hysteria2/13/config.json',
	'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/hysteria2/2/config.json',
	// naiveproxy
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/naiveproxy/1/config.json',
	'https://www.githubip.xyz/Alvin9999/PAC/master/naiveproxy/config.json',
	// singbox
	'https://gitlab.com/free9999/ipupdate/-/raw/master/singbox/config.json',
	// xray
	'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/config.json',
	'https://www.githubip.xyz/Alvin9999/pac2/master/xray/config.json',
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/xray/3/config.json',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/xray/2/config.json',
	// clash.meta
	'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta/config.yaml',
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta/1/config.yaml',
	'https://www.githubip.xyz/Alvin9999/pac2/master/clash.meta/3/config.yaml',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta/config.yaml',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta/2/config.yaml',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta/3/config.yaml',
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta/15/config.yaml',
	// clash.meta2
	'https://gitlab.com/free9999/ipupdate/-/raw/master/clash.meta2/config.yaml',
	'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/clash.meta2/config.yaml',
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/clash.meta2/13/config.yaml',
	// v2go
	'https://www.githubip.xyz/jsvpn/jsproxy/dev/yule/20200325/1299699.md',
	// quick
	'https://www.gitlabip.xyz/Alvin9999/pac2/master/quick/1/config.yaml',
	'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/quick/config.yaml',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/quick/3/config.yaml',
	// v2rayB
	'https://fastly.jsdelivr.net/gh/jsvpn/jsproxy@dev/cbnews/20200809/1366909.md',
	'https://www.githubip.xyz/jsvpn/jsproxy/dev/cbnews/20200809/1366909.md',
	// clashB
	'https://fastly.jsdelivr.net/gh/jsvpn/jsproxy@dev/baitai/20200329/1302338.md',
	'https://www.githubip.xyz/jsvpn/jsproxy/dev/baitai/20200329/1302338.md',
	// 其它
	'https://raw.githubusercontent.com/aiboboxx/clashfree/main/clash.yml',
];

// --------------------------------------- 操作targetUrls和构建节点的入口 ------------------------------------

async function processUrls(targetUrls) {
	const results = [];
	// 最大并发数
	const maxConcurrency = 3;
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
			// 剔除重复的link节点链接
			link.forEach(item => {
				if (!results.includes(item)) {
					results.push(item);
				}
			});
		} else if (link && !results.includes(link)) {
			// 直接将link节点链接放入results数组中
			results.push(link);
		}
	});

	// 返回结果数组
	return results;
}

// ----------------------------------------- Cloudflare worker 入口 ----------------------------------------

export default {
	async fetch(request, env, ctx) {
		try {
			// 调用函数并处理结果
			let resultsArray = await processUrls(targetUrls);

			// 使用Set数据结构的特性去重（再次去重）
			let uniqueStrings = [...new Set(resultsArray)];

			// 排序
			let sortedArray = uniqueStrings.sort((a, b) => {
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

			// 将数组拼接成一个字符串
			// let resultString = sortedArray.join('\n');
			let resultString = btoa(sortedArray.join('\n'));

			// 返回一个带有结果的响应
			return new Response(resultString, {
				status: 200,
				headers: {
					'Content-Type': 'text/plain; charset=UTF-8',
				},
			});
		} catch (error) {
			console.error(`Error in fetch function: ${error.message}`);
			// 返回一个带有错误信息的响应
			return new Response(`Error fetching web page: ${error.message}`, {
				status: 500
			});
		}
	},
};
