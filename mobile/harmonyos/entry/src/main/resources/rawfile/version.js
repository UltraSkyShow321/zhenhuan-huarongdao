// 应用版本单一来源：index.html（SW 注册参数）与 sw.js（缓存名）均从此读取。
// 每次发布新版本改这里即可，旧缓存会自动失效。
var APP_VERSION = '1.3.0';
if (typeof window !== 'undefined') window.APP_VERSION = APP_VERSION;
