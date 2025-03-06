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

// 依赖关系配置
const dependencies = {
  Dense: {
    N: {
      "214663680": ["4000000000", "11400000000", "20000000000", "100000000000"],
      "268304384": ["5000000000", "14200000000", "25000000000", "80000000000"],
      "429260800": ["8000000000", "22700000000", "40000000000", "50000000000"],
      "536872960": ["10000000000", "28400000000", "50000000000"],
      "1073741824": ["20000000000", "56900000000", "100000000000"]
    }
  },
  Moe: {
    N: {
      "2150612992": {
        Na: {
          "187973632": ["2000000000", "4000000000", "8000000000", "20000000000"],
          "232579072": ["2000000000", "4000000000", "8000000000", "20000000000"]
        }
      },
      "2155174912": {
        Na: {
          "590436352": ["2000000000", "4000000000", "8000000000", "20000000000"]
        }
      },
      "2156188672": {
        Na: {
          "1241270272": ["2000000000", "4000000000", "8000000000", "20000000000"]
        }
      }
    }
  }
};

// 新增级联选择逻辑
function initDependentSelects() {
  const modelType = document.getElementById('modelType');
  const nValue = document.getElementById('nValue');
  const naValue = document.getElementById('naValue');
  const dValue = document.getElementById('dValue');

  function updateNOptions() {
    const type = modelType.value;
    nValue.innerHTML = '';
  
    // 重置相关选项
    naValue.innerHTML = '';
    dValue.innerHTML = '';
  
    const options = type === 'Dense' 
      ? Object.keys(dependencies.Dense.N) 
      : Object.keys(dependencies.Moe.N);
  
    options.forEach(val => {
      const option = document.createElement('option');
      option.value = val;
      option.textContent = val;
      nValue.appendChild(option);
    });
  
    // 设置默认值并触发更新
    nValue.value = options[0] || '';
    nValue.dispatchEvent(new Event('change'));
  }

  // 增强选项更新逻辑
  function updateNaOptions() {
    const type = modelType.value;
    const nVal = nValue.value;
    naValue.innerHTML = '';

    if (type === 'Moe') {
      document.getElementById('naItem').style.display = 'block';
      const naOptions = Object.keys(dependencies.Moe.N[nVal].Na);
      naOptions.forEach(val => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = val;
        naValue.appendChild(option);
      });
      // 设置默认选中项
      naValue.value = naOptions[0] || '';
      naValue.dispatchEvent(new Event('change'));
    } else {
      document.getElementById('naItem').style.display = 'none';
      // 清除残留值
      naValue.value = '';
    }
  }

  function updateDOptions() {
    const type = modelType.value;
    dValue.innerHTML = '';
  
    let options = [];
    if (type === 'Dense') {
      options = dependencies.Dense.N[nValue.value];
    } else {
      options = dependencies.Moe.N[nValue.value].Na[naValue.value];
    }
  
    options.forEach(val => {
      const option = document.createElement('option');
      option.value = val;
      option.textContent = val;
      dValue.appendChild(option);
    });
  }

  modelType.addEventListener('change', updateNOptions);
  nValue.addEventListener('change', () => {
    modelType.value === 'Moe' ? updateNaOptions() : updateDOptions();
  });
  naValue.addEventListener('change', updateDOptions);

  updateNOptions();
}

// 初始化可视化功能
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
      let fileName;
      if (modelType === 'Dense') {
        fileName = `heatmap_N${nValue}_D${dValue}.pdf`;
      } else {
        const naValue = document.getElementById('naValue').value;
        fileName = `heatmap_N${nValue}_D${dValue}_Na${naValue}.pdf`;
      }
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
  initDependentSelects();
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
  // const modelSize = parseInt(document.getElementById('modelSize').value);
  // const trainingTokens = parseInt(document.getElementById('trainingTokens').value);
  
    // 获取原始输入值
    const modelSizeInput = document.getElementById('modelSize').value;
    const trainingTokensInput = document.getElementById('trainingTokens').value;
  
    // 预处理输入：移除逗号并转换科学计数法
    const preprocessInput = (str) => {
      return str.replace(/,/g, '').replace(/×10\^?/g, 'e'); // 兼容中文乘号
    };
  
    // 解析数值
    const parseNumber = (str) => {
      const cleaned = preprocessInput(str);
      return Number(cleaned);
    };
  
    // 验证预处理后的输入
    const isValidFormat = (str) => {
      return /^[+-]?\d*\.?\d+([eE][+-]?\d+)?$/.test(preprocessInput(str));
    };
  
    // 输入验证
    if (!isValidFormat(modelSizeInput) || !isValidFormat(trainingTokensInput)) {
      showError("格式错误：支持示例 1e8, 250000, 3.5×10^6");
      return;
    } 
  
    const modelSize = parseNumber(modelSizeInput);
    const trainingTokens = parseNumber(trainingTokensInput);
  
    if (isNaN(modelSize) || isNaN(trainingTokens) || modelSize <= 0 || trainingTokens <= 0) {
      showError("请输入有效的正数");
      return;
    }
  
    // 执行计算
    const { batchSize, learningRate } = calculateBsLr(modelSize, trainingTokens);
  
  // 显示结果
  document.getElementById('bsValue').textContent = `BS: ${formatLargeNumber(batchSize)}`;
  document.getElementById('lrValue').textContent = `LR: ${formatSmallNumber(learningRate)}`;
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
function formatLargeNumber(num) {
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  return num.toLocaleString();
}

function formatSmallNumber(num) {
  if (num < 0.001) {
    return num.toExponential(2).replace('e-', '×10⁻');
  }
  return num.toFixed(6).replace(/\.?0+$/, '');
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


