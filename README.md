# 宜宾 · 个人作品集（yibin）

基于 GitHub Pages 的静态站点，线上地址：<https://lqdsyzh.github.io/yibin/>

## 目录结构

| 路径 | 内容 | 线上链接 |
|------|------|----------|
| `index.html` | 首页：魅力宜宾（深色主题） | `/yibin/` |
| `docs/liquan/index.html` | 李权的第二个作品 — 宜宾 | `/yibin/docs/liquan/` |
| `docs/liquan/todo/index.html` | 李权 — 待办清单 | `/yibin/docs/liquan/todo/` |
| `liuxiu-game/playable/index.html` | 《刘秀直招》可玩原型 | `/yibin/liuxiu-game/playable/` |
| `android-app/` | Android 封装工程（WebView 壳） | — |
| `.github/workflows/static.yml` | Pages 部署工作流 | — |

## 命名约定

为保持线上链接稳定，已有路径不做重命名。后续新增作品请遵循：

- 统一使用小写英文与连字符（`kebab-case`），拼音/英文不要混用；
- 每个作品独立成目录，入口文件名统一为 `index.html`；
- 作品相关的 `styles.css`、`game.js`、`favicon.ico` 等资源与 `index.html` 放在同一目录，使用相对路径引用。

## Android 封装

`android-app/` 是把本站封装为 Android 应用的工程：原生首页列出四个作品入口，点击后用 WebView 打开对应线上地址。

```bash
cd android-app
export ANDROID_HOME=/path/to/android-sdk
gradle :app:assembleRelease
# 产物：app/build/outputs/apk/release/app-release.apk
```

- `minSdk 26`，`targetSdk 34`，无第三方依赖；
- 签名密钥 `yibin-release.jks` 不入库（见 `android-app/.gitignore`），构建时通过 `YIBIN_KEYSTORE` 等环境变量指定；
- 签名方案 v2 + v3。

## 游戏说明

`liuxiu-game/playable/` 是《刘秀直招》的事件驱动策略原型：维护朝廷、士族、民望、军心、财政五项指标，
在舂陵起兵、昆阳之战、赤眉东来等历史节点间抉择，每回合给出选项并标注《后汉书》《资治通鉴》出处。
三档难度对应不同的初始数值与效果系数，结局按最终评鉴分（加权五项指标）分为五档。

## 待完善（已知问题）

- 无。
