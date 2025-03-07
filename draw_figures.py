import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
import os

def truncated_viridis(minval=0.0, maxval=0.9):
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

        # 删除单元格值大于3.5的（替换为 NaN），并丢弃全为空的列
        pivot_table = pivot_table.mask(pivot_table > 3.5)
        pivot_table.dropna(axis=1, how='all', inplace=True)

        # 计算 vmin 和第 10 大值作为 vmax（逻辑与之前相同）
        arr = pivot_table.values.flatten()
        arr = arr[~np.isnan(arr)]
        if len(arr) == 0:
            print(f"N={n_val}, D={d_val}: 全是 NaN，跳过")
            continue
        elif len(arr) < 10:
            arr_sorted = np.sort(arr)
            vmin_val = arr_sorted[0]
            vmax_val = arr_sorted[-1]
        else:
            arr_sorted = np.sort(arr)
            vmin_val = arr_sorted[0]
            vmax_val = arr_sorted[-10]

        plt.figure(figsize=(8, 6))
        new_cmap = truncated_viridis(minval=0.1, maxval=0.6)

        ax = sns.heatmap(
            pivot_table,
            annot=True,
            fmt=".4f",
            cmap=new_cmap,
            vmin=vmin_val,
            vmax=vmax_val,
            annot_kws={"fontsize": 8}
        )

        bs_values = pivot_table.index  
        # 确保它们是数值类型，如果不是，可以转成     float
        # bs_values = bs_values.astype(float)

        # 2) Matplotlib 的热力图通常在每一行的中心处放一个刻度，
        #    这些刻度默认位置是 [0.5, 1.5, 2.5, ..., n-0.5] 对应于 n 行。
        #    因此可以用 np.arange(len(bs_values)) + 0.5 作为 ytick positions
        ytick_positions = np.arange(len(bs_values)) + 0.5

        # 3) 生成新的标签（乘以 2048）
        ytick_labels = [f"{int(val * 2048)}" for val in bs_values]

        # 4) 设置新的 ytick
        ax.set_yticks(ytick_positions)
        ax.set_yticklabels(ytick_labels, rotation=0)  # rotation=0 => 水平显示

        # 查找最小值并标星
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

        plt.title(f"Heatmap for N={n_val}, D={d_val}")
        plt.xlabel("lr")
        plt.ylabel("bs")

        os.makedirs("heatmap", exist_ok=True)
        filename = f"heatmap/heatmap_N{n_val}_D{d_val}.png"
        plt.tight_layout()
        plt.savefig(filename, dpi=300)
        plt.close()

    print("所有热力图已绘制并保存！")

if __name__ == "__main__":
    # csv_path = "tables/0715_lr_bs_loss.csv"
    csv_path = "tables/0603_resume20b_lr_bs_loss_revisit.csv"
    draw_heatmaps(csv_path)
