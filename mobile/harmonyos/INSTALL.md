# 鸿蒙 5.0 及以上 · 详细安装指南

本指南把「深宫华容道」装到你的鸿蒙手机（HarmonyOS 5.0 / 6.0+），全程约 10 分钟。
前提：已安装 **DevEco Studio**（本机位于 `D:\DevEco Studio`，版本 6.1.1）。

---

## 第 1 步：注册华为开发者账号（只需一次，用于自动签名）

1. 打开 https://developer.huawei.com/consumer/cn/ ，点右上角「注册」（个人账号免费）
2. 手机号注册，完成实名认证
3. 记下账号密码，第 4 步登录 DevEco 要用

## 第 2 步：打开游戏工程

1. 启动 DevEco Studio（开始菜单搜索 DevEco Studio，或双击 `D:\DevEco Studio\bin\devecostudio64.exe`）
2. 首次启动若提示导入设置，直接点 OK 跳过
3. **File → Open…**，选择工程目录：`D:\ZCProjects\zhenhuan-huarongdao\mobile\harmonyos`，点 OK
4. 若弹出「工程版本升级」提示（SDK 版本迁移），点 **Migrate/自动迁移**，等右下角进度条走完
5. 首次打开会自动下载依赖（右下角显示 Gradle/hvigor 同步中），等它完成（几分钟）

> 打开成功后左侧项目树应能看到 `entry` 模块和 `AppScope`。

## 第 3 步：配置自动签名（关键）

1. 菜单 **File → Project Structure…**（或顶部工具栏 ⚙ 图标）
2. 左侧选 **Signing Configs**
3. 勾选 **Automatically generate certificate**（自动生成证书）
4. 若提示登录：点 Sign in 登录第 1 步注册的华为账号 → 同意授权
5. 登录后会自动生成：Signing Cert、Profile、Keystore 三行信息
6. 点 **OK** 关闭窗口，等底部提示 "Sync" 完成

> 完成后 `build-profile.json5` 里会出现签名配置，工程即可构建出可安装的 HAP。

## 第 4 步：手机开启开发者模式并连接

在鸿蒙手机上操作：

1. **设置 → 关于手机** → 连续点击「版本号」7 次 → 提示"已进入开发者模式"
2. **设置 → 系统与更新 → 开发者选项**：
   - 打开 **USB 调试**
   - （可选）USB 配置选「传输文件」
3. USB 数据线连接电脑
4. 手机弹出「允许 USB 调试吗？」→ 勾选"始终允许" → 确定

## 第 5 步：一键安装到手机

1. 回到 DevEco Studio，工具栏右上角设备下拉框应能看到你的手机型号
2. 点击绿色 ▶ **Run** 按钮（或菜单 Run → Run 'entry'）
3. 首次构建约 1-3 分钟，然后自动安装并启动游戏 🎉

手机上看到「深宫华容道」图标即安装成功。

## 第 6 步：分享给其他鸿蒙手机（可选）

1. 菜单 **Build → Build Hap(s)/APP(s) → Build Hap(s)**（仅构建，不安装）
2. 构建产物在：`mobile\harmonyos\entry\build\default\outputs\default\entry-default-signed.hap`
3. 把这个 `.hap` 文件发给朋友（微信/网盘均可）
4. 对方手机上点击该文件 → 系统提示安装 → 允许「安装未知来源应用」→ 安装完成

> 注意：发给别人的 HAP 用你自己的调试证书签名，对方手机需开启「安装未知来源」。正式分发给大众需在 AppGallery Connect 申请签名证书与上架（免费个人账号即可申请，流程见华为开发者文档）。

---

## 常见问题

| 现象 | 解决 |
| ---- | ---- |
| Run 列表里没有手机 | 检查 USB 线（要能传数据的线）、手机 USB 调试是否打开、手机上授权弹窗是否点了允许；换一个 USB 口 |
| 提示 "signingConfig not found" | 重做第 3 步，勾选自动签名并等待 Sync 完成 |
| 提示设备与签名不匹配 | File → Project Structure → Signing Configs 重新生成证书 |
| 安装时报版本签名冲突 | 手机上先卸载旧版本再安装 |
| 打开游戏是空白页 | 游戏文件在 `entry\src\main\resources\rawfile\`，确认 index.html 等文件存在；修改过游戏内容后运行 `sync-game.bat` 再重新构建 |
| 构建报错 SDK 版本 | File → Project Structure → SDK Location：确认 HarmonyOS SDK 已安装（DevEco 首次启动引导安装，可在 SDK Manager 里补装 API 12+） |
| 没有真机 | 用 DevEco 自带模拟器：Tools → Device Manager → 创建手机模拟器（需登录账号） |

## 以后更新游戏内容

修改根目录的游戏文件（index.html 等）后：
1. 双击 `mobile\harmonyos\sync-game.bat` 同步到工程
2. DevEco 里重新点 Run（或 Build Hap(s)）
即可发布新版。
