import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
const DOMAIN = 0x0000;
const TAG = 'ZhenHuanHRD';
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        hilog.info(DOMAIN, TAG, 'Ability onCreate');
    }
    onDestroy(): void {
        hilog.info(DOMAIN, TAG, 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // 设置沉浸式全屏
        windowStage.getMainWindowSync().setWindowLayoutFullScreen(true);
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                hilog.error(DOMAIN, TAG, 'Failed to load content: %{public}s', JSON.stringify(err));
            }
        });
    }
    onWindowStageDestroy(): void { }
    onForeground(): void { }
    onBackground(): void { }
}
