# 鸿蒙（HarmonyOS 6.0+）原生版构建指南

`mobile/harmonyos/` 是完整的 HarmonyOS NEXT 原生工程（Stage 模型，ArkTS + ArkWeb），
以系统 Web 组件加载本地打包的游戏页面，体验与原生 App 一致（全屏、桌面图标、独立进程）。

> 为什么没有现成的 HAP 下载包？
> HarmonyOS 应用的构建工具链（DevEco Studio / hvigor / SDK）由华为官方提供且需登录开发者账号获取，
> 无法在第三方 CI 上自动构建。但用 DevEco Studio 构建只需 **5 分钟**，步骤如下。

## 环境要求

| 项 | 要求 |
| --- | --- |
| 电脑 | Windows 或 macOS（均可） |
| 工具 | [DevEco Studio 5.0+](https://developer.huawei.com/consumer/cn/deveco-studio/)（免费下载） |
| 账号 | 华为开发者账号（免费注册，用于自动签名） |
| 手机 | HarmonyOS 5.0 / 6.0+ 手机，开启「开发者模式 + USB 调试」 |

## 构建安装步骤

1. **安装 DevEco Studio**：下载安装包 → 首次启动按引导安装 HarmonyOS SDK（勾选 API 12+）
2. **登录**：DevEco Studio 右上角登录华为开发者账号（个人账号免费）
3. **打开工程**：File → Open → 选择 `mobile/harmonyos/` 目录
4. **自动签名**：File → Project Structure → Signing Configs → 勾选 Automatically generate certificate
   （首次会引导登录并生成个人调试证书，全程自动）
5. **连接手机**：USB 连接鸿蒙手机，开启「开发者模式 → USB 调试」
6. **构建并安装**：点 Run ▶（或 Build → Build Hap(s)/APP(s)），自动编译并安装到手机

构建产物在 `entry/build/default/outputs/default/` 下，`.hap` 包可直接分享给其他鸿蒙设备
（对方在「文件管理」中点击即可安装；也可用 `hdc install xxx.hap` 命令安装）。

## 修改游戏内容后

游戏页面已打包进工程（`entry/src/main/resources/rawfile/`）。修改根目录的游戏文件后，
运行 `sync-game.bat`（Windows）同步，或手动复制 `index.html / manifest.webmanifest / sw.js / icons/`
到 rawfile 目录，然后重新构建。

## 常见问题

- **构建报错 SDK 版本**：File → Project Structure → SDK 页安装对应 API 12+ SDK
- **安装提示签名不一致**：在 Signing Configs 里重新勾选自动签名
- **手机上打开是空白页**：确认 `sync-game.bat` 已同步最新游戏文件（rawfile 内容完整）
- **没有鸿蒙真机**：DevEco Studio 自带模拟器（Device Manager → 创建手机模拟器）可预览
