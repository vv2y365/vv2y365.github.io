+++
date = '2026-07-12T22:12:35+08:00'
draft = false
title = 'CS106B'
showTableOfContents = 'true'
+++
# 0.有关CS106B
CS106B 将带您熟悉 C++ 编程语言，并介绍递归、算法分析和数据抽象等高级编程技巧，探索经典的数据结构和算法，并让您有机会运用这些工具解决复杂问题 (注意:它不会教你基本语法, 在这之前, 你需要一点的编程经验)

由于cs106B各个年份课程的开源程度不同，我们想要学习这门课程就需要结合不同年份的课程资源

![welcome](img/welcome.png "成功配置")

[Qt](https://www.qt.io/development/download-qt-installer-oss) Qt6.11可用

[StanfordLib 2021](https://github.com/MedivhGO/Stanford-CS106B/)

[Lectures 2020summer](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1242/lectures/)

[Sections 2022summer](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1228/about_section)

[Assignments 2022winter](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1224/about_assignments)

[Exams 2022winter](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1224/midterm_logistics)

![Roadmap](img/cs106bmap.png "Map")

# 1.什么是抽象

从具体事物提取共同结构

抽象就是只告诉你这个东西能干什么，但不告诉你它到底是怎么干的, 抽象 = 隐藏**怎么做**，只暴露**做什么** 
*Design that hides the details of how something works while still allowing the user to access complex functionality*

世间一切都是抽象
例如:你用美团点外卖，只要选菜、下单、付款就行，不需要懂服务器、数据库、网络协议等怎么工作的

# 2.在代码中使用抽象概念来构建数据
- ADT的定义(*Abstract Data Type*)
ADT 是 “**你想让一个东西表现成什么样**，而**不是它内部怎么实现**” 常见的ADT: Vector,Queue,Stack

- 功能和实现的分离
实现于程序时，抽象数据类型只显现出其功能，并将实现加以隐藏 你只需关心它的功能，而不是如何实现，类似于可以不知道一些深奥的数学知识，但要会用它解决问题
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
<img src="img/pass_by_value.png" alt="pass_by_value" title="pass_by_value" style="zoom:50%;" />

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

当说“无序”与“有序”时，我们特指数字排序

## Vector
- 从宏观层面来说，向量是相同类型元素的有序集合，其大小可以**增长或缩小** (注意:与数学向量不同)
- 集合中的每个元素都有一个特定的位置, 或称索引
- 向量中的所有元素必须是同一类型, 与其他编程语言不同，单个向量不能包含混合类型的元素
- 向量在存储元素数量方面非常灵活, 可以轻松地添加和删除元素、查询当前包含的元素数量等
### 基本向量运算
- 创建
`vector<int> vec;`
<img src="img/vec_creat.png" alt="vec_creat" title="vec_creat" style="zoom: 80%;" />

- 元素添加

`vec.add(4);`

`vec.add(8);`

`vec.add(15);`
<img src="img/vec_add.png" alt="vec_add" title="vec_add" style="zoom: 80%;" />
(注意：索引从`0`开始)

- 创造 + 添加
`vector<int> vec = {4, 8, 15};`
- 访问元素
`cout << vec[1] << endl;`
(注意: `cout << vec[3] << endl;` 这样做会抛出错误! Vector会进行边界检查, 不允许访问**超出边界的元素**)
- <img src="img/vec_accesserror.png" alt="vec_accesserror" title="vec_accesserror" style="zoom: 80%;" />
- 移除元素
`vec.remove(0);`(注意: index与value不绑定)
<img src="img/vec_remove.png" alt="vec_remove" title="vec_remove" style="zoom: 80%;" />
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
     ```cpp
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
### vector示例
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
## Grid
这是Stanford封装好的类 [Stanford Grid documentation](https://web.stanford.edu/dept/cs_edu/resources/cslib_docs/Grid)

- 一个二维数组，具有**特定**的宽度和高度(注意:这里我们用**数组**而不是向量,因为它在创建的时候就确定了行数和列数，所以不像vector那样可以随意增加元素)

![grid](img/grid.png)

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
    grid[i][j] //选择网格中第 i 行、第 j 列 的元素。
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

![grid_access](img/grid_access.png)

- 使用Grid时常见的陷阱
    - 别忘了指定Grid中存储的数据类型

    `Grid word; //NO!`
    
    `Grid<char> word; //YES~`
    
    - 与vector和其他抽象数据类型(ADT)一样,当网格用作函数参数时,应该按引用传递`&`
    - 使用网格索引时要注意变量的顺序! 建议使用`r`表示行,`c`表示列
    - 与其他语言不同,您只能访问单元格(不能访问单个行) `grid[0]` → 这样做会导致错误
    
- 战舰游戏网格系统
<img src="img/battleship.png" alt="battleship" style="zoom:50%;" />

### Structs + GridLocation
#### 什么是struct
C++中将不同类型的信息捆绑在一起的方法——类似于创建自定义数据结构
#### GridLocation结构体
- Stanford C++库中预定义的结构体,可以更方便地存储网格位置 (就像一个坐标表示系统)
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

## Queue
有Stanford封装好的类 [Stanford Grid documentation](https://web.stanford.edu/dept/cs_edu/resources/cslib_docs/Queue)
### 什么是Queue?

<img src="img/queue.png" alt="queue" style="zoom:50%;" />

- 一种两端开放的线性数据结构
- 一个有序列表，允许在称为后部(REAR)的一端执行插入操作，在称为前部(FRONT)的另一端执行删除操作
- 先进先出(FIFO)列表 就像我们在食堂排队打饭一样 **F**irst person **I**n is the **F**irst person **O**ut

### 实用功能

```cpp
enqueue(value)  // or add(value )入队
dequeue()  // or remove() 离队 因为是先进先出 所以是移除首次添加的值
peek()  // or front() 查看队首
isEmpty() // 队列是否为空
```

### Queue示例

```cpp
Queue<int> line; // {}, empty queue
line.enqueue(42); // {42}
line.enqueue(-3); // {42, -3}
line.enqueue(17); // {42, -3, 17}
cout << line.dequeue() << endl; // 取出42 (队列目前为 {-3, 17})
cout << line.peek() << endl; // 显示-3 (队列目前为 {-3, 17})
cout << line.dequeue() << endl; // 取出-3 (队列目前为 {17})

// or
Queue<int> line = {42, -3, 17};
```
## Stack

### 什么是Stack
- 遵循后来居上，后进先出(LIFO)原则的抽象数据结构(ADT)  **L**ast item **I**n is the **F**irst one **O**ut

<img src="img/stack.png" alt="stack" title="from hello-algo.com" style="zoom:80%;" />

## Stack与Queue常见操作

```cpp
Stack<string> wordStack; // {}, empty stack
wordStack.push("Kylie"); // {"Kylie"}
wordStack.push("Nick"); // {"Kylie", "Nick"}
wordStack.push("Trip"); // {"Kylie", "Nick", "Trip"}
cout << wordStack.pop() << endl; // “Trip”
cout << wordStack.peek() << endl; // "Nick"
cout << wordStack.pop() << endl; // "Nick" (stack is {"Kylie"})
// 直接表示
Stack<string> wordStack = {"Kylie", "Nick", "Trip"};
// 顶部 是最右边的元素Trip
```
- 清空队列/栈

```cpp
//取出队列中的元素
Queue<int> queueIdiom1;
// produce: {1, 2, 3, 4, 5, 6}
for (int i = 1; i <= 6; i++) {
  queueIdiom1.enqueue(i);
}
while (!queueIdiom1.isEmpty()) {
  cout << queueIdiom1.dequeue() << " ";
}
cout << endl;
//output: 1 2 3 4 5 6

//取出栈中的元素
Stack<int> stackIdiom1;
// produce: {1, 2, 3, 4, 5, 6}
for (int i = 1; i <= 6; i++) {
  stackIdiom1.push(i);
}
while (!stackIdiom1.isEmpty()) {
  cout << stackIdiom1.pop() << " ";
}
cout << endl;
//output: 6 5 4 3 2 1
```

- 遍历和修改队列/栈 → 循环前只需计算一次大小

```cpp
//队列
Queue<int> queueIdiom2 = {1,2,3,4,5,6};

int origQSize = queueIdiom2.size();

for (int i = 0; i < origQSize; i++) {
   int value = queueIdiom2.dequeue();
 // 只保留偶数
   if (value % 2 == 0) {
       queueIdiom2.enqueue(value);
   }
}
cout << queueIdiom2 << endl;
//output: 2, 4, 6

//栈
Stack<int> stackIdiom2 = {1,2,3,4,5,6};
Stack<int> result;

int origSSize = stackIdiom2.size();

for (int i = 0; i < origSSize; i++) {
  int value = stackIdiom2.pop();
 // stackIdiom2的偶数添加到result
  if (value % 2 == 0) {
      result.push(value);
  }
}
cout << result << endl;
//output: 6, 4, 2
```

## Stack与Queue常见陷阱
- 别在循环条件里用 `.size()` 因为每一次循环`size`都会改变! 在循环开始前，应用一个固定变量把初始大小存起来
- 栈是一次性的! 队列有时候还可以提供只读的迭代器让我们从头扫到尾，但栈(Stack)不行！你想要遍历一个栈，唯一的办法就是不断地 `pop()` (弹出)它，而弹出来的元素就从原栈里消失了，在遍历前应先进行复制
## Stack与Queue的缺点
- **没有随机访问** 

  你想看队伍中间的人是谁？对不起，没门! 不像Vector,Grid那样可以使用索引(index):sweat_smile: 

- **没有无副作用的遍历**

  在不破坏它们的前提下，你无法把里面所有的元素扫一遍，你想看后面的元素，必须先把前面的元素全扔掉（出队/出栈）,遍历完了，这个容器也空了:neutral_face:

- **没有简单的搜索方法**

  你想在栈或队列里找一个特定的值?不行! 你只能苦哈哈地一个一个弹出来比对，找完了还得想办法把倒出来的元素再装回去:expressionless:

# 6.挑选合适的ADT
- Stacks **(LIFO 最后发生的，最先被处理)**

  文本编辑器中的**撤销**

  你的浏览器网页的**后退**

- Queues **(FIFO 先来后到，排队办事)**

  斯坦福计算机系著名的LaIR答疑预约系统->学生做实验遇到bug了，在系统上登记排队等助教，助教肯定去辅导**第一个**登记的学生

  客服热线->哪个客户先打进电话，谁就排在队伍**最前面**，一旦有客服空出来，就先接待谁
# 7.ADT目前为止总结

| 类型 | 是否支持索引访问 | 示例 | 特点 |
| --- | --- | --- | --- |
| **可通过索引访问的有序ADT** | ✅ 可以 | Vector, Grid | 灵活访问，适合遍历和按位置组织数据 |
| **无法通过索引访问元素的有序ADT** | ❌ 不可以 | Queue, Stack | 限制访问方式，适合特定顺序处理 |

核心区别

- **Vector / Grid**
  - 关注 **数据在哪里（where）**
  - 可以直接通过 index 找到元素
  - 例如：
    ```cpp
    vector[3];  // 直接访问第4个元素
    ```

- **Queue / Stack**
  - 关注 **数据处理顺序（how）**
  - 不允许随意访问中间元素
  - 例如：
    ```text
    Queue:
    First in → First out
    
    Stack:
    Last in → First out
    ```
# 8.无序数据结构
## 为什么我们要使用无序ADT
因为有时，使用数字索引/排序并不是存储信息的最有效方式！
## 无序数据示例
- 网站独立访客数
- 随机播放列表，无重复歌曲
- 特定航班上的乘客及其护照号码
- 一份包含所有食材及其用量的食谱
- 社交媒体内容包含，文本,表情,图片，没有统一结构

## Set
### 什么是Set
- 指不包含重复元素的元素的集合

![set](img/set.png)

- 集合比向量等有序数据结构速度更快——因为集合中没有重复项，所以查找数据的速度更快

- 集合没有索引

### 使用功能
如需查看完整列表，请查看[Stanford libraries documentation](https://web.stanford.edu/dept/cs_edu/cppdoc/Set-class.html)

```cpp
add(value) //向集合中添加一个值。如果集合里已经有这个值，则不重复添加
contains(value) //检查集合中是否包含某个值。包含返回 true，否则返回 false。
remove(value) //集合中删除某个值。如果这个值不存在，什么也不做
size() //返回集合中元素的数量
isEmpty() //判断集合是否为空。为空返回 true，否则返回 false
```
### Set示例
```cpp
Set<string> friends;
friends.add("nick");
friends.add("kylie");
friends.add("trip");
// 也可以这样  Set<string> friends = {“nick”, “kylie”, “trip”};
cout << boolalpha << friends.contains("voldemort") << noboolalpha
    << endl;
for(string person : friends) {
    cout << person << endl;
}
```

### Set运算
`s1 == s2` 如果两个集合包含完全一样的元素，返回 `true` 与`s1 != s2`相对

`s1 + s2` 并集

`s1 * s2` 交集

`s1 - s2` 差集 返回存在于`s1`中但不在`s2`中 的元素

(注意: 元素全不重复)

### 常见集合模式和陷阱
- 使用for each循环遍历集合
```cpp
for (type currElem : set) {
 // process elements one at a time
}
```

- 任何试图对该集合进行索引的操作都不能使用

`for (int i = 0;..) or set[i]`

## Map
### 什么是Map

![map](img/map.png)

- Map(映射 / 哈希表) 是一种存储“键值对（key/value pair）”的数据结构
- 每个 key（键） 对应一个 `value`（值），通过 `key` 可以快速找到对应的 `value`

### 实用功能

```cpp
m.clear() //清空 Map，删除所有键值对
m.containsKey(key) //判断 Map 是否包含指定的键。包含返回 true，否则返回 false
m[key] //or m.get(key) 获取指定 key 对应的 value，如果 key 不存在，返回 value 类型的默认值
m.isEmpty() //判断 Map 是否为空。没有任何键值对返回 true
m.keys() //返回 Map 中所有 key 的集合（Vector）
m[key] = value //or m.put(key, value) 添加一个键值对，如果 key 已存在，则更新它对应的 value
m.remove(key) //删除指定 key 的键值对，如果 key 不存在，不做任何操作
m.size() //返回 Map 中键值对的数量
m.values() //返回 Map 中所有 value 的集合（Vector）
```
### Map示例
```cpp
// 将字符串键映射到字符串值
Map<string, string> phoneBook;

//插入新值
// key                value
phoneBook["Jenny"] = "867-5309"; // or
phoneBook.put("Jenny", "867-5309");

//访问值
string jennyNumber = phoneBook["Jenny"]; // or
string jennyNumber = phoneBook.get("Jenny");
cout << jennyNumber << endl;

// 将字符串键映射到 Vector<double> 值
Map<string, Vector<double>> accounts;
```
### 常见映射表模式和陷阱
- 使用for each循环遍历映射表
- 自动插入：一项map功能，但有时也会导致错误

```cpp
Map<string, int> freqMap;
while (true) {
    string text = getLine("Enter some text: ");
    cout << "Times seen: " << freqMap[text] << endl;
    freqMap[text]++; //自动插入仅在使用 [] 运算符时才会发生，而不会使用 .get() 函数
 } 
```

错误示例

```cpp
Map<string, int> freqMap;
//...
// 获取密钥以测试它是否在地图中
if (freqMap[key] == 0) { // 这个判断永远是true
cout << key << " is in the map" << endl;
}
```

正确示例

```cpp
Map<string, int> freqMap;
...
// 使用 containsKey 函数，不自动插入
if (freqMap.containsKey(key)) { // 正确的做法
    cout << key << " is in the map" << endl;
}
```

## ADT再次总结
### Ordered ADTs（有序抽象数据类型）

数据有明确顺序，可以按照位置访问。

| 类型 | 通俗理解 |
|---|---|
| Vectors（向量 / 一维数组） | 像一排储物柜，每个元素都有编号，可以通过下标访问，例如 `vec[3]` |
| Grids（网格 / 二维数组） | 像棋盘一样，有行和列，可以通过两个坐标访问，例如 `grid[2][5]` |
| Queues（队列） | 像排队买票，只能从队尾加入，从队头取出，先进先出 FIFO（First In First Out） |
| Stacks（栈） | 像一摞盘子，只能从顶部放入和取出，后进先出 LIFO（Last In First Out） |

---

### Unordered ADTs（无序抽象数据类型）

数据没有固定顺序，不能依靠位置访问。

适合用于：数字排序没有意义，更关注“是否存在”或“快速查找”的情况。

| 类型 | 通俗理解 |
|---|---|
| Sets（集合） | 存储不重复的数据，每个元素只能出现一次，例如 `{1,2,3}` |
| Keys（键） | 每个键必须唯一，用来快速找到对应的数据，例如字典中的“单词 → 解释” |

# 9.使用抽象
## 计数排序
一种非比较型排序算法。它的核心思想是统计数组中每个元素出现的次数，并将这些统计结果用来直接计算每个元素在排序后数组中的正确位置，从而避免元素之间的两两比较

- 现在，让我们考虑这个问题：如何高效地将单词中的所有字母按字母顺序排序？
- 我们如何利用最近学到的一些数据结构，对要排序的数据进行有意义的结构化处理？
- 想法：如果我们统计出从“a”到“z”的每个字母出现的次数，我们就可以构建一个新字符串，该字符串由正确数量的“b”，……等等

![counting_sort_example](img/counting_sort_example.png)

- 遍历单词并构建原始字符串中出现的所有字母的频率map
(注意:它没有天然的“统计”功能,但**ADT 不关心你存什么，只关心key-value关系**)
- 遍历从 'a' 到 'z' 的所有字母，并构建一个包含相应数量字母的新字符串
- 返回新生成的字符串

```cpp
string countingSort(string s) {

    map<char, int> freqMap;
    
    for (char ch: s) {
        freqMap[ch]++;
    }
    
    string sortedString;
    for (char ch = 'a'; ch <= 'z'; ch++) {
        for (int i = 0; i < freqMap[ch]; i++) { //如果ch不存在与s中,freqMap[ch] = 0
                sortedString.push_back(ch);
            }
        }
    return sortedString;
}
```

## 单词梯问题
给你两个单词，你需要像爬楼梯一样，一步一步改变字母，最后从起始单词变成目标单词，每一步得到的**新单词都必须是真实存在**的英文单词

COLD -> CORD -> CARD -> WARD -> WARM

一个直观想法是模拟人类解题过程：
1. 从起始单词开始
2. 猜测应该改变哪个字母
3. 修改字母，生成新的合法英文单词
4. 重复这个过程，直到：
   - 到达目标单词
   - 或走入死路，然后重新尝试

### 需要直觉
人类可以凭经验判断下一步，但：
> 计算机没有“感觉”，不知道哪个方向更好
---
### 搜索无组织
这种方法类似乱走迷宫：
- 不知道先探索哪里
- 可能重复尝试
- 没有记录搜索过程

---

### 无法保证找到答案
即使存在解：
> 随机尝试也可能永远找不到正确路径

猜测 → 尝试 → 失败 → 重来 不适合计算机 那怎么办？🫤

## BFS
### 什么是BFS
**广度优先搜索(BFS)** 一种逐层向外扩散的图遍历算法，它从起点开始，先访问所有直接相邻的节点，再依次访问邻居的邻居


  ```text
                COLD
              /  |   \
          BOLD  CORD  SOLD
          /       |      \
     ❌  BALD     CARD    SORD  ❌
                   |
                 WARD 
                   |
                 WARM
  ```

### BFS所需要的数据结构
| 功能        | 数据结构需求     | 常用 ADT         |
| --------- | ---------- | -------------- |
| 保存一条路径    | 快速访问最后一个单词 | Vector / Stack |
| 保存等待探索的路径 | 按长度顺序处理    | Queue          |
| 记录访问过的单词  | 快速查找是否存在   | Set            |

核心思想:
> BFS 不直接搜索单词，而是搜索**可能的路径**，每次扩展一层

### 解决单词梯问题
1. 初始化：
    - 创建一个**队列**用于存放待处理的路径。
    - 创建一个**集合**记录已访问过的单词（防止重复搜索）
    - 将包含“起始单词”的路径存入队列

2.  循环处理（当队列不为空时）：
    *   从队列中取出一个**路径**
    *   取出路径末尾的单词作为“当前单词”
    *   **判断**：如果当前单词等于“目标单词”，直接返回该路径，搜索结束。

3.  扩展节点：
    - 寻找所有与“当前单词”仅相差一个字母且合法的“邻居单词”。
    - 遍历这些邻居：
        - 如果该邻居**尚未被访问过**：
            - 标记该邻居为“已访问”
            - 复制当前路径，并将该邻居添加到路径末尾
            - 将这条新路径加入队列尾部，继续下一轮探索

### BFS示例

给你个

```cpp
 vector<string> maze = {
        "S.....", // S为起点
        ".###..", // .表示路 #表示障碍
        "...#..", 
        ".###..",
        "....E." // E为目标点 计算最短要走几步
    };
```

代码实现:

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct node {
    int x;
    int y;
    int step;
    bool operator==(const node& other) {
        return (other.x == x && y == other.y);
    }
};

class bfs1 {
public:
    int bfs(vector<string> maze) {
        //初始化
        int n = maze.size();
        int m = maze[0].size();
        node s = {0, 0, 0};
        node e = {4, 4, 0};
        queue<node> q;
        vector<vector<int>> visited(n, vector<int>(m, 0)); //搜索状态  未访问：0 已访问:1
        visited[s.x][s.y] = true;
        q.push(s); //添加起始位置坐标

        while (!q.empty()) {
            node cur = q.front(); //记录队列中第一个元素
            q.pop();              //删除

            if (cur == e)
                return cur.step;

            //方向变化量
            int dx[4] = {-1, 1, 0, 0};
            int dy[4] = {0, 0, -1, 1};

            for (int i = 0; i < 4; i++) {
                //新坐标
                int nx = cur.x + dx[i];
                int ny = cur.y + dy[i];

                if (nx < 0 || nx >= n || ny < 0 || ny >=m) //越界访问
                    continue;
                if (maze[nx][ny] == '#') //遇到障碍
                    continue;
                if (visited[nx][ny]) //已访问过
                    continue;

                visited[nx][ny] = true; //访问记录
                q.push({nx, ny, cur.step + 1}); //添加新坐标并让step+1
            }
        }
        return -1; //如果队列为空
    }
};

int main()
{
    vector<string> maze = {
        "S.....",
        ".###..",
        "...#..",
        ".###..",
        "....E."
    };

    bfs1 test;
    cout << test.bfs(maze);
    return 0;
}

```


## Nested ADT
### 什么是Nested ADT
一种数据结构里面包含另一种数据结构作为元素
- 对象里面放对象
- 哈希表里放列表
- 链表里面放树

### Nested ADT示例
假设我们正在设计一个系统，用来记录动物园中**不同动物**的喂食时间

- 需求：
    - 如果我们知道动物的名字，我们需要能够快速查找该动物对应的喂食时间
    - 我们需要能够为每一种动物存储多个喂食时间
    - 喂食时间应该按照实际喂食发生的顺序进行存储
- 数据结构声明

`map<string, vector<string>> feedingTimes;`

这里有两个层级
- 动物名字 -> 喂食时间列表
- 一个动物 -> 多个时间

| 🐱         | 🐕          |
| ----------- | ----------- |
| 7:00        | 8:00        |
| 12:00       | 11:00       |

```text
feedingTimes (map<string, vector<string>>)
|
+-- ["Cat"]
|      |
|      +-- vector<string>
|             |
|             +-- [0] --> "07:00"
|             |
|             +-- [1] --> "12:00"
|
+-- ["Dog"]
       |
       +-- vector<string>
              |
              +-- [0] --> "08:00"
              |
              +-- [1] --> "11:00"
```

```cpp
feedingTimes["Cat"] = {"7:00", "9.00"};
cout << feedingTimes["Cat"][0]; //输出一个string "7:00"
```

### "[]"操作符和"="赋值操作符的细节区别
- 当你使用 [] 运算符访问 map 中的元素时，你得到的是 map 中该元素的**引用**

假设

```text
feedingTimes (map<string, vector<string>>)
|
+-- ["Cat"]
|      |
|      +-- vector<string>
|             |
|             +-- [0] --> "07:00"
|             |
|             +-- [1] --> "12:00"
```
执行`feedingTimes["Cat"].add("14:00");`

会变成

```text
feedingTimes (map<string, vector<string>>)
|
+-- ["Cat"]
|      |
|      +-- vector<string>
|             |
|             +-- [0] --> "07:00"
|             |
|             +-- [1] --> "12:00"
|             |
|             +-- [2] --> "14:00"
```

- 但是，当你使用"="把"[]"的结果赋值给一个变量时，你得到的是内部数据结构的一份复制

执行`vector<string> times3 = feedingTimes["Cat"];`与`times3.add("14:00");`

得到

```text
feedingTimes (map<string, vector<string>>)
|
+-- ["Cat"]
|      |
|      +-- vector<string>
|             |
|             +-- [0] --> "07:00"
|             |
|             +-- [1] --> "12:00"
 

times3 (vector<string>)
  |
  +-- [0] --> "07:00"
  |
  +-- [1] --> "12:00"
  |
  +-- [2] --> "14:00"
```
可以发现`feedingTimes["Cat"]`没有任何变化

- 如何让修改保存
  如果你选择把内部数据结构保存到变量中，那么必须显式重新赋值，才能让修改保存

  重新放回去`feedingTimes["Cat"] = times3;`

  或直接引用`vector<string>& times3 = feedingTimes["Cat"];`

> 这点非常重要，因为很多程序bug都来自**以为改了原件，实际上只改了副本**

### Nested ADT总结
嵌套 ADT 很强大，可以表达复杂现实数据；但也很容易出错，因为多层结构增加理解成本，而 C++ 中引用和复制机制会影响数据是否真正被修改

# 10.Big O和算法分析
## 算法效率为何重要?
- **资源限制**：执行低效的算法可能导致某些任务根本无法完成，即使你拥有无限的资源。
- **解决难题**：高效的算法让我们能够在有限的资源下解决重要问题，并预测程序在处理未知问题时的行为表现。
- **时间对比**：在寻找特殊数中，穷举搜索预估效率低下，而使用高效特定算法实际运行时间会减少许多

## 什么是Big O?
![bigO](img/bigO.png)

在计算机科学中，是一种用来描述算法 **运行时间(时间)** 或 **内存消耗(空间)** 如何随着输入数据量（通常用 `n` 表示）的增长而变化的数学符号

核心作用：大O表示法用于量化某个物理量（或运行时间）的增长率，它提供的是一种**增长预测**，而不是精确的计算公式

简单来说，它不衡量代码在某台特定硬件上跑了多少秒，而是衡量“当处理的数据量成倍增加时，算法所需的时间或空间会以怎样的趋势增长”，它通常用来表示算法在最坏情况下的性能上限

## 时间复杂度
### Big O时间复杂度示例
此代码的BigO是多少呢 答案是 {{< katex >}} \(O(1+3n) = O(n)\)
```cpp
for (int i = 1; i < n; i++)
{
	x++;
}
```
3n 为`i < n`,`i++`,`x++` 1为 `int i = 1` 

因为我们考虑的是`n`接近 \(∞\) 的情况下 所以1与3可以忽略不记

此代码的BigO是多少呢 答案是\(O(n^2)\)
```cpp
for (int i = 1; i <= n; i++)
{
	for (int j = 1; j <= n; j++)
	{
		x++
	}
}
```

此代码的BigO是多少呢 答案是\(O(n+n^2) = O(n^2)\)

```cpp
for (int i = 1; i < n; i++)
{
	x++;
}

for (int i = 1; i <= n; i++)
{
	for (int j = 1; j <= n; j++)
	{
		x++
	}
}
```

### 代码运行时间分析
- 运行时间的局限性：单纯依靠“计时”来衡量代码是不准确的，因为设备硬件、后台程序和电源状态等外界因素都会造成时间波动。
- 常数时间 \(O(1)\)：无论输入数据 `n` 有多大，代码的执行时间保持不变，这是最理想、最极速的算法表现
- 线性时间 \(O(n)\)：运行时间与输入规模呈正比，如果输入规模翻倍，运行时间也大致翻倍（例如遍历查找 Vector 中的最大值）
- 二次方时间 \(O(n^2)\)：运行时间呈二次方暴增（例如使用嵌套的双重 `for` 循环打印矩阵），在输入规模变大时，程序会变得极其缓慢

### 抽象数据类型效率矩阵
下表总结了各类数据结构常见操作的时间复杂度：

| 数据结构 (ADT) | 常数时间 \(O(1)\) 操作示例 | 线性时间 \(O(n)\) 操作示例 | 二次方时间 \(O(n^2)\) 操作示例 |
| :--- | :--- | :--- | :--- |
| **Vectors (向量)** | `.size()`, `.add()`, `v[i]` | `.insert()`, `.remove()`, `.clear()`, 遍历 | 无 |
| **Grids (网格)** | `.numRows()`, `g[i][j]`, `.inBounds()` | 无 | 遍历 |
| **Queues (队列)** | `.size()`, `.peek()`, `.enqueue()`, `.dequeue()` | 遍历 | 无 |
| **Stacks (栈)** | `.size()`, `.peek()`, `.push()`, `.pop()` | 遍历 | 无 |
| **Sets / Maps (集合/映射)** | `.size()`, `.isEmpty()` | 遍历 | 无 |

## 空间复杂度
Big O空间复杂度示例此代码的空间Big O是多少呢？答案是 \(O(1)\)
```cpp
int sum = 0;
for (int i = 1; i <= n; i++)
{
	sum += i;
}
```
这里仅分配了常数个基础变量（sum 和 i）,无论 n 接近 \(\infty\)时有多大，额外占用的内存都不会增加，因此是\(O(1)\)的原地操作

此代码的空间Big O是多少呢？答案是 \(O(n)\)
```cpp
vector<int> v;
for (int i = 1; i <= n; i++)
{
	v.push_back(i);
}
```
代码中创建了一个动态数组/向量，并在其中存储了 n 个元素，随着输入规模 n 变大，内存占用呈线性增长

此代码的空间Big O是多少呢？答案是 \(O(n^2)\)
```cpp
vector<vector<int>> matrix(n, vector<int>(n));
for (int i = 0; i < n; i++)
{
	for (int j = 0; j < n; j++)
	{
		matrix[i][j] = 0;
	}
}
```
代码在内存中开辟了一个 \(n \times n\)的二维网格，所需空间是宽与高的乘积，因此占用空间随 n 的二次方暴增

### 代码空间占用分析
- 空间占用的侧重点：空间复杂度通常评估的是算法在运行过程中所需的额外辅助空间 ，而不是输入数据本身的大小
- 常数空间 \(O(1)\)：无论输入数据 n 有多大，代码只需要固定大小的额外内存，这是最节省内存的理想状态
- 线性空间 \(O(n)\)：额外占用的内存与输入规模呈正比，如果数据量翻倍，占用的额外内存也会大致翻倍
- 二次方空间 \(O(n^2)\)：额外占用的内存呈二次方暴增，在数据规模变大时，极易导致内存溢出
### 抽象数据类型效率矩阵
| 数据结构 (ADT) | 常数时间 \(O(1)\) 操作示例 | 线性时间 \(O(n)\) 操作示例 | 二次方时间 \(O(n^2)\) 操作示例 |
| :--- | :--- | :--- | :--- |
| **Vectors (向量)** | `.size()`, `.add()`, `v[i]`原地交换元素 | 整体存储, 深拷贝  `.subList()` | 无 |
| **Grids (网格)** | `.numRows()`, `g[i][j]`, `.inBounds()` | 提取单行/单列的数据并返回新一维数组 | 整体存储 (假设尺寸为 \(n \times n\), 深拷贝整个网格 |
| **Queues (队列)** | `.size()`, `.peek()`, `.enqueue()`, `.dequeue()` | 整体存储, 深拷贝 | 无 |
| **Stacks (栈)** | `.size()`, `.peek()`, `.push()`, `.pop()` | 整体存储, 深拷贝 | 无 |
| **Sets / Maps (集合/映射)** | `.size()`, `.isEmpty()` 查改元素 (非递归)| 整体存储, 提取所有 Key/Value 组装成新列表 | 无 |

# 11.递归入门
## 什么是递归?

<img src="img/recursion_fun.png" alt="recursion_fun" style="zoom: 50%;" />

是迭代(循环)的强大替代方案，一种问题解决技巧，通过将任务分解成重复的、相同形式的较小任务来完成任务

常用于排序和搜索问题，也可用于表达自然界中观察到的模式

![recursion](img/recursion.png)

## 递归示例
我想知道今天有多少人来上课，但我不想挨个走过去数🫤

我想寻求你们的帮助，但我也想尽量减少每个人的工作量

我们将专注于解决一列学生人数的问题

我们可以用递归法解决这个问题!🥳

- 我走到前排的第一个人面前，问：“在你这一**列**，正坐在你后面的人数有多少？”
- 规定学生的算法
    - 如果没有人坐在我后面，回答 0
    - 如果有人坐在我后面，问那个人：在你这一**列**，正坐在你后面的人数有多少
    - 当他们回答一个数值 N 时，向问我的人回答 (N + 1)

```text
假设有
A
B
C
D
E
---------------------
我问A
A: 后面有人 → 问 B
B: 后面有人 → 问 C
C: 后面有人 → 问 D
D: 后面有人 → 问 E

E: 后面没人 → 返回 0

D 收到 0 → 返回 0 + 1 = 1
C 收到 1 → 返回 1 + 1 = 2
B 收到 2 → 返回 2 + 1 = 3
A 收到 3 → 返回 3 + 1 = 4
---------------------
A 后面有 4 个人 
总人数 = 4 + A自己 = 5
```

```cpp
int count(Person* p)
{
    if(p->behind == nullptr)
        return 0;

    return count(p->behind) + 1;
}
```

(注意:递归不是体现在A得到答案之后怎么计算，A遇到问题后，把**同一个问题**交给了B，而B又把**同一个问题**交给了C...)

![recursion1](img/recursion1.png)

## 递归的两个主要情况
- 基本情况
    - 你的问题中最简单的版本，其他所有情况最终都会缩小到它
        - 可以直接回答
        - 不需要继续调用递归
        - 是递归停止的地方
        - 上一个例子:后面没有人，返回 0
- 递归情况
    - 把更复杂的问题拆解成更小的、相同类型的问题
        - 当前问题无法直接解决
        - 需要依靠一个更小的问题的答案
        - 相信递归调用最终会返回正确结果
        - 上一个例子: 有人，让后面的人解决更小的问题，然后+1
    - 递归信任跳跃:相信递归调用能解决小问题
      (注意:它不是一个解决问题的方法，而是一种设计递归时的思考方式，它的作用不是保证你的代码正确，而是**避免你陷入递归展开的细节，从而能够写出递归结构**)
      
      
      
      例如：用代码求:sum(n)=1+2+3+...+n
      
      ❌:sum(200)=200+sum(199)展开，然后想下一步怎么做( *sum(199)是....？* )
    
      ✔️:假设sum(199)正确，sum(200)=200+sum(199)必然正确 开始设计:假设sum(n-1)正确，sum(n)=n+sum(n-1)必然正确
```cpp
int sum(int n)
{
    if(n == 1)
    {
        return 1;
    }
    else
    {
    	return n + sum(n - 1); //假设(相信)sum(n-1)正确
    }
}
```
## 阶乘
我们知道
```text
5! = 5 x 4!
4! = 4 x 3!
3! = 3 x 2!
2! = 2 x 1!
1! = 1 x 0!
0! = 1
```
归纳

$$
n!=\left\{\begin{array}{ll}
1 & \text { if } n=0 \\
n \times(n-1)! & \text { otherwise }
\end{array}\right.
$$

设计

```cpp
int factorial(int n)
{
  if (n == 0)
  {
    return 1;
  }
  else
  {
    return n * factorial(n - 1);
  }
}

int main()
{
  int n = factorial(5);
  cout << "5! = " << n << endl;
  return 0;
}
```

一步步递归

![recursion2](img/recursion2.png)

一步步返回结果

![recursion3](img/recursion3.png)

## 递归vs.迭代
### 反向字符串示例
```text
      dog → god
 stressed → desserts
recursion → noisrucer
    level → level
        a → a
```

code

```cpp
string fan(string str)
{
  if (str.empty()) //递归终止条件
    return "";

  string temp(1, str.back()); //取出最后一个字符
  str.pop_back();             //删除最后一个字符

  return temp + fan(str);     //拼接并返回
}
```

## 总结
- 递归是一种解决问题的技巧，它通过把一个任务不断拆分成规模更小、形式相同的子任务，来完成整个问题的求解
- 递归有两个主要部分
    -  基本情况（base case）：递归停止的条件，也就是最小规模问题的直接答案
    -  递归情况（recursive case）：把当前问题转化为一个更小规模的同类问题，并继续调用自己
- 答案会在返回调用栈（call stack）的过程中逐步构建出来
- 解决递归问题时，要寻找“自相似性（self-similarity）”，并思考每个栈帧（stack frame）中保存了哪些信息

# 12.递归分形
## 我们如何利用视觉表征来理解递归？
- 递归地解决问题和分析递归现象涉及识别自相似性
- 自相似性：如果一个对象包含自身的较小副本，则该对象是自相似的

![recursive_fractals](img/recursive_fractals.png)

## 递归的图形表示
递归的图形表示使我们能够可视化多次递归调用的结果

![tree](img/tree.png)

理解树的这种**分支**对于解决递归方面的难题至关重要

## 分形
- 分形是指任何重复出现的图形图案
- 分形是由相同形状或图案的重复实例以结构化的方式排列而成的

![fractals](img/fractals.png)

![fractals2](img/fractals2.png "很魔幻 对吧")

![fractals3](img/fractals3.png "怎么有种恐惧感")

##  理解分形结构
```text
                    *
                    |
              *-----+-----*
              |           |
              *           *
          *---+---*   *---+---*
          |       |   |       |
          *       *   *       *
        *-+-*   *-+-* *-+-* *-+-*
        | | |   | | | | | | | | |
        * * *   * * * * * * * * *
```

就像我们学的树状图，每次递归调用只绘制一个分支，所有递归调用的总和就绘制出了整棵树

```text
整体
 |
 +-- 部件（它自己也是整体）
        |
        +-- 更小的自己
```

# 13.高级递归
## 迭代+递归
- 在同一个函数中混合使用迭代和递归是完全合理的
- 递归并不意味着没有迭代，它只是意味着通过解决同一个问题的较小副本来解决同一个问题
- 迭代和递归结合起来会非常强大
## 为什么我们使用递归?
- 优雅
    它使我们能够用非常简洁的代码解决问题
- 高效
    使我们能够在解决问题时获得更好的运行时间
- 动态
    它使我们能够解决那些难以通过迭代解决的问题
    
 ### 一个绝妙的例子

规则:
- 一次只能移动一个盘子
- 大盘不能放在小盘上面
- 目标：把所有盘子从 A 移到 C

![fractals4](img/fractals4.png)

- 我们首先要想办法把最大的圆盘移到目标位置
- 然后需要将中间三块板从辅助区域移动到目标区域

我们想移动最大的盘子 3，但是盘子 1、2 挡住了它，所以必须先把上面的两个盘子移走，问题变成把 2 个盘子从 A 移到 B

思路关键：n-1 个盘子的问题，和原问题结构 n 个盘子一样!

>递归信任：相信更小规模的问题已经有正确解决方法


```cpp
void hanoi(int n, char from, char temp, char to)
{
  if (n == 1)
  {
    cout << from << " -> " << to << endl;
    return;
  }

  // 把 n-1 个盘子移动到辅助柱
  hanoi(n - 1, from, to, temp);

  // 移动最大的盘子
  cout << from << " -> " << to << endl;

  // 把 n-1 个盘子移动到目标柱
  hanoi(n - 1, temp, from, to);
}

int main() {
  hanoi(3, 'A', 'B', 'C');

  return 0;
}
```

## 二分查找

在已排序列表中查找数字89

想法一：我们可以按顺序遍历每个元素，进行线性搜索

我们能否做得更好？我们能否利用数据的结构优势？
(注意：**集合和映射**实际上并**不使用排序列表来存储信息**，但搜索排序数据的总体思路是类似的)

想法二：二分查找

每一步都剔除一半的数据

递归定义二分查找

- 算法：检查中间元素 `(startIndex + endIndex) / 2`
    如果中间元素大于所需值，则删除右半部分数据并重复上述步骤
    如果中间元素小于所需值，则删除数据左半部分并重复操作

![fractals8](img/fractals8.png)

- 递归情况
    - 中间的元素太小 → 二分查找（数据右半部分
    - 中间元素过大 → 二分查找（数据左半部分）
- 基本情况
    - 中间的元素 `==` 所需元素
    - 所查元素不在数据中

```cpp
// 内部辅助函数(实际负责二分查找)
int binarySearchHelper(const vector<int>& v, int targetVal, int left, int right) {
    if (left > right) return -1; //Base cases

    int mid = left + (right - left) / 2;

    if (v[mid] == targetVal) return mid; //Base cases
    if (v[mid] > targetVal)  return binarySearchHelper(v, targetVal, left, mid - 1);
    return binarySearchHelper(v, targetVal, mid + 1, right); //Recursive cases
}

// 外部主函数(自动获取 vector 的首尾索引)
int binarySearch(vector<int>& v, int targetVal) {
    if (v.empty()) return -1; //Base cases
    return binarySearchHelper(v, targetVal, 0, v.size() - 1); //Recursive cases
}
```

大多数情况下，分而治之（\(O(log n)\) ）会比线性运行（\(O(n)\)）更快

## 迭代的局限
- 到目前为止，我们已经看到了一些可以用迭代或者递归解决的问题
- 然而，还有一大类问题，使用迭代方法非常困难，甚至几乎不可能解决
- 为了解决这些问题，并生成大量可能的解决方案，我们需要学习一种新的问题解决技术，叫做**递归回溯**

## 递归回溯

- 递归回溯的核心步骤是:
    - 做出一个选择
    你决定如何生成一个可能的解决方案
    - 使用递归探索这个选择
    通过递归继续深入，看看这个选择是否能产生有效结果
    - 撤销这个选择
    如果这个选择没有得到想要的结果，就回退，取消刚才的选择，然后尝试其他可能
    假设要走迷宫

```text
开始
 |
 +-- 左边
 |    |
 |    +-- 死路 ❌
 |
 +-- 右边
      |
      +-- 出口 ✅
```

普通迭代思维:*我应该写多少个循环才能覆盖所有路线？*

会非常困难，因为路线数量可能无限增长

递归回溯

```text
choose:
    选择走左边

explore:
    继续探索左边的路

unchoose:
    发现死路，回来

choose:
    改走右边
```

生成硬币序列

你正在玩一个游戏，需要连续抛硬币若干次。
游戏的成功与否取决于你得到的正面（heads）和反面（tails）的精确顺序

抛3次硬币

```text
HHT
THT
TTT
HTH
...
```

不同的序列可能导致不同结果

我们能不能发现 2 次抛硬币和 3 次抛硬币结果之间的规律？ 答案是：可以

- 两次抛硬币的所有可能结果
```text
        ""
       /  \
      H    T
     / \  / \
   HH HT TH TT
```

一共\(2^2=4\) 种结果

- 三次抛硬币的所有可能结果

```text
              ""
            /    \
           H      T
         /  \    /  \
        HH  HT  TH  TT
      
HHH HHT HTH HTT THH THT TTH TTT
```

一共 \(2^3=8\) 种结果

*它们之间有什么关系？*

>自相似的树状关系

无论你已经抛了多少次硬币，后面的结构都是一样的

例如：已经得到 `HT`，下一次 `HT + H = HTH`，`HT + T =  HTT`，每一个节点都会分裂成两个新的可能

*树的分支来自哪里？*

>分支来自一个选择，即是否给当前序列添加 H 或 T

这些连续的选择组成了一棵**决策树**，每条从根节点到叶节点的路径，就是一个完整方案

*和递归回溯有什么关系？*

```text
choose:
    选择 H 或 T

explore:
    递归生成剩余位置

unchoose:
    删除刚才选择，尝试另一种可能
```

```cpp
void generate(string soFar, int length)
{
  if (soFar.length() == length)
  {
    cout << soFar << endl;
    return;
  }

  generate(soFar + "H", length);
  generate(soFar + "T", length);
}

int main() {
  string str = "";
  generate(str, 3);

  return 0;
}

/*
output: 
HHH
HHT
HTH
HTT
THH
THT
TTH
TTT

*/
```

**递归负责沿着树向下探索，回溯负责尝试不同分支**


## 递归总结
**为什么使用递归？**
- 优雅
允许我们使用**非常简洁、清晰的代码**解决问题。

- 高效
在解决某些问题时，递归可以帮助我们获得**更好的运行效率**

- 灵活
允许我们解决一些使用迭代方法很难解决的问题

**两种递归类型**

基础递归

- 一个重复执行的任务，在递归调用**返回时逐渐构建答案**

- 最终的 **基本情况** 定义了解决方案的初始种子

- 每一次递归调用都会为最终答案贡献一小部分

- 对递归函数的最初调用最终会产生完整的解决方案

回溯递归

- 递归+排列
- 通过每一步做出多个选择，使用多次递归调用来构建所有可能的解决方案
- 初始递归调用通常从一个**空**的方案开始
- 每一次递归调用代表*我现在做一个选择，然后继续探索这个选择产生的后果*
- 当达到叶节点时，当前路径就是一个可能的**完整解决方案**

# 14.回溯递归与枚举
- 利用回溯递归，我们可以解决以下三大类问题：
    - 生成问题的所有可能解或计算问题可能解的总数
    - 找到问题的一个特定解或证明该解的存在
    - 找到给定问题的最优解
- 我们可以解决的具体问题有很多很多
生成排列、生成子集、生成组合等等

## 游戏Jumble
游戏给你一些被打乱的单词
你需要重新排列字母，猜出原来的单词

![jumble](img/jumble.png)

## 排列
- 一个序列的排列是指一个序列，其元素与原序列相同，但顺序可能不同
- 我们可以把排列看作抛硬币序列的延伸，与只有正面和反面两种固定结果不同
    -与其说是只有 2 个固定选项（正面和反面），不如说我们原始序列的组成部分定义了我们可以用来构建新序列的选项 

*我们的排列决策树由什么定义？*
- 每一步（树的每一层）的**决策**
接下来要添加到排列中的字母是什么？
- 每个决策点的**选项**（每个节点的分支）
    - 对于尚未选择的剩余元素，每个元素都有一个选项 
    - 注意：树的每一层选项数量都不同
- 我们沿途需要存储的信息
    - 你目前构建的排列组合
    - 原始序列中剩余的元素

![cat](img/cat.png)

```cpp
void listPermutationsHelper(string remaining, string soFar)
{
  if (remaining.empty())
    cout << soFar <<endl;
  else
  {
    for (int i = 0; i < remaining.length(); i++)
    {
      char nextLetter = remaining[i];
      string rest = remaining.substr(0, i) + remaining.substr(i + 1);
      listPermutationsHelper(rest, soFar + nextLetter);
    }

  }
}

void listPermutations(string s)
{
  listPermutationsHelper(s, "");
}
```

\(Permutations(S)=x∈S⋃x+Permutations(S−{x})\)

一个集合的所有排列 = 选择其中一个元素作为开头 + 对剩余元素求排列

## 子集
给定一群人，假设我们想要生成这些人的所有可能团队或子集

![subset](img/subset.png)

对于生成子集（以及思考决策）的计算机来说，我们可能会注意到另一种模式……

一半的子集包含“Nick”，一半的子集包含“Kylie”，一半的子集包含“Trip”，同时包含“Trip”和“Nick”的子集中有一半包含“Kylie”🧐

*我们的子集决策树定义了什么？*

- 每一步（树的每一层）的决策是：是否将给定的元素包含在我们的子集中？
- 每个决策的选项（每个节点的分支）
    - 包含元素
    - 不包含元素
- 我们需要存储的信息
    - 目前构建的集合
    - 原始集合中剩余的元素

![subset2](img/subset2.png)

```cpp
void printsubset(vector<string> team)
{
  for (int i =0 ; i < team.size(); i++)
  {
    cout << team[i] << endl;
  }
  cout << endl;
}

void generateTeams(vector<string>& people, vector<string>& team, int index)
{
  if (index == people.size())
  {
    printsubset(team);
    return;
  }

    // 选择当前人
  team.push_back(people[index]);
  generateTeams(people, team, index + 1);
    
    // 不选择当前人
  team.pop_back();
  generateTeams(people, team, index + 1);
}

void generateTeamsHelper(vector<string> people)
{
  vector<string> team;
  generateTeams(people, team, 0);
}

int main()
{

  vector<string> people = {"Nick", "Kylie", "Trip"};
  generateTeamsHelper(people);
  return 0;
}
```

### 要点
- 我们用来生成排列的回溯递归中的“一般‘选择 / 探索 / 不选择’模式”的具体模型可以理解为“复制、编辑、递归”
- 在回溯递归的每一步，记录我们到目前为止做过的决定以及还有哪些决定需要做很重要
- 回溯递归在每一层可能有不同的分支因子
- 常见做法是使用辅助函数和初始为空的参数，然后逐步构建

### 特殊子集
*Nick, Kylie, Trip*

三人都有一个偏见值 `vector<int> bias = {3, -2, -1};` 要求: 输出偏见值总和为`0`的子集

在上个例子中 基本情况下我们做的是打印所有的子集，如果我们只打印符合条件的子集不就行了

```cpp
void generateTeams(vector<int>& people, vector<int>& team, int index, int currentSum)
{
  if (index == people.size())
  {
    if (currentSum == 0)
    {
      printsubst(team);
    }

    return;
  }

  team.push_back(people[index]); //选择
  generateTeams(people, team, index + 1, currentSum + people[index]);
  team.pop_back(); //回退
  generateTeams(people, team, index + 1, currentSum); //不选择
}
```

## 迷宫
给你一个迷宫使用递归找到它的一个正确路径并打印

```cpp
vector<string> maze = {
    "#######",
    "#S#  E#",
    "# # # #",
    "#   # #",
    "#######"
```

什么定义了我们的迷宫决策树
- 每一步的决策（树的每一层）
    - 走左,走右,走上,走下
- 每个决策的选项（节点的分支）
    - 在地图范围内
    - 不是墙
    - 没有访问过
- 递归过程中需要保存的信息
     - 已经走过的路径
     - 哪些地方访问过
     - 当前所在位置

```cpp
bool solveMaze(vector<string>& maze, int row, int col, vector<pair<int, int>>& path, vector<vector<bool>>& visited)
{
  if (maze[row][col] == 'E') //基本情况
  {
    path.push_back({row,col}); //记录正确路径
    return true;
  }

  visited[row][col] = true; //标记访问过的地方
  path.push_back({row, col}); //添加路径

  int dr[4] = {-1, 1, 0, 0};// 四个方向
  int dc[4] = { 0, 0,-1, 1};

  for (int i = 0; i < 4; i++) //循环四个方向
  {
    int nr = row + dr[i]; //下一步的位置
    int nc = col + dc[i];

    if (nr >= 0 && nr < maze.size() && nc >= 0 && nc < maze[0].size() && maze[nr][nc] != '#' && !visited[nr][nc]) //下一步位置是否可走
    {
      //新一轮 如果true则找到终点 如果false则继续for循环 直到所有路径失败则返回上一个栈帧个false 让它尝试其他格子的四个方向 
      if (solveMaze(maze, nr, nc, path, visited))
      {
        return true;
      }
    // else
    //   return false 错误 这样是给第一个solveMaz false
    }
  }
  path.pop_back();
  return false; //这个false是给 上一个栈帧 也就是上面的if()里的solveMaze 不是第一个solveMaze
}

int main()
{
  vector<string> maze = {
    "#######",
    "#S#  E#",
    "# # # #",
    "#   # #",
    "#######"
};
  vector<pair<int, int>> path;
  vector<vector<bool>> visited(maze.size(), vector<bool>(maze[0].size(), false));

  if(solveMaze(maze,1,1,path,visited))
  {
    for(auto p:path)
    {
      cout << "("
           << p.first
           << ","
           << p.second
           << ")"
           << endl;
    }
  }
  else
  {
    cout << "No path";
  }
  return 0;
}
```

>NOT END

递归就是深度优先搜索（DFS）！

## BFS vs DFS

- BFS通常是迭代的，而DFS则自然地以递归的方式表达
- 虽然在这种特定情况下DFS速度更快，但具体使用哪种搜索策略取决于你要解决的问题
- BFS 会先查看特定长度的所有路径，然后再处理更长的路径，因此它保证能找到最短路径
- DFS不需要存储沿途的所有部分路径，因此它的内存占用比BFS更小

## 总结
回溯递归：探索多种可能的解决方案

总体范式：选择/探索/取消选择


---

 两种实现方式

| 方法 | 说明 | 特点 | 示例 |
|---|---|---|---|
| 选择-探索-撤销 | 使用引用传递（pass by reference），通常用于较大的数据结构 | 通过显式的 **undo（撤销）步骤**，恢复之前对数据结构的修改 | 生成子集（使用一个通过引用传递的集合，记录当前生成的子集） |
| 复制-修改-探索 | 使用值传递（pass by value），通常在内存限制不严格时使用 | 通过修改副本实现隐式撤销，不需要手动恢复状态 | 随着递归过程逐渐构建一个字符串 |

---

 回溯的三种使用场景

| 类型 | 说明 |
|---|---|
| **生成 / 统计所有解** | 枚举所有可能的答案 |
| **寻找一个解** | 找到一个可行方案，或者证明不存在方案 |
| **选择最优解** | 在所有可能方案中找到最佳方案 |

---

 回溯算法常见问题类型

| 类型 | 示例 |
|---|---|
| 排列| 生成所有元素的排列顺序 |
| 子集| 生成所有可能的集合 |
| 组合| 从元素中选择指定数量的组合 |
| 等等 | 其他需要探索所有可能性的搜索问题 |

---

 核心思想总结

回溯算法就是：

1. **做出一个选择（Choose）**
2. **递归探索这个选择带来的结果（Explore）**
3. **撤销选择，回到之前状态（Unchoose）**
4. 尝试其他可能的选择

它本质上是在一棵「决策树」中不断尝试不同路径

# 15. 递归优化及复习
我们如何利用递归回溯法找到极具挑战性问题的最佳解决方案？

## 组合
要确立一项先例，至少需要五位美国最高法院大法官同意,有哪些方法可以选出这五位美国最高法院大法官？

子集与组合
- 我们的目标：我们想从9名法官中选出5名
- 这听起来和我们生成子集时解决的问题非常相似——这5位法官是9位法官的子集
- 组合与子集有何区别？
    - 组合始终具有指定的大小，而子集的大小可以是任意的
    - 我们可以将组合视为**带有约束的子集**
- 我们能否使用S上一节的代码，生成所有子集，然后筛选掉所有大小为5的子集
    - 可以，但这效率太低。让我们开发一种更好的组合方法吧！

生成组合

![combinations](img/combinations.png)

- 一种方法是排除第一个元素，然后从剩下的8个元素中选择5个元素
- 另一种是是包含第一个元素，然后从剩下的8个元素中选择4个元素

编写构建组合的函数
- k 个字符串的每种组合都可以表示为 `set<string>`
- 以前，我们只是简单地打印出所有的解，但如果我们想把所有的解都保存下来，以便以后进行处理呢？
- 我们希望返回一个包含所有可能组合的容器`set<set<string>>` (这种容器嵌套方式并不罕见) 这是我们的函数返回类型
- 基本情况

```text
{A,B,C,D,E,} {F,G}
or
{ }{C,D}
```

无需继续寻找！我们可以返回一个集合，其中包含我们目前为止选择的所有对象 这都是我们的基本情况！

如何定义组合决策树

```text
                    开始
                     |
                    A?
                  /    \
              不选A     选A
               /          \
              B?          B?
            /   \        /   \
         不选B  选B  不选B  选B
           |      |      |      |
          C?     C?     C?     C?
```
- 每一步（树的每一层）的决策
    - 是否将给定元素包含在我们的组合中？
- 每个决策点的选项（每个节点的分支）
    - 包含元素 
    - 不包含元素
- 我们需要在此过程中存储的信息
    - 目前已构建的组合
    - 剩余可供选择的元素
    - **剩余的待填充位置数量**

伪代码

`set<set<string>> combinationsRec(set<string>& remaining, int k, set<string>& chosen)`

- 递归情况
    - 选择：从剩余元素中选择一个元素
    - 探索：尝试包含和排除该元素，并存储结果集合
    - **返回包含和排除两种情况下返回的集合的组合**(注意：这与我们通常的递归模式不同！)
- 基本情况
    - 没有剩余元素可供选择—>返回空集
    - 已选元素已满(`k`已达最大值)->返回已选元素的集合


```cpp
set<set<char>> combinationsRec(set<char>& remaining, int k, set<char>& chosen)
{
  if (k == 0) //基本情况
  {
    return {chosen};
  }

  if (remaining.size() < k)
  {
    return {};
  }

  set<set<char>> result;
  char first = *remaining.begin();
  //选择
  remaining.erase(first);

  //探索
  chosen.insert(first);
  auto include = combinationsRec(remaining, k - 1, chosen);
  result.insert(include.begin(), include.end());

  chosen.erase(first);
  auto exclude = combinationsRec(remaining, k, chosen);
  result.insert(exclude.begin(), exclude.end());

  //撤销
  remaining.insert(first);

  return result;
}

void combinationsRecHelper(set<char>& remaining)
{
  set<char> chosen;
  auto result = combinationsRec(remaining, 3, chosen);
  for (set<char> i : result)
  {
    for (char j : i)
    {
      cout << j << " ";
    }
    cout << endl;
  }
}

int main()
{
  set<char>remaining = {'a', 'b', 'c' ,'d', 'e', 'f'};
  combinationsRecHelper(remaining);
  return 0;
}
```

## 递归优化

### Hard Problems
- 计算机科学中有很多不同类别的问题都被认为是“难以”解决的
     - 正式来说，这些问题被称为“*NP难题*” 选修*CS103*课程可以了解更多！
- 对于这类问题，目前尚无已知的“好”或“高效”的方法来找到问题的最佳解决方案，唯一已知的方法是尝试所有可能的解决方案，然后选择最佳方案 
    - 这些问题通常涉及寻找排列\(O(n!)\)种可能的解决方案or组合\(O(2^n)\)种可能的解决方案） 
- 回溯递归正是解决这类穷举搜索问题的一种优雅且常用的编程方式 

### 背包问题
- 想象一下，你成为了一名专业的野外生存专家，开启了全新的生活
- 你即将踏上一段充满挑战的探险之旅，需要将补给装满背包的物品
- 你有一份清单，上面列满了各种物资（每种物资都有其生存价值和重量）
- 你的背包只能承受一定的重量
- 问题：如何才能**最大限度**地发挥背包的生存价值？

递归方法

思路：枚举权重小于等于 5 的所有子集，并选择总价值最高的子集(这是在生成组合我们最后一个回溯用例是：选择一个最佳解决方案 即优化) 我们需要跟踪所积累的总价值，但对于这个问题，我们暂时无需担心找到最佳的物品子集本身

我们的背包决策树由什么构成？

- 每一步（树的每一层）的决策：
    - 是否将某个物品纳入组合？
- 每个决策的选项（每个节点的分支）：
    - 包含该物品
    - 不包含该物品
- 我们需要存储的信息：
    - 目前为止的总价值
    - 剩余的可选物品
    - 背包的剩余容量（重量）

```cpp
targetWeight = 10; //背包容量

struct BackpackItem
{
  string name;
  int value; //生存价值
  int weight; //重量
};

 vector<BackpackItem> items = {
    {"Water", 10, 5},
    {"Knife", 6, 3},
    {"Food", 8, 4},
    {"Compass", 4, 2},
    {"Tent", 12, 7}
  };
```

`int fillBackpack(vector<BackpackItem>& items, int targetWeight);`

假设我们定义了一个自定义的 BackpackItem 结构体，它包含物品的生存值（int）和重量（int）

我们需要返回在 `targetWeight` 下，所有物品组合所能达到的最大值 

我们需要一个辅助函数 

`int fillBackpackHelper (vector<BackpackItem>& items, int capacityRemaining, int curValue, int index); `

为了提高效率，我们将使用索引来跟踪 `items` 中我们已经查看过的项

伪代码

- 递归情况：
    - 根据索引选择一个未考虑的物品
    - 递归地计算包含和不包含该物品时的值
    - 返回较高的值
- 基本情况：
    - 背包容量已满 → 返回 0（重量小于等于 5 时，这不是有效的组合）
    - 没有更多物品可供选择 → curValue

```cpp
struct BackpackItem
{
  string name;
  int value; // 生存价值
  int weight; // 重量
};

int fillBackpackHelper(vector<BackpackItem> &items, int capacityRemaining,
                       int curValue, int index)
{
  if (index == items.size() || capacityRemaining == 0) // 基本情况
  {
    return curValue;
  }

  // 不选择 without得到的“不选择当前物品后,下面整棵子树能得到的最大价值”
  int without =
      fillBackpackHelper(items, capacityRemaining, curValue, index + 1);

  // 选择 with得到的是“选择当前物品后,下面整棵子树能得到的最大价值”
  int with = curValue;
  if (items[index].weight <= capacityRemaining)
  {
    with = fillBackpackHelper(items, capacityRemaining - items[index].weight,
                              curValue + items[index].value, index + 1);
  }
  else
  {
    with = 0;
  }
  return max(without, with);
}

int fillBackpack(vector<BackpackItem> &items, int targetWeight)
{
  return fillBackpackHelper(items, targetWeight, 0, 0);
}

int main()
{

  vector<BackpackItem> items = {{"Water", 10, 5},
                                {"Knife", 6, 3},
                                {"Food", 8, 4},
                                {"Compass", 4, 2},
                                {"Tent", 12, 7}};
  cout << fillBackpack(items, 10);
  return 0;
}
```

另一种算法*DP*(可防止重复计算)

```cpp
int dfs(vector<BackpackItem>& items, int cap, int index, vector<vector<int>> memo)
{
  if (index == items.size() || cap == 0) //基本情况
    return 0;
  if (memo[index][cap] != -1) //备忘录 如果再次出现相同情况直接返回之前算过的
    return memo[index][cap];

  int without = dfs(items, cap, index + 1, memo); //选择

  int with = 0;
  if (items[index].weight <= cap) //不选择
  {
    with = items[index].value + dfs(items, cap - items[index].weight, index + 1, memo);
  }

  memo[index][cap] = max(with, without);
  return memo[index][cap];

}

int fun(vector<BackpackItem> items, int tw)
{
  vector<vector<int>> memo(items.size(), vector<int>(tw + 1, -1)); //都初始化为 -1
  return dfs(items, tw, 0, memo);
}
```

## 关于递归的结语

现在你知道如何利用递归从不同的角度看待问题，从而找到简洁优雅的解决方案

你已经了解了如何使用递归回溯来枚举某种类型的所有对象，你可以利用它来找到问题的最佳解决方案

你已经了解了如何使用递归回溯来确定某件事是否可行，如果可行，则找到实现它的方法

***恭喜你走到这一步***

两种类型的递归

| 基础递归 | 回溯递归 |
|---|---|
| 一个重复执行的任务，在递归调用栈返回时逐步构建解决方案 | 通过每一步的多个递归调用，构建大量可能的解决方案 |
| 最终的 base case（终止条件）定义了方案的初始种子，每次递归调用都会为解决方案贡献一部分 | 初始递归调用通常携带一个“空”的解决方案作为开始 |
| 初始调用递归函数会直接产生最终解决方案 | 每到达一个 base case，都代表一个可能的解决方案 |

---

回溯递归：探索大量可能的解决方案

整体思想：*choose / explore / unchoose*

---

### 回溯的两种实现方式

| 方法 | 特点 |
|---|---|
| Choose → Explore → Undo | - 通常使用引用传递（pass by reference）<br>- 适用于大型数据结构<br>- 需要显式执行 unchoose（撤销之前对数据结构的修改）<br>- 例：生成子集（subsets），通过引用传递集合来跟踪当前子集 |
| Copy → Edit → Explore | - 通常使用值传递（pass by value）<br>- 当数据规模较小时可以使用<br>- 不需要显式 unchoose，因为复制本身实现了撤销<br>- 例：逐步构造字符串 |

---

### 回溯的三种应用场景

| 类型 | 描述 |
|---|---|
| 1. 生成/统计所有解决方案 | 枚举所有可能情况，例如生成所有组合、排列、子集 |
| 2. 找到一个解决方案（或证明存在） | 找到满足条件的一个答案，例如迷宫路径 |
| 3. 找到最优解决方案 | 在所有可能方案中选择最佳方案，例如最大价值背包 |

---

### 回溯常见问题类型

- 排列
- 子集
- 组合
- 等等

---

### 设计回溯策略时需要问自己的问题

- 我的决策树是什么样的？
  - 每一步有哪些选择？
  - 需要记录哪些信息？

- 我的 base case 和递归情况是什么？

- 提供的函数原型和要求是什么？
  - 是否需要额外的 helper 辅助函数？

- 我们是否关心到达解决方案所经过的路径？
  - 是否需要记录选择过程？

- 这个问题属于哪一种回溯应用？
  - 生成/统计所有方案？
  - 找到一个方案？
  - 找到最佳方案？

- 我们返回的解决方案是什么？
  - 布尔值
  - 最终结果
  - 一组结果
  - 等等

- 我们正在构建什么“可能性集合”来寻找答案？
  - 子集
  - 排列
  - 组合
  - 或其他结构？

# 16. 面向对象编程

![oop](img/oop.png)

> NOT END