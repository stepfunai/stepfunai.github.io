// 选项卡切换功能
function initTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;

      // 移除所有active状态
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(content => content.classList.remove('active'));

      // 设置当前激活状态
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// 初始化可视化功能
// scripts.js 修改后的可视化功能
function initVisualization() {
  const generateBtn = document.getElementById('generateBtn');
  const vizContainer = document.getElementById('visualization');

  generateBtn.addEventListener('click', () => {
      // 获取参数值
      const modelType = document.getElementById('modelType').value;
      const nValue = document.getElementById('nValue').value;
      const dValue = document.getElementById('dValue').value;

      // 清除旧内容
      vizContainer.innerHTML = '';

      // 创建PDF容器
      const container = document.createElement('div');
      container.className = 'generated-pdf-container';
    
      // 生成文件名（根据实际文件命名规则调整）
      const fileName = `${modelType}_n${nValue}_d${dValue}.pdf`;
      // const fileName = `logo.png`
      const pdfPath = `figures/${fileName}`;

      // 创建PDF展示元素
      const embed = document.createElement('embed');
      embed.className = 'generated-pdf';
      embed.setAttribute('src', pdfPath);
      embed.setAttribute('type', 'application/pdf');
      embed.setAttribute('width', '100%');
      embed.setAttribute('height', '100%');

      // 错误处理
      const errorMsg = document.createElement('div');
      errorMsg.className = 'pdf-error';
      errorMsg.style.display = 'none';
      errorMsg.textContent = `文件 ${fileName} 加载失败，请检查参数组合`;

      // 加载状态
      const loading = document.createElement('div');
      loading.className = 'pdf-loading';
      loading.textContent = '正在加载可视化文件...';
      container.appendChild(loading);

      // 检测PDF加载状态
      embed.onload = () => {
          loading.style.display = 'none';
          errorMsg.style.display = 'none';
      };
      embed.onerror = () => {
          loading.style.display = 'none';
          errorMsg.style.display = 'block';
      };

      container.appendChild(embed);
      container.appendChild(errorMsg);
      vizContainer.appendChild(container);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();          // 只需初始化一次
  initVisualization();

  // 设置默认激活状态（仅在初次加载时）
  if (!document.querySelector('.tab-button.active')) {
    document.querySelector('.tab-button').classList.add('active');
    document.querySelector('.tab-pane').classList.add('active');
  }
});


// 表单提交事件
document.getElementById('modelForm').addEventListener('submit', function(e) {
  e.preventDefault();
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

  // 计算结果
  const { batchSize, learningRate } = calculateBsLr(modelSize, trainingTokens);

  // 显示结果
  document.getElementById('bsValue').textContent = `BS: ${formatNumber(batchSize)} tokens`;
  document.getElementById('lrValue').textContent = `LR: ${learningRate.toExponential(2)}`;
});

function calculateBsLr(modelSize, trainingTokens) {
    /**
     * 根据模型参数量和训练token量计算批次大小和学习率
     * 公式：
     * log(bs) = 2.187 - 0.1636*ln(modelSize) + 0.592*ln(trainingTokens)
     * log(lr) = 0.5863 - 0.7129*ln(modelSize) + 0.3075*ln(trainingTokens)
     */
    const logBs = 2.187 
        - 0.1636 * Math.log(modelSize) 
        + 0.592 * Math.log(trainingTokens);
    
    const logLr = 0.5863 
        - 0.7129 * Math.log(modelSize) 
        + 0.3075 * Math.log(trainingTokens);

    return {
        batchSize: Math.exp(logBs),
        learningRate: Math.exp(logLr)
    };
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


