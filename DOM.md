### React 中的虚拟DOM
如果没有React 如何state render功能实现？
1. state 先有数据 
2. JSX 模版 render函数内JSX代码
3. 数据 + 模版结合,生成真实的DOM,来显示。  
4. state 数据发生改变
5. 数据+模版结合,生成真实的DOM,替换原始的DOM 

缺陷:
1. 第一次生成了一个完整的DOM片段 
2. 第二次生成了一个完整的DOM片段 
3. 第二次的DOM替換第一次的DOM,非常耗性能

优化：
1. state 数据
2. JSX 模板
3. 数据 + 模版结合,生成真实的DOM,来显示。
4. state 发生改变
5. 数据 + 模板结合，生成真实的DOM，并不直接替换原始的DOM
6. 新的DOM（DoucumentFragment） 和 原始的DOM 做对比，找差异（损耗性能）
7. 找出input框发生的变化
8. 只使用新的DOM中的INPUT元素，替换掉老得DOM中的INPUT元素（节约DOM替换）

缺陷：
性能的提升并不明显

#### React 提出虚拟DOM方案
1. state 数据
2. JSX 模板
3. 数据 + 模板 结合，生成真实的DOM，来显示<div id="abc"><span>hello wordl</span></div>
4. 生成虚拟DOM(虚拟DOM就是一个JS对象,用它来描述真实的DOM) （损耗了性能）['div', {id: 'abc'}, ['span',{},'hello world']] [ 便签，属性，子节点]
5. state 发生变化
6. 数据+模板，生成新的虚拟DOM（极大的提升了性能）['div', {id: 'abc'}, ['span',{},'bye bye']]
7. 比较原始虚拟DOM和新的虚拟DOM的区别，找到区别是span中的内容（极大的提升性能）
8. 直接操作DOM，改变span中的内容


3 和 4 互换
3. 生成虚拟DOM(虚拟DOM就是一个JS对象,用它来描述真实的DOM) （损耗了性能）
4. 用虚拟DOM的结构生成真实的DOM，来显示
<div id="abc"><span>hello wordl</span></div>
