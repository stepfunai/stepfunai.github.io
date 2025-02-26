// Tab切换功能
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      
      // 移除所有按钮的激活状态
      document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
      });
      
      // 隐藏所有内容区域
      document.querySelectorAll('.tab-pane').forEach(content => {
          content.classList.remove('active');
      });

      // 激活当前按钮和内容
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
  });
});
