import { webview } from '@kit.ArkWeb';
import { common } from '@kit.AbilityKit';

// 深宫华容道：ArkWeb 加载本地打包的游戏页面
@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;

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

  // 系统返回手势：游戏内 → 回菜单；菜单 → 退出应用（由页面 __hrdBack 决定）
  onBackPress(): boolean {
    this.controller.runJavaScript('window.__hrdBack ? window.__hrdBack() : "exit"')
      .then((result: string) => {
        if (result === 'exit' || result === 'undefined' || result === undefined) {
          this.context.terminateSelf();
        }
      })
      .catch(() => {
        this.context.terminateSelf();
      });
    return true;
  }
}
