import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
import os

def truncated_viridis(minval=0.0, maxval=0.9):
    """
    从 viridis 中截取 [minval, maxval] 范围的颜色段，
    返回一个新的 Colormap。
    """
    base_cmap = plt.cm.get_cmap('viridis')
    colors = base_cmap(np.linspace(minval, maxval, 256))
    return LinearSegmentedColormap.from_list('trunc_viridis', colors)

def draw_heatmaps(csv_file):
    # 1. 读入 DataFrame
    df = pd.read_csv(csv_file)
    
    # 2. 分组：现在使用 (N, D, Na) 分组，而不是原先的 (N, D)
    grouped = df.groupby(['N', 'D', 'Na'])

    # 3. 针对每个分组绘制热力图
    for (n_val, d_val, na_val), group in grouped:
        # （1）生成 pivot_table，行=bs，列=lr，值=smooth loss
        pivot_table = group.pivot(index='bs', columns='lr', values='smooth loss')
        pivot_table = pivot_table.sort_index(axis=0)
        pivot_table = pivot_table.reindex(sorted(pivot_table.columns), axis=1)

        # （2）删除大于3.5的值，去除全空列
        pivot_table = pivot_table.mask(pivot_table > 3.5)
        pivot_table.dropna(axis=1, how='all', inplace=True)

        # （3）计算 vmin, vmax
        arr = pivot_table.values.flatten()
        arr = arr[~np.isnan(arr)]
        if len(arr) == 0:
            print(f"N={n_val}, D={d_val}, Na={na_val}: 全是 NaN，跳过")
            continue
        elif len(arr) < 3:
            arr_sorted = np.sort(arr)
            vmin_val = arr_sorted[0]
            vmax_val = arr_sorted[-1]
        else:
            arr_sorted = np.sort(arr)
            vmin_val = arr_sorted[0]
            vmax_val = arr_sorted[-3]

        # （4）创建图与自定义调色板
        plt.figure(figsize=(8, 6))
        new_cmap = truncated_viridis(minval=0.1, maxval=0.6)

        # （5）绘制热力图
        ax = sns.heatmap(
            pivot_table,
            annot=True,
            fmt=".4f",
            cmap=new_cmap,
            vmin=vmin_val,
            vmax=vmax_val,
            annot_kws={"fontsize": 8}
        )

        # （6）自定义 y 轴刻度：乘以 2048，横排显示
        bs_values = pivot_table.index  
        ytick_positions = np.arange(len(bs_values)) + 0.5
        ytick_labels = [f"{int(val * 2048)}" for val in bs_values]
        ax.set_yticks(ytick_positions)
        ax.set_yticklabels(ytick_labels, rotation=0)

        # （7）找最小值并标星
        min_val = np.nanmin(pivot_table.values)
        row_idxs, col_idxs = np.where(pivot_table.values == min_val)
        for r, c in zip(row_idxs, col_idxs):
            ax.scatter(
                x=c + 0.5,
                y=r + 0.25,
                marker="*",
                s=200,
                c="red",
                edgecolors='none',
                zorder=10
            )

        # （8）标题与轴标签
        plt.title(f"Heatmap for N={n_val}, D={d_val}, Na={na_val}")
        plt.xlabel("lr")
        plt.ylabel("bs")

        # （9）保存
        os.makedirs("heatmap", exist_ok=True)
        filename = f"heatmap_moe/heatmap_N{n_val}_D{d_val}_Na{na_val}.png"
        plt.tight_layout()
        plt.savefig(filename, dpi=300)
        plt.close()

    print("所有热力图已绘制并保存！")

if __name__ == "__main__":
    csv_path = "tables/0801_moe_lr_bs_grid_preliminary.csv"
    draw_heatmaps(csv_path)
