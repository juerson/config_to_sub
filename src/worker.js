import yaml from 'js-yaml'; // npm install js-yaml

// ----------------------------------------- 解析和构建 hysteria 节点 ---------------------------------------

function parse_hysteria(outbounds_n) {
	let server = findFieldValue(outbounds_n, 'server') || '';
	if (server.startsWith('127.0.0.1') || server === '') {
		return '';
	}
	let port = findFieldValue(outbounds_n, 'server_port') || findFieldValue(outbounds_n, 'port');

	let upmbps_str = findFieldValue(outbounds_n, 'up_mbps') || findFieldValue(outbounds_n, 'up');
	let downmbps_str = findFieldValue(outbounds_n, 'down_mbps') || findFieldValue(outbounds_n, 'down');
	// 提取字符串中的数字，然后转换为数字类型
	let upmbps = parseInt(String(upmbps_str).replace(/\D/g, ''), 10) || 0; // 上传速度
	let downmbps = parseInt(String(downmbps_str).replace(/\D/g, ''), 10) || 0; // 下载速度
	let obfsParam = findFieldValue(outbounds_n, 'obfs') || ''; // 混淆密码
	let auth = findFieldValue(outbounds_n, 'auth_str') || findFieldValue(outbounds_n, 'auth-str'); // 认证有效载荷
	let peer = findFieldValue(outbounds_n, 'server_name') || findFieldValue(outbounds_n, 'sni') || ''; // SNI

	let protocolValue = findFieldValue(outbounds_n, 'protocol');
	let protocol = protocolValue !== 'hysteria' ? protocolValue : '';

	let insecureFieldValue = findFieldValue(outbounds_n, 'insecure');
	let insecure = [null, true].includes(insecureFieldValue) ? 1 : '';

	let alpnValue = findFieldValue(outbounds_n, 'alpn');
	let alpn;
	if (typeof alpnValue === 'string') {
		alpn = alpnValue;
	} else {
		alpn = alpnValue.length === 1 ? alpnValue[0].toString() : alpnValue.join(',');
	}

	let hysteriaDict = {
		upmbps: upmbps,
		downmbps: downmbps,
		obfsParam: obfsParam,
		auth: auth,
		protocol: protocol,
		insecure: insecure,
		peer: peer,
		alpn: alpn,
	};
	// 过滤掉值为空的键值对
	const filteredParams = Object.fromEntries(
		Object.entries(hysteriaDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
	);
	// 进行 URL 参数编码
	const encodedParams = new URLSearchParams(filteredParams).toString();

	return `hysteria://${server}:${port}?${encodedParams}#[hysteria]_${server}:${port}`;
}

// ------------------------------------------ 解析和构建 hy2 节点 -------------------------------------------

function parse_hy2(outbounds_n) {
	let server = findFieldValue(outbounds_n, 'server') || '';
	if (server.startsWith('127.0.0.1') || server === '') {
		return '';
	}
	let port = findFieldValue(outbounds_n, 'port');

	// 排除"domain:port"、"ipv4:port" 或 "ipv6:port" 这三种情况地址的正则表达式
	let genericAddressRegex = /^(?!.*:\d+$)(?!\[.*\].*:\d+$)/;
	if (genericAddressRegex.test(server)) {
		server = `${server}:${port}`;
	}

	let password = findFieldValue(outbounds_n, 'password') || findFieldValue(outbounds_n, 'auth');
	let obfs = findFieldValue(outbounds_n, 'obfs') || '';
	let obfs_password = findFieldValue(outbounds_n, 'obfs-password') || '';
	let sni = findFieldValue(outbounds_n, 'sni') || '';

	let up = findFieldValue(outbounds_n, 'up') || '80';
	let down = findFieldValue(outbounds_n, 'down') || '100';
	// 提取字符串中的数字，然后转换为数字类型
	let upmbps = parseInt(String(up).replace(/\D/g, ''), 10) || 0;
	let downmbps = parseInt(String(down).replace(/\D/g, ''), 10) || 0;

	let insecureFieldValue = findFieldValue(outbounds_n, 'insecure');
	let insecure = [null, true].includes(insecureFieldValue) ? 1 : '';

	let hy2Dict = {
		upmbps: upmbps,
		downmbps: downmbps,
		obfs: obfs,
		'obfs-password': obfs_password,
		sni: sni,
		insecure: insecure,
	};

	// 过滤掉值为空的键值对
	const filteredParams = Object.fromEntries(
		Object.entries(hy2Dict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
	);
	// 进行 URL 参数编码
	const encodedParams = new URLSearchParams(filteredParams).toString();

	return `hy2://${password}@${server}?${encodedParams}#[hy2]_${server}`;
}

// ----------------------------------------- 解析和构建 vless 节点 ------------------------------------------

function parse_vle55(outbounds_n) {
	let address = findFieldValue(outbounds_n, 'address') || findFieldValue(outbounds_n, 'server') || '';
	if (address === '127.0.0.1' || address === '') {
		return '';
	}
	let port = findFieldValue(outbounds_n, 'port');
	let uuid = findFieldValue(outbounds_n, 'id') || findFieldValue(outbounds_n, 'uuid');
	let encryption = findFieldValue(outbounds_n, 'encryption') || 'none'; // 加密方式
	let flow = findFieldValue(outbounds_n, 'flow') || '';
	let network = findFieldValue(outbounds_n, 'network');
	let host = findFieldValue(outbounds_n, 'Host') || findFieldValue(outbounds_n, 'host') || '';
	let path = findFieldValue(outbounds_n, 'path') || '';
	// 目前发现publicKey和shortId是reality独有
	let public_key = findFieldValue(outbounds_n, 'public-key') || findFieldValue(outbounds_n, 'publicKey') || '';
	let short_id = findFieldValue(outbounds_n, 'short-id') || findFieldValue(outbounds_n, 'shortId') || '';
	// sni
	let serverName = findFieldValue(outbounds_n, 'serverName') || findFieldValue(outbounds_n, 'servername') || '';
	if (host === '' && serverName === '') {
		host = address;
	} else if (host === '' && serverName !== '') {
		host = serverName;
	}
	// 传输层安全(TLS)
	let tls_security;
	if (public_key !== '') {
		tls_security = 'reality';
	} else {
		let tls = findFieldValue(outbounds_n.streamSettings, 'security') || findFieldValue(outbounds_n, 'tls') || '';
		if (tls === 'none') {
			tls_security = '';
		} else if (tls === true) {
			tls_security = 'tls';
		} else {
			tls_security = '';
		}
	}
	if (tls_security === '' && network === 'ws' && serverName !== '') {
		tls_security = 'tls';
	}
	let fp = findFieldValue(outbounds_n, 'fingerprint') || findFieldValue(outbounds_n, 'client-fingerprint') || '';
	let vle55Dict = {
		encryption: encryption, // 加密方式
		flow: flow,
		security: tls_security, // 传输层安全(TLS)
		sni: serverName,
		fp: fp,
		pbk: public_key,
		sid: short_id,
		type: network, // 传输协议(network)
		host: host, // 伪装域名(host)
		path: path,
		headerType: '', // 伪装类型(type)
	};

	// 过滤掉值为空的键值对
	const filteredParams = Object.fromEntries(
		Object.entries(vle55Dict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
	);
	// 进行 URL 参数编码
	const encodedParams = new URLSearchParams(filteredParams).toString();

	return `${base64Decode('dmxlc3M6Ly8')}${uuid}@${address}:${port}?${encodedParams}#[${base64Decode('dmxlc3M')}]_${address}:${port}`;
}

// ----------------------------------------- 解析和构建 vmess 节点 ------------------------------------------

function parse_vme55(outbounds_n) {
	let address = findFieldValue(outbounds_n, 'address') || findFieldValue(outbounds_n, 'server') || '';
	if (address === '127.0.0.1' || address === '') {
		return '';
	}
	let port = findFieldValue(outbounds_n, 'port');
	let uuid = findFieldValue(outbounds_n, 'id') || findFieldValue(outbounds_n, 'uuid');
	let alterId = findFieldValue(outbounds_n, 'alterId') || 0;

	// 加密方式(security)
	let auto_security = findFieldValue(outbounds_n, 'cipher') || findFieldValue(outbounds_n.settings, 'security') || 'auto';

	// 传输协议(network)
	let network = findFieldValue(outbounds_n, 'network');
	// 伪装类型(type)
	let type_encryption = findFieldValue(outbounds_n, 'encryption') || 'none';

	// 传输层安全(TLS)
	let tls = findFieldValue(outbounds_n.streamSettings, 'security') || findFieldValue(outbounds_n, 'tls') || '';
	let tls_security = tls === true ? 'tls' || '' : tls;

	let path =
		findFieldValue(outbounds_n, 'path') ||
		findFieldValue(outbounds_n, 'ws-path') ||
		findFieldValue(outbounds_n, 'grpc-service-name') ||
		'/';
	// 伪装域名(host)
	let host = findFieldValue(outbounds_n, 'Host') || findFieldValue(outbounds_n, 'host') || '';
	let serverName = findFieldValue(outbounds_n, 'sni') || findFieldValue(outbounds_n, 'serverName') || '';
	if (serverName === '' && host === '') {
		host = address;
	}
	let fp = findFieldValue(outbounds_n, 'client-fingerprint') || findFieldValue(outbounds_n, 'fingerprint') || '';
	let vme55Dict = {
		v: '2',
		ps: `[${base64Decode('dm1lc3M')}]_${address}:${port}`,
		add: address,
		port: port,
		id: uuid,
		aid: alterId, // 额外ID(alterId)
		scy: auto_security, // 加密方式(security)
		net: network, // 传输协议(network)
		type: type_encryption, // 伪装类型(type)
		host: host, // 伪装域名(host)
		path: path, // 路径
		tls: tls_security, // 传输层安全(TLS)
		sni: serverName,
		alpn: '',
		fp: fp,
	};
	// 将对象转换为 JSON 字符串（方便后面进行base64编码）
	const jsonString = JSON.stringify(vme55Dict);

	const base64EncodedString = base64Encode(jsonString);

	return `${base64Decode('dm1lc3M6Ly8')}${base64EncodedString}`;
}

// -------------------------------------- 解析和构建 shadowsocks 节点 ---------------------------------------

function parse_shadowsocks(outbounds_n) {
	let address = findFieldValue(outbounds_n, 'address') || findFieldValue(outbounds_n, 'server') || '';
	if (address === '127.0.0.1' || address === '') {
		return '';
	}

	let port = findFieldValue(outbounds_n, 'port');
	let method = findFieldValue(outbounds_n, 'method') || findFieldValue(outbounds_n, 'cipher');
	let password = findFieldValue(outbounds_n, 'password');
	let method_with_password = `${method}:${password}`;
	let base64EncodedString = base64Encode(method_with_password);

	return `${base64Decode('c3M6Ly8')}${base64EncodedString}@${address}:${port}#[ss]_${address}`;
}

// ----------------------------------------- 解析和构建 trojan 节点 -----------------------------------------

function parse_tr0jan(outbounds_n) {
	let server = findFieldValue(outbounds_n, 'server') || '';
	if (server.startsWith('127.0.0.1') || server === '') {
		return '';
	}
	let port = findFieldValue(outbounds_n, 'port');
	let password = findFieldValue(outbounds_n, 'password');
	let network = findFieldValue(outbounds_n, 'network') || 'tcp';
	let path = findFieldValue(outbounds_n, 'path') || '';
	let host = findFieldValue(outbounds_n, 'Host') || findFieldValue(outbounds_n, 'host') || '';
	let sni = findFieldValue(outbounds_n, 'sni') || '';
	let fp = findFieldValue(outbounds_n, 'client-fingerprint') || findFieldValue(outbounds_n, 'fingerprint') || '';
	let alpn = findFieldValue(outbounds_n, 'alpn') || ''; // 没有确定字段是否这个名字
	let tls_security = '';
	if (sni) {
		tls_security = 'tls';
	}

	let tr0janDict = {
		security: tls_security,
		allowInsecure: 1,
		sni: sni,
		fp: fp,
		type: network,
		host: host,
		alpn: alpn,
		path: path,
	};

	// 过滤掉值为空的键值对
	const filteredParams = Object.fromEntries(
		Object.entries(tr0janDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
	);
	// 进行 URL 参数编码
	const encodedParams = new URLSearchParams(filteredParams).toString();

	return `${base64Decode('dHJvamFuOi8v')}${password}@${server}:${port}?${encodedParams}#[${base64Decode('dHJvamFu')}]_${server}`;
}

// ------------------------------------------ 解析和构建 tuic 节点 ------------------------------------------

function parse_tuic(outbounds_n) {
	let uuid = findFieldValue(outbounds_n, 'uuid');
	let password = findFieldValue(outbounds_n, 'password');
	let server = findFieldValue(outbounds_n, 'server') || '';
	if (server === '127.0.0.1' || server === '') {
		return '';
	}
	let port = findFieldValue(outbounds_n, 'port');
	let congestion_controller = findFieldValue(outbounds_n, 'congestion-controller');
	let udp_relay_mode = findFieldValue(outbounds_n, 'udp-relay-mode');
	let sni = findFieldValue(outbounds_n, 'sni') || '';
	let alpnValue = findFieldValue(outbounds_n, 'alpn');
	var alpn;
	if (alpnValue.length === 1) {
		// 如果数组只有一个元素，直接获取该元素
		alpn = alpnValue[0].toString();
	} else {
		// 如果数组有多个元素，使用逗号连接
		alpn = alpnValue.join(',');
	}
	let tuicDict = {
		congestion_control: congestion_controller,
		udp_relay_mode: udp_relay_mode,
		alpn: alpn,
		sni: sni,
		allow_insecure: 1,
	};
	// 过滤掉值为空的键值对
	const filteredParams = Object.fromEntries(
		Object.entries(tuicDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
	);
	// 进行 URL 参数编码
	const encodedParams = new URLSearchParams(filteredParams).toString();

	return `tuic://${uuid}:${password}@${server}:${port}?${encodedParams}#[tuic]_${server}`;
}

// ------------------------------------- 判断是否为mieru或juicity的代理 -------------------------------------

function isJuicity(jsonObject) {
	let juicity_listen = findFieldValue(jsonObject, 'listen');
	let juicity_server = findFieldValue(jsonObject, 'server');
	let juicity_uuid = findFieldValue(jsonObject, 'uuid');
	let juicity_password = findFieldValue(jsonObject, 'password');
	let juicity_sni = findFieldValue(jsonObject, 'sni');
	let juicity_allow_insecure = findFieldValue(jsonObject, 'allow_insecure');
	let juicity_congestion_control = findFieldValue(jsonObject, 'congestion_control');

	if (
		juicity_listen &&
		juicity_server &&
		juicity_uuid &&
		juicity_password &&
		juicity_sni &&
		juicity_allow_insecure &&
		juicity_congestion_control
	) {
		return true;
	} else {
		return false;
	}
}

function isMieru(jsonObject) {
	let mieru_exist_profiles = Array.isArray(findFieldValue(jsonObject, 'profiles'));
	let mieru_exist_portBindings = Array.isArray(findFieldValue(jsonObject, 'portBindings'));
	let mieru_ipAddress = findFieldValue(jsonObject, 'ipAddress');
	let mieru_rpcPort = findFieldValue(jsonObject, 'rpcPort');
	let mieru_activeProfile = findFieldValue(jsonObject, 'activeProfile');
	if (mieru_exist_profiles && mieru_exist_portBindings && mieru_ipAddress && mieru_rpcPort && mieru_activeProfile) {
		return true;
	} else {
		return false;
	}
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

		// 读取并返回文本内容，同时替换可能出现的"!<str>"字符
		let content = (await response.text()).replace(/!<str>/g, '');

		// 去掉HTML标签，包括HTML实体字符
		return stripHtmlTags(content);
	} catch (error) {
		console.error(`获取${url} 网页内容失败: ${error.message}`);
		return {};
	}
}

// 删除网页内容中多余的HTML标签
function stripHtmlTags(str) {
	const entities = {
		'&lt;': '<',
		'&gt;': '>',
		// .....
	};
	// 动态生成正则表达式，匹配所有实体
	const regex = new RegExp(
		'&(' +
			Object.keys(entities)
				.map((e) => e.slice(1, -1))
				.join('|') +
			');',
		'g'
	);
	// 替换HTML实体
	let replaced = str.replace(regex, (match) => entities[match]);
	// 去掉HTML标签
	return replaced.replace(/<[^>]*>/g, '');
}

// ---------------------------------- 去抓取网页、处理节点，返回节点的分享链接 ----------------------------------

async function fetchAndProcessUrl(url) {
	const content = await fetchWebPageContent(url);
	let jsonObject;
	let outbounds; // 可能是字段outbounds值的列表，也可能是字段proxies值的列表
	try {
		jsonObject = JSON.parse(content);
		outbounds = findFieldValue(jsonObject, 'outbounds');
	} catch (e) {
		let links = v2rayLinksHandle(content);
		if (links.length > 0) {
			// 存储多个节点链接
			const uniqueSet = new Set();
			// let proxyPrefix = ['hysteria://', 'hy2://', 'vless://', 'vmess://', 'trojan://', 'ss://', 'tuic://', 'naive+https://'];
			let proxyPrefix = [
				'aHlzdGVyaWE6Ly8',
				'aHkyOi8v',
				'dmxlc3M6Ly8',
				'dm1lc3M6Ly8',
				'dHJvamFuOi8v',
				'c3M6Ly8',
				'dHVpYzovLw',
				'bmFpdmUraHR0cHM6Ly8',
			];
			links.split('\n').forEach((link) => {
				if (proxyPrefix.some((prefix) => link.startsWith(base64Decode(prefix)))) uniqueSet.add(link);
			});
			// 转换为数组
			const uniqueArray = Array.from(uniqueSet);
			return uniqueArray;
		} else {
			let yamlObject = yaml.load(content); // 使用js-yaml库解析yaml
			if (yamlObject && typeof yamlObject === 'object') {
				outbounds = findFieldValue(yamlObject, 'proxies');
			}
		}
	}

	if (outbounds === null && jsonObject) {
		/** 处理一个节点 */

		// mieru
		let is_mieru = isMieru(jsonObject);
		if (is_mieru) return ''; // 丢弃

		// juicity
		let is_juicity = isJuicity(jsonObject);
		if (is_juicity) return ''; // 丢弃

		// hy2
		let server = findFieldValue(jsonObject, 'server')?.replace(/,.*$/, '') || ''; // 如果字符串中含有逗号，就删除逗号及其后面的字符
		let pwd_auth = findFieldValue(jsonObject, 'auth');
		let sni = findFieldValue(jsonObject, 'sni');

		let insecureFieldValue = findFieldValue(jsonObject, 'insecure');
		let insecure = [null, true].includes(insecureFieldValue) ? 1 : '';

		// hy1
		let upmbps = findFieldValue(jsonObject, 'up_mbps');
		let downmbps = findFieldValue(jsonObject, 'down_mbps');
		let obfsParam = findFieldValue(jsonObject, 'obfs') || '';
		let auth = findFieldValue(jsonObject, 'auth_str') || '';
		let protocol = findFieldValue(jsonObject, 'protocol') || '';
		let peer = findFieldValue(jsonObject, 'server_name') || '';
		let alpn = findFieldValue(jsonObject, 'alpn');
		let recv_window = findFieldValue(jsonObject, 'recv_window') || '';
		let recv_window_conn = findFieldValue(jsonObject, 'recv_window_conn') || '';

		// naive
		let proxyFieldValue = findFieldValue(jsonObject, 'proxy');

		// 使用正则表达式进行匹配naive配置文件中proxy中的值
		const pattern = /^https:\/\/.*@.*$/;
		const isMatch = pattern.test(proxyFieldValue);

		if (server && pwd_auth) {
			// 判断是hy2

			return `hy2://${pwd_auth}@${server}?insecure=${insecure}&sni=${sni}#[hy2]_${server}`;
		} else if (server && auth && alpn && upmbps !== null && downmbps !== null) {
			// 判断是hy1

			let hysteriaDict = {
				upmbps: upmbps,
				downmbps: downmbps,
				obfs: 'xplus',
				obfsParam: obfsParam,
				auth: auth,
				protocol: protocol,
				insecure: insecure,
				peer: peer,
				alpn: alpn,
				recv_window: recv_window,
				recv_window_conn: recv_window_conn,
			};
			// 没有对应的值，就从hysteriaDict中删除
			if (hysteriaDict['obfsParam'] === '') {
				delete hysteriaDict['obfs'];
			}
			// 过滤掉值为空的键值对
			const filteredParams = Object.fromEntries(
				Object.entries(hysteriaDict).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
			);
			// 进行 URL 参数编码
			const encodedParams = new URLSearchParams(filteredParams).toString();

			// hy1的节点链接
			return `${base64Decode('aHlzdGVyaWE6Ly8')}${server}?${encodedParams}#[hysteria]_${server}`;
		} else if (proxyFieldValue && isMatch && typeof proxyFieldValue === 'string') {
			// 判断是naive

			// 从右侧找到 ":" 和 "@" 的索引
			const colonIndex = proxyFieldValue.lastIndexOf(':');
			const atIndex = proxyFieldValue.lastIndexOf('@');
			// 截取 "@" 后到 ":" 之间的内容
			const extractedContent = proxyFieldValue.substring(atIndex + 1, colonIndex);

			return `naive+${proxyFieldValue}#[naive]_${extractedContent}`;
		}
	} else if (outbounds && Array.isArray(outbounds)) {
		/** 处理多个节点 */

		// 存储多个节点链接
		const uniqueSet = new Set();

		// let allProxyType = ['hysteria', 'hy2', 'vless', 'vmess', 'trojan', 'ss', 'tuic'];
		let allProxyType = ['aHlzdGVyaWE', 'aHky', 'dmxlc3M', 'dm1lc3M', 'dHJvamFu', 'c3M', 'dHVpYw'];
		// 遍历数组中的节点
		for (var i = 0; i < outbounds.length; i++) {
			let proxyType = findFieldValue(outbounds[i], 'protocol');
			if (!allProxyType.includes(proxyType)) {
				proxyType = findFieldValue(outbounds[i], 'type');
			}
			// 检查到是hysteria类型的节点
			if (proxyType === base64Decode('aHlzdGVyaWE')) {
				let hy1 = parse_hysteria(outbounds[i]);
				if (hy1) {
					uniqueSet.add(hy1);
				}
				// 检查到是hy2类型的节点
			} else if (proxyType === base64Decode('aHky')) {
				let hy2 = parse_hy2(outbounds[i]);
				if (hy2) {
					uniqueSet.add(hy2);
				}
				// 检查到是shadowsocks类型的节点
			} else if (proxyType === base64Decode('c3M')) {
				let ss = parse_shadowsocks(outbounds[i]);
				if (ss) {
					uniqueSet.add(ss);
				}
				// 检查到是vless类型的节点
			} else if (proxyType === base64Decode('dmxlc3M')) {
				let vle55 = parse_vle55(outbounds[i]);
				if (vle55) {
					uniqueSet.add(vle55);
				}
				// 检查到是vmess类型的节点
			} else if (proxyType === base64Decode('dm1lc3M')) {
				let vme55 = parse_vme55(outbounds[i]);
				if (vme55) {
					uniqueSet.add(vme55);
				}
				// 检查到是trojan类型的节点
			} else if (proxyType === base64Decode('dHJvamFu')) {
				let tr0jan = parse_tr0jan(outbounds[i]);
				if (tr0jan) {
					uniqueSet.add(tr0jan);
				}
				// 检查到是tuic类型的节点
			} else if (proxyType === base64Decode('dHVpYw')) {
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

// ----------------------------------------- base64编码与base64解码 ------------------------------------------
// base64编码
function base64Encode(str) {
	const encoder = new TextEncoder();
	const uint8Array = encoder.encode(str);
	const chunkSize = 0x8000; // 每个块的大小 (32768)
	let binary = '';

	// 分块处理，避免一次性展开整个数组导致调用栈溢出
	for (let i = 0; i < uint8Array.length; i += chunkSize) {
		const chunk = uint8Array.subarray(i, i + chunkSize);
		// 使用 Function.prototype.apply 将小块转换为字符串
		binary += String.fromCharCode.apply(null, chunk);
	}

	return btoa(binary);
}

// base64解码
function base64Decode(base64Str) {
	let binary = atob(base64Str);
	let bytes = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
	let decoder = new TextDecoder();
	return decoder.decode(bytes);
}

// 判断是否是有效的Base64编码字符串
function isValidBase64(str) {
	if (typeof str !== 'string') return false;

	str = str.trim();
	if (str === '') return false;

	// Base64正则匹配规则，确保格式正确
	const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
	if (!base64Regex.test(str)) return false;

	// 长度必须是4的倍数
	if (str.length % 4 !== 0) return false;

	try {
		// 尝试解码，确保不会报错
		const binaryStr = atob(str);
		new Uint8Array([...binaryStr].map((c) => c.charCodeAt(0)));
		return true;
	} catch (e) {
		return false;
	}
}

// ------------------------------- 抓取的网页内容是否为v2ray/nekoray分享链接？ -------------------------------

function v2rayLinksHandle(str) {
	let isBase64Str = isValidBase64(str);

	// let proxyPrefix = ['hysteria://', 'hy2://', 'vless://', 'vmess://', 'trojan://', 'ss://', 'tuic://', 'naive+https://'];
	let proxyPrefix = [
		'aHlzdGVyaWE6Ly8',
		'aHkyOi8v',
		'dmxlc3M6Ly8',
		'dm1lc3M6Ly8',
		'dHJvamFuOi8v',
		'c3M6Ly8',
		'dHVpYzovLw',
		'bmFpdmUraHR0cHM6Ly8',
	];
	// 粗略判断是否为明文分享链接，是则原字符串返回
	if (typeof str === 'string' && !isBase64Str && proxyPrefix.some((prefix) => str.includes(base64Decode(prefix)))) {
		return str;
	} else if (!isBase64Str) {
		return ''; // 不是有效的 Base64，直接返回空字符串
	}

	try {
		return base64Decode(str);
	} catch (e) {
		return ''; // 如果解码失败，也返回空字符串
	}
}

// -------------------------------------------- 要抓取的网页链接 --------------------------------------------

/**
 * 要抓取的网页，目标urls集，顺序随意，json、yaml、v2ray明文/base64加密的订阅数据都可以
 * 订阅地址的链接不能太多，容易出现"Error: Too many subrequests"错误，
 * 免费计划：每个 Worker 最多 50 个子请求（包括 fetch() 请求）
 * 付费计划：最多 1000 个子请求
 *
 * https://github.com/juerson/subscription_helper
 * 使用这个工具可以对订阅链接的内容比较，找出内容互不相同的链接，内容相同就选择其中的一个链接
 */
const targetUrls = [
	// ChromeGo/EdgeGo的订阅链接(已剔除内容重复的订阅链接)
	'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/backup/img/1/2/ipp/naiveproxy/2/config.json',
	'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/backup/img/1/2/ipp/hysteria2/2/config.json',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ipp/hysteria2/3/config.json',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ipp/naiveproxy/1/config.json',
	'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/backup/img/1/2/ipp/xray/2/config.json',
	'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/backup/img/1/2/ipp/xray/4/config.json',
	'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/backup/img/1/2/ip/singbox/2/config.json',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ipp/singbox/1/config.json',
	'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/backup/img/1/2/ipp/hysteria/2/config.json',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ipp/hysteria/3/config.json',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ipp/hysteria/1/config.json',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/backup/img/1/2/ipp/hysteria/3/config.json',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/backup/img/1/2/ip/singbox/config.json',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria/2/config.json',
	'https://gitlab.com/free9999/ipupdate/-/raw/master/hysteria2/2/config.json',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ipp/clash.meta2/5/config.yaml',
	'https://fastly.jsdelivr.net/gh/Alvin9999/PAC@latest/backup/img/1/2/ipp/clash.meta2/4/config.yaml',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ipp/clash.meta2/1/config.yaml',
	// 'https://fastly.jsdelivr.net/gh/jsvpn/jsproxy@dev/yule/20200325/1299699.md',
	'https://www.gitlabip.xyz/Alvin9999/PAC/master/backup/img/1/2/ip/clash.meta2/1/config.yaml',
	'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/quick/config.yaml',
	'https://fastly.jsdelivr.net/gh/Alvin9999/pac2@latest/quick/4/config.yaml',
	// 也可以添加其它来源且数据格式为json或yaml的订阅链接
	'https://raw.githubusercontent.com/aiboboxx/clashfree/main/clash.yml',
	// 可以添加明文v2ray分享链接的订阅或base64订阅链接
	'https://raw.githubusercontent.com/aiboboxx/v2rayfree/main/v2',
	'https://ghfast.top/https://raw.githubusercontent.com/free18/v2ray/refs/heads/main/v.txt',
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
				const executingPromise = promise.then(() => executing.splice(executing.indexOf(executingPromise), 1));
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
			link.forEach((item) => {
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
			let resultString = sortedArray.join('\n');
			let base64String = base64Encode(resultString);

			// 返回一个带有结果的响应
			return new Response(base64String, {
				status: 200,
				headers: {
					'Content-Type': 'text/plain; charset=UTF-8',
				},
			});
		} catch (error) {
			console.error(`Error in fetch function: ${error.message}`);
			// 返回一个带有错误信息的响应
			return new Response(`Error fetching web page: ${error.message}`, {
				status: 500,
			});
		}
	},
};
