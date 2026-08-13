import { webview } from '@kit.ArkWeb';

// 深宫华容道：ArkWeb 加载本地打包的游戏页面
@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();

  build() {
    Column() {
      Web({ src: $rawfile('index.html'), controller: this.controller })
        .width('100%')
        .height('100%')
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .fileAccess(true)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#200a08')
  }
}
