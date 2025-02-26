document.addEventListener('DOMContentLoaded', () => {
  // 获取所有 Tab 按钮和 Tab 内容
  const buttons = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');

  // 添加事件监听器以切换 Tab
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按钮的 active 类
      buttons.forEach(btn => btn.classList.remove('active'));
      // 隐藏所有内容
      panels.forEach(panel => panel.classList.remove('active'));
      
      // 激活当前点击的按钮
      button.classList.add('active');
      
      // 显示对应的 Tab 内容
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
});
