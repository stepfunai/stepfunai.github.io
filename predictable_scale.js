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

// 初始化可视化功能
function initVisualization() {
  const generateBtn = document.getElementById('generateBtn');
  const vizContainer = document.getElementById('visualization');

  generateBtn.addEventListener('click', () => {
      // 获取选择的值
      const modelType = document.getElementById('modelType').value;
      const nValue = document.getElementById('nValue').value;
      const dValue = document.getElementById('dValue').value;

      // 清除旧图表
      vizContainer.innerHTML = '';

      // 创建新图表容器
      const canvas = document.createElement('div');
      canvas.className = 'generated-graph';
      canvas.innerHTML = `
          <div class="graph-label" style="top: 20px; left: 20px">类型: ${modelType}</div>
          <div class="graph-label" style="top: 20px; right: 20px">N=${nValue}</div>
          <div class="graph-label" style="bottom: 20px; left: 20px">D=${dValue}</div>
      `;

      // 添加动态可视化效果
      const baseColor = modelType === 'moe' ? '#1a73e8' : '#e81a4f';
      const visual = document.createElement('div');
      visual.style.width = '100%';
      visual.style.height = '100%';
      visual.style.position = 'relative';
      
      // 创建动态图形（示例使用CSS实现）
      for(let i = 0; i < nValue / 10; i++) {
          const element = document.createElement('div');
          element.style.position = 'absolute';
          element.style.width = `${dValue / 2}%`;
          element.style.height = `${dValue / 2}%`;
          element.style.background = baseColor;
          element.style.opacity = '0.6';
          element.style.borderRadius = '4px';
          element.style.left = `${Math.random() * 90}%`;
          element.style.top = `${Math.random() * 90}%`;
          element.style.animation = `float ${Math.random() * 3 + 2}s infinite`;
          visual.appendChild(element);
      }

      canvas.appendChild(visual);
      vizContainer.appendChild(canvas);

      // 添加浮动动画
      const style = document.createElement('style');
      style.textContent = `
          @keyframes float {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(5px, 5px); }
              50% { transform: translate(-5px, 10px); }
              75% { transform: translate(10px, -5px); }
          }
      `;
      document.head.appendChild(style);
  });
}


// 表单提交事件
document.getElementById('modelForm').addEventListener('submit', function(e) {
  e.preventDefault();
  initTabs();
  initVisualization();

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

