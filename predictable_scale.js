// 更新后的JavaScript
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
  });
});

document.getElementById('modelForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const modelSize = parseFloat(document.getElementById('modelSize').value);
  const trainingTokens = parseFloat(document.getElementById('trainingTokens').value);

  // 输入验证
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
      if (!input.value || isNaN(input.value)) {
          input.parentElement.classList.add('invalid');
      } else {
          input.parentElement.classList.remove('invalid');
      }
  });

  if ([modelSize, trainingTokens].some(isNaN)) {
      document.getElementById('result').innerHTML = `
          <div class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              请输入有效的数字！
          </div>
      `;
      return;
  }

  // 改进的计算公式（示例）
  const bs = (modelSize * 0.12 + trainingTokens * 0.0005).toFixed(2);
  const lr = (0.0002 * Math.log(modelSize) + 0.000001 * Math.sqrt(trainingTokens)).toFixed(6);

  // 动态生成结果
  document.getElementById('result').innerHTML = `
      <h3>计算结果：</h3>
      <div class="result-item">
          <span>BS (Batch Size):</span>
          <span class="result-value">${bs}</span>
      </div>
      <div class="result-item">
          <span>LR (Learning Rate):</span>
          <span class="result-value">${lr}</span>
      </div>
  `;
});

// 输入验证实时反馈
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
      input.parentElement.classList.toggle('invalid', !input.value || isNaN(input.value));
  });
});