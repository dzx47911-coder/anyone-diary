// 统一风格的图标集 - 手账/日记主题
// 粉色系 + 手绘风 + 圆润线条

export const iconSprite = `
<svg style="display:none">
  <!-- 首页 - 小房子带爱心 -->
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path fill="#FFB6C1" d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21z" opacity="0"/>
    <path fill="#FFB6C1" stroke="#E8A0B0" stroke-width="1" d="M10 20v-6h4v6"/>
    <path fill="#FFB6C1" stroke="#E8A0B0" stroke-width="1" d="M3 12l9-9 9 9"/>
    <circle fill="#FFB6C1" cx="12" cy="7" r="1.5"/>
  </symbol>

  <!-- 日历 - 手绘风格圆角 -->
  <symbol id="icon-calendar" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="3" fill="none" stroke="#FFB6C1" stroke-width="1.5"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="#FFB6C1" stroke-width="1.5"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="#FFB6C1" stroke-width="1.5"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="#FFB6C1" stroke-width="1.5"/>
    <circle cx="8" cy="15" r="1" fill="#E8A0B0"/>
    <circle cx="12" cy="15" r="1" fill="#E8A0B0"/>
    <circle cx="16" cy="15" r="1" fill="#E8A0B0"/>
  </symbol>

  <!-- 写日记/编辑 - 铅笔带蝴蝶结 -->
  <symbol id="icon-edit" viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="none" stroke="#E8A0B0" stroke-width="1.5"/>
    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="none" stroke="#FFB6C1" stroke-width="1.5"/>
    <circle cx="18" cy="6" r="2" fill="#FFE5A0" stroke="#E8A0B0" stroke-width="0.5"/>
  </symbol>

  <!-- 心情/爱心 -->
  <symbol id="icon-heart" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.5"/>
  </symbol>

  <!-- 星星/总结 -->
  <symbol id="icon-star" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFE5A0" stroke="#E8A0B0" stroke-width="0.5"/>
  </symbol>

  <!-- 花朵 -->
  <symbol id="icon-flower" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" fill="#D4B8E0" stroke="#E8A0B0" stroke-width="0.5"/>
    <ellipse cx="12" cy="6" rx="2.5" ry="3" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
    <ellipse cx="12" cy="18" rx="2.5" ry="3" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
    <ellipse cx="6" cy="12" rx="3" ry="2.5" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
    <ellipse cx="18" cy="12" rx="3" ry="2.5" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
    <ellipse cx="7.5" cy="7.5" rx="2.5" ry="2" transform="rotate(-45 7.5 7.5)" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
    <ellipse cx="16.5" cy="7.5" rx="2.5" ry="2" transform="rotate(45 16.5 7.5)" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
    <ellipse cx="7.5" cy="16.5" rx="2.5" ry="2" transform="rotate(45 7.5 16.5)" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
    <ellipse cx="16.5" cy="16.5" rx="2.5" ry="2" transform="rotate(-45 16.5 16.5)" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.3"/>
  </symbol>

  <!-- 书签 -->
  <symbol id="icon-bookmark" viewBox="0 0 24 24">
    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#A8D8B9" stroke="#E8A0B0" stroke-width="0.5"/>
  </symbol>

  <!-- 标签 -->
  <symbol id="icon-tag" viewBox="0 0 24 24">
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42z" fill="#FFE5A0" stroke="#E8A0B0" stroke-width="0.5"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
  </symbol>

  <!-- 右箭头 -->
  <symbol id="icon-arrow-right" viewBox="0 0 24 24">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="#FFB6C1"/>
    <circle cx="12" cy="12" r="10" fill="none" stroke="#FFB6C1" stroke-width="0.5" stroke-dasharray="2 2"/>
  </symbol>

  <!-- 左箭头 -->
  <symbol id="icon-arrow-left" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#FFB6C1"/>
    <circle cx="12" cy="12" r="10" fill="none" stroke="#FFB6C1" stroke-width="0.5" stroke-dasharray="2 2"/>
  </symbol>

  <!-- 关闭 -->
  <symbol id="icon-close" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="none" stroke="#E8A0B0" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="10" fill="none" stroke="#FFB6C1" stroke-width="0.5" stroke-dasharray="2 2"/>
  </symbol>

  <!-- 加号 -->
  <symbol id="icon-plus" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#FFB6C1"/>
    <circle cx="12" cy="12" r="10" fill="none" stroke="#FFB6C1" stroke-width="0.5" stroke-dasharray="2 2"/>
  </symbol>

  <!-- 勾选 -->
  <symbol id="icon-check" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#A8D8B9" stroke="#E8A0B0" stroke-width="0.5"/>
  </symbol>

  <!-- 相机/拍照 - 用于宝丽来效果 -->
  <symbol id="icon-camera" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="#FFB6C1" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="#E8A0B0" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="2" fill="#FFE5A0"/>
    <rect x="15" y="7" width="3" height="2" rx="0.5" fill="#FFB6C1"/>
  </symbol>

  <!-- 统计/图表 -->
  <symbol id="icon-chart" viewBox="0 0 24 24">
    <rect x="3" y="14" width="4" height="7" rx="1" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.5"/>
    <rect x="10" y="10" width="4" height="11" rx="1" fill="#A8D8B9" stroke="#E8A0B0" stroke-width="0.5"/>
    <rect x="17" y="6" width="4" height="15" rx="1" fill="#D4B8E0" stroke="#E8A0B0" stroke-width="0.5"/>
    <line x1="2" y1="21" x2="22" y2="21" stroke="#E8A0B0" stroke-width="0.5"/>
  </symbol>

  <!-- 日记本 -->
  <symbol id="icon-notebook" viewBox="0 0 24 24">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="none" stroke="#FFB6C1" stroke-width="1.5"/>
    <path d="M6 2v20" stroke="#E8A0B0" stroke-width="2"/>
    <line x1="10" y1="8" x2="16" y2="8" stroke="#FFE5A0" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="10" y1="12" x2="16" y2="12" stroke="#FFE5A0" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="10" y1="16" x2="14" y2="16" stroke="#FFE5A0" stroke-width="1.5" stroke-linecap="round"/>
  </symbol>

  <!-- 胶带 -->
  <symbol id="icon-tape" viewBox="0 0 24 24">
    <rect x="2" y="8" width="20" height="8" rx="1" fill="#FFE5A0" stroke="#E8A0B0" stroke-width="0.5"/>
    <line x1="6" y1="8" x2="6" y2="16" stroke="#E8A0B0" stroke-width="0.3" opacity="0.5"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke="#E8A0B0" stroke-width="0.3" opacity="0.5"/>
    <line x1="18" y1="8" x2="18" y2="16" stroke="#E8A0B0" stroke-width="0.3" opacity="0.5"/>
  </symbol>

  <!-- 图钉/别针 -->
  <symbol id="icon-pin" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" fill="#FFB6C1" stroke="#E8A0B0" stroke-width="0.5"/>
    <path d="M12 12 L12 20" stroke="#E8A0B0" stroke-width="1.5"/>
    <circle cx="12" cy="8" r="1.5" fill="white"/>
  </symbol>

  <!-- 月份/日历装饰 -->
  <symbol id="icon-month" viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="#FFB6C1" stroke-width="1.5"/>
    <line x1="4" y1="9" x2="20" y2="9" stroke="#FFB6C1" stroke-width="1"/>
    <circle cx="8" cy="6" r="1" fill="#E8A0B0"/>
    <circle cx="12" cy="6" r="1" fill="#E8A0B0"/>
    <circle cx="16" cy="6" r="1" fill="#E8A0B0"/>
    <text x="12" y="16" text-anchor="middle" font-size="8" fill="#E8A0B0" font-family="sans-serif">📅</text>
  </symbol>

  <!-- 搜索/放大镜 -->
  <symbol id="icon-search" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" fill="none" stroke="#FFB6C1" stroke-width="1.5"/>
    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#E8A0B0" stroke-width="2" stroke-linecap="round"/>
    <circle cx="11" cy="11" r="3" fill="#FFE5A0" opacity="0.3"/>
  </symbol>
</svg>
`

export const iconNames = [
  'home', 'calendar', 'edit', 'heart', 'star', 'flower',
  'bookmark', 'tag', 'arrow-right', 'arrow-left',
  'close', 'plus', 'check', 'camera', 'chart',
  'notebook', 'tape', 'pin', 'month', 'search'
]