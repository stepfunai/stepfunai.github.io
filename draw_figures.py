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
    df = pd.read_csv(csv_file)
    grouped = df.groupby(['N', 'D'])

    for (n_val, d_val), group in grouped:
        pivot_table = group.pivot(index='bs', columns='lr', values='smooth loss')
        pivot_table = pivot_table.sort_index(axis=0)
        pivot_table = pivot_table.reindex(sorted(pivot_table.columns), axis=1)

        # 1) 删除单元格值大于3.5的（替换为 NaN）
        pivot_table = pivot_table.mask(pivot_table > 3.5)
        pivot_table.dropna(axis=1, how='all', inplace=True)
        
        plt.figure(figsize=(8, 6))
        new_cmap = truncated_viridis(minval=0.1, maxval=0.6)

        ax = sns.heatmap(
            pivot_table,
            annot=True,
            fmt=".4f",
            cmap=new_cmap,
            vmin=2.6,
            vmax=2.8,
            robust=True,
            annot_kws={"fontsize": 8}
        )

        # 找到最小值（排除 NaN）
        min_val = np.nanmin(pivot_table.values)
        print(f"N={n_val}, D={d_val}, 最小值: {min_val}")

        # 找到所有等于该最小值的位置
        row_idxs, col_idxs = np.where(pivot_table.values == min_val)

        # 为最小值单元格标记红色五角星
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

        plt.title(f"Heatmap for N={n_val}, D={d_val}")
        plt.xlabel("lr")
        plt.ylabel("bs")
        plt.xticks(fontsize=8)
        plt.yticks(fontsize=8)

        os.makedirs("heatmap", exist_ok=True)
        filename = f"heatmap/heatmap_N{n_val}_D{d_val}.png"
        plt.tight_layout()
        plt.savefig(filename, dpi=300)
        plt.close()
    
    print("所有热力图已绘制并保存！")

if __name__ == "__main__":
    csv_path = "tables/0715_lr_bs_loss.csv"  # CSV 文件路径
    draw_heatmaps(csv_path)
