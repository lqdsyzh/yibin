# 宜宾 · 个人作品集（yibin）

基于 GitHub Pages 的静态站点，线上地址：<https://lqdsyzh.github.io/yibin/>

## 目录结构

| 路径 | 内容 | 线上链接 |
|------|------|----------|
| `index.html` | 首页：魅力宜宾（深色主题） | `/yibin/` |
| `docs/liquan/index.html` | 李权的第二个作品 — 宜宾 | `/yibin/docs/liquan/` |
| `docs/liquan/todo/index.html` | 李权 — 待办清单 | `/yibin/docs/liquan/todo/` |
| `liuxiu-game/playable/index.html` | 《刘秀直招》可玩原型 | `/yibin/liuxiu-game/playable/` |
| `.github/workflows/static.yml` | Pages 部署工作流 | — |

## 命名约定

为保持线上链接稳定，已有路径不做重命名。后续新增作品请遵循：

- 统一使用小写英文与连字符（`kebab-case`），拼音/英文不要混用；
- 每个作品独立成目录，入口文件名统一为 `index.html`；
- 作品相关的 `styles.css`、`game.js`、`favicon.ico` 等资源与 `index.html` 放在同一目录，使用相对路径引用。

## 待完善（已知问题）

- `liuxiu-game/playable/index.html` 引用的 `styles.css`、`game.js` 当前缺失，页面样式/脚本未生效；
- `docs/liquan/index.html` 引用的 `/docs/liquan/favicon.ico` 当前缺失。
