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

// 计算 BS 和 LR
document.getElementById('modelForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const modelSize = parseInt(document.getElementById('modelSize').value);
  const trainingTokens = parseInt(document.getElementById('trainingTokens').value);

  if (isNaN(modelSize) || isNaN(trainingTokens)) {
      alert("请输入有效的数字！");
      return;
  }

  // 模拟计算逻辑（实际计算可以由后端提供）
  const bs = modelSize * 0.1 + trainingTokens * 0.005; // 示例计算公式
  const lr = modelSize * 0.0001 + trainingTokens * 0.00001; // 示例计算公式

  // 显示计算结果
  document.getElementById('bsValue').textContent = `BS: ${bs.toFixed(2)}`;
  document.getElementById('lrValue').textContent = `LR: ${lr.toFixed(6)}`;
});
