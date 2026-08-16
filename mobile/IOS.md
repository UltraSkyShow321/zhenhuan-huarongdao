# iOS / iPadOS 原生版构建指南

网页版（PWA）在 iPhone / iPad 上**无需安装任何东西**即可使用：
Safari 打开在线地址 → 分享 → 「添加到主屏幕」→ 全屏运行、支持离线。

如果需要真正的原生 App（上架 TestFlight / App Store，或长期签名安装），按下述步骤操作。
**前提：一台 Mac + Xcode 15+ + Apple ID**（免费 Apple ID 可 sideload 到自己的设备，签名 7 天有效；
付费开发者账号 $99/年 可长期使用并上架）。

## 构建步骤（Capacitor 方式，约 10 分钟）

1. 把仓库克隆到 Mac：
   ```bash
   git clone https://github.com/UltraSkyShow321/zhenhuan-huarongdao.git
   cd zhenhuan-huarongdao/mobile
   npm install
   ```
2. 准备 Web 资源（与 Android 相同）：
   ```bash
   mkdir -p www/icons
   cp ../index.html ../version.js ../manifest.webmanifest ../sw.js www/
   cp ../icons/icon-192.png ../icons/icon-512.png ../icons/apple-touch-icon.png www/icons/
   ```
3. 添加 iOS 平台（自动生成 Xcode 工程）：
   ```bash
   npx cap add ios
   npx cap sync ios
   ```
4. 用 Xcode 打开：`open ios/App/App.xcworkspace`
5. 选择你的开发团队（Signing & Capabilities → Team 选自己的 Apple ID，
   首次会自动生成签名）
6. 连接 iPhone/iPad（或选模拟器），点 Run ▶ 构建安装

## 常见问题

- **免费 Apple ID 限制**：每 7 天需重新连线 Xcode 运行一次；最多 3 个 App；不能上架
- **上架 App Store**：需付费账号，在 App Store Connect 创建 App 后 Archive → Upload；
  审核时说明这是滑块益智游戏（无账号系统、无付费）
- **iPad 适配**：游戏已做响应式，竖屏/横屏均可正常游玩
- **图标/名称**：`ios/App/App/Assets.xcassets` 替换图标；显示名在 `Info.plist` 的 CFBundleDisplayName

## 与 Android 流程的差异

| | Android | iOS |
| --- | --- | --- |
| 构建机 | 任意（CI 可自动） | 必须 Mac + Xcode |
| 账号 | 无需（APK 免签分发） | Apple ID 必需 |
| 分发 | 直接发 APK | sideload / TestFlight / App Store |
