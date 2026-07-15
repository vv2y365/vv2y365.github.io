+++
date = '2026-07-12T22:12:35+08:00'
draft = false
title = 'CS106B'
+++
# 0.有关CS106B
CS106B 将带您熟悉 C++ 编程语言，并介绍递归、算法分析和数据抽象等高级编程技巧，探索经典的数据结构和算法，并让您有机会运用这些工具解决复杂问题 (注意:它不会教你基本语法, 在这之前, 你需要一点的编程经验)
由于cs106B各个年份课程的开源程度不同，我们想要学习这门课程就需要结合不同年份的课程资源
[Qt](https://www.qt.io/development/download-qt-installer-oss) qt6.11可用
[StanfordLib 2021](https://github.com/MedivhGO/Stanford-CS106B/)
[Lectures 2020summer](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1242/lectures/)
[Sections 2022summer](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1228/about_section)
[Assignments 2022winter](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1224/about_assignments)
[Exams 2022winter](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1224/midterm_logistics)
![Roadmap](img/cs106bmap.png "Map")

# 1.什么是抽象
抽象就是只告诉你这个东西能干什么，但不告诉你它到底是怎么干的, 抽象 = 隐藏**怎么做**，只暴露**做什么** 
*Design that hides the details of how something works while still allowing the user to access complex functionality*

世间一切都是抽象
例如:你用美团点外卖，只要选菜、下单、付款就行，不需要懂服务器、数据库、网络协议等怎么工作的

# 2.在代码中使用抽象概念来构建数据
1. ADT的定义(*Abstract Data Type*)
ADT 是 “**你想让一个东西表现成什么样**，而**不是它内部怎么实现**”
2. 界面和实现的分离
实现于程序时，抽象数据类型只显现出其界面，并将实现加以隐藏。用户只需关心它的界面，而不是如何实现
# 3.vector
- 从宏观层面来说，向量是相同类型元素的有序集合，其大小可以**增长或缩小** (注意:与数学向量不同)
- 集合中的每个元素都有一个特定的位置, 或称索引
- 向量中的所有元素必须是同一类型, 与其他编程语言不同，单个向量不能包含混合类型的元素
- 向量在存储元素数量方面非常灵活, 可以轻松地添加和删除元素、查询当前包含的元素数量等
## 基本向量运算
- 创建
`vector<int> vec;`
![vec_creat](img/vec_creat.png "vec_creat")

- 元素添加

`vec.add(4);`

`vec.add(8);`

`vec.add(15);`
![vec_add](img/vec_add.png "vec_add")
(注意：索引从`0`开始)
- 创造 + 添加
`vector<int> vec = {4, 8, 15};`
- 访问元素
`cout << vec[1] << endl;`
(注意: `cout << vec[3] << endl;` 这样做会抛出错误! Vector会进行边界检查, 不允许访问**超出边界的元素**)![vec_accesserror](img/vec_accesserror.png "vec_accesserror")
- 移除元素
`vec.remove(0);`(注意: index与value不绑定)
![vec_remove](img/vec_remove.png "vec_remove")
- 访问元素个数
  `cout << vec.size() << endl;`

   ```console
   output:2
  
- 遍历向量

    - 方法一：传统 for 循环

        ```cpp
        vector<int> vec = {1, 0, 6};

        for (int i = 0; i < vec.size(); i++) {
            cout << vec[i] << endl;
        }
        ```

    - 方法二：for each 循环

        ```cpp
         vector<int> vec = {1, 0, 6};
        
        for (int value : vec) {
            cout << value << endl;
        }
        ```
        ```console
        output:
        1
        0
        6
        ```
- Vector函数实用功能
    - `vec.size()`：返回向量中元素的数量
    - `vec.isEmpty()`：判断向量是否为空，空返回 `true`，否则返回 `false`。
    - `vec[i]`：访问向量中第 `i` 个元素
    - `vec.add(value)`：在向量末尾添加一个元素
    - `vec.insert(index, value)`：在指定位置 `index` 前插入元素，后面的元素向后移动一位
    - `vec.remove(index)`：删除指定位置的元素，后面的元素向前移动一位
    - `vec.clear()`：清空向量中的所有元素
    - `vec.sort()`：按升序排列向量中的元素
        ```

## vector示例
- 消除负数:给定一个整数向量，编写一个函数，通过改变向量中所有负值的符号，将它们转换为对应的正值，从而消除向量中的负数
```cpp
void eliminateNegativity(vector<int> v)
{
  for (int i = 0; i < v.size(); i++)
  {
    if (v[i] < 0)
      v[i] *= -1; //负数 * -1
    cout << v[i] << endl;
  }
}

int main()
{
  vector<int> vec = {-1, 0, -4, 5};
  eliminateNegativity(vec);
  return 0;
}
```
# 4.值传递与引用传递
## 什么是值传递?
当一个参数传递给函数时，新变量会在内存中存储传递值的副本
```cpp
void tripleWeight(double w) {
 w *= 3; // 重量三倍
}

int main() {
 double weight = 1.06;
 tripleWeight(weight);
 cout << weight << endl; //weigt仍是1.06
}
```
![pass_by_value](img/pass_by_value.png "pass_by_value")
## 什么是引用传递?
当向函数传递参数时，新变量会存储对传入值的引用，这允许您直接编辑原始值 在类型后面加上`&`
```cpp
void tripleWeight(double& weight_ref) {
 weight_ref *= 3; // 重量三倍
}

int main() {
 double weight = 1.06;
 tripleWeight(weight);
 cout << weight << endl; //weight会变为3.18, 但我们通常不会这样编写代码……
} 
```
![pass_by_reference](img/pass_by_reference.png "pass_by_reference")
## 何时不使用引用传递?
- 如果我们总是使用引用，那么函数之间都可以互相修改对方的变量，程序的作用域会变得混乱
- 当数据本身很小(即按值复制的成本很低)时，我们就不需要使用引用
- 如果参数是引用,不能传入字面值

 :x:**错误示例**
```cpp
void tripleWeight(double& weight_ref);
...
tripleWeight(1.06);//别这么做!编译器出错 1.06是一个临时值，没有实际存储位置，不能被引用修改
```

# 5.有序数据结构
## Grid
这是Stanford封装好的类 [Stanford Grid documentation](https://web.stanford.edu/dept/cs_edu/resources/cslib_docs/Grid)

- 一个二维数组，具有**特定**的宽度和高度(注意:这里我们用**数组**而不是向量,因为它在创建的时候就确定了行数和列数，所以不像vector那样可以随意增加元素)

![grid](img\grid.png)

- 适用于电子表格、游戏棋盘等
- 声明Grid的三种方法
    ```cpp
    Grid<type> gridName;
    Grid<type> gridName(numRows, numCols);
    Grid<type> gridName = {{a0, a1, a2}, {b0, b1, b2},...};
    ```
- 实用功能
    ```cpp
    grid.numRows() //返回网格（grid）的行数
    grid.numCols() //返回网格（grid）的列数
    grid[i][j] 选择网格中第 i 行、第 j 列 的元素。
    grid.resize(rows, cols) //改变网格的尺寸(行数和列数),并将所有元素重新初始化为它们的默认值
    grid.inBounds(row, col) //如果指定的 行(row),列(col)位置在网格范围内,返回true,否则返回false
    ```
- 如何遍历Grid
```cpp
void printGrid(Grid<char>& grid) {
 for(int r = 0; r < grid.numRows(); r++) {
     for(int c = 0; c < grid.numCols(); c++) {
         cout << grid[r][c];
     }
     cout << endl;
  }
}

Grid<char> word = {{'y', 'e'}, {'e', 'h'}, {'a', 'w'}};
printGrid(word);
```

```console
output:
ye
eh
aw
```

![grid_access](img\grid_access.png)

- 使用Grid时常见的陷阱
    - 别忘了指定Grid中存储的数据类型
    `Grid word; //NO!`
    `Grid<char> word //YES~`
    - 与vector和其他抽象数据类型(ADT)一样,当网格用作函数参数时,应该按引用传递`&`
    - 使用网格索引时要注意变量的顺序! 建议使用`r`表示行,`c`表示列
    - 与其他语言不同,您只能访问单元格(不能访问单个行) `grid[0]` → 这样做会导致错误

- 战舰游戏网格系统
![battleship](L:\source\mynewsite\content\posts\cs106b\img\battleship.png)

# 6.Structs + GridLocation
## 什么是struct
C++中将不同类型的信息捆绑在一起的方法——类似于创建自定义数据结构
## GridLocation结构体
- Stanford C++库中预定义的结构体,可以更方便地存储网格位置
```cpp
struct GridLocation {
    int row;    
    int col;
}                     //结构定义(可以是不同类型的成员)
```

- 要声明一个结构体，你可以分别给每个成员赋值，也可以在创建结构体时一次性赋值

```cpp
GridLocation origin = {0, 0}; 
// or
GridLocation origin;
origin.row = 0;
origin.col = 0; //您可以使用点号表示法访问结构体中的成员 成员名后面不需要括号
```

> NOT END
