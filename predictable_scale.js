// 选项卡切换功能
function initTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
          const tabId = button.dataset.tab;
          
          // 移除所有相关元素的active类
          document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
          document.querySelectorAll('.tab-pane').forEach(content => content.classList.remove('active'));
          
          // 添加active类
          button.classList.add('active');
          document.getElementById(tabId).classList.add('active');
      });
  });
}

// 表单提交事件
document.getElementById('modelForm').addEventListener('submit', function(e) {
  e.preventDefault();
  initTabs();
    
  // 默认显示第一个选项卡（确保只有一个active）
  document.querySelector('.tab-button').classList.add('active');
  document.querySelector('.tab-pane').classList.add('active');
  const modelSize = parseInt(document.getElementById('modelSize').value);
  const trainingTokens = parseInt(document.getElementById('trainingTokens').value);
  
  // 输入验证
  if (!modelSize || !trainingTokens) {
      showError("请填写所有必填字段");
      return;
  }
  
  if (modelSize <= 0 || trainingTokens <= 0) {
      showError("数值必须大于0");
      return;
  }

  // 计算逻辑
  const bs = calculateBS(modelSize, trainingTokens);
  const lr = calculateLR(modelSize, trainingTokens);

  // 显示结果
  document.getElementById('bsValue').textContent = `BS: ${formatNumber(bs)}`;
  document.getElementById('lrValue').textContent = `LR: ${lr.toExponential(2)}`;
});

// 计算BS的函数
function calculateBS(modelSize, tokens) {
  return Math.round(modelSize / 1e6 * tokens / 1e6 * 2);
}

// 计算LR的函数
function calculateLR(modelSize, tokens) {
  return 3e-4 * Math.sqrt(modelSize / 1e9) * Math.min(1, tokens / 1e9);
}

// 数字格式化
function formatNumber(num) {
  return num.toLocaleString();
}

// 错误提示
function showError(message) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<div class="error">⚠️ ${message}</div>`;
  setTimeout(() => {
      resultDiv.innerHTML = `<h3>计算结果</h3>
          <p id="bsValue">BS: -</p>
          <p id="lrValue">LR: -</p>`;
  }, 2000);
}
