## 初始化数据

Vue 构造函数接受 options 参数获取用户传递的配置信息

判断是否有 data 属性，如果有，获取 data 对象（需要判断传递的是对象式还是函数式

## 对象的响应式原理

使用 observe 对 data 进行监听

其本质是使用 Object.keys()获取 data 中的所有属性

通过 Object.defineProperty()设置每一个属性的 set 和 get 方法

### 数据劫持

使用 vm.name,来代替使用 vm.\_data.name 来获取 data 中 name 属性对应的数据

同样是使用 Object.defineProperty(),在 set 和 get 中多嵌套一层\_data

## 数组的函数劫持

由于数组的操作一般使用数组的方法，如 push/pop 等一系列方法。

因而无法使用 Object.defineProperty()来实现数组的劫持，所以重写 7 个会修改数组本身的方法。

通过创建一层新的原型，避免覆盖原来的原型方法实现对数组的重写。

对于新增加的数据，再次调用 observeArray 实现监听。

## AST 模板解析

模板解析整理流程：使用正则表达式匹配开始标签，结束标签，标签属性等信息，提取需要的关键信息，匹配过的内容就截取掉。

解析开始标签是提取它的信息（标签名+标签属性），以对象的形式返回

在解析完开始标签后，如果存在，创建 AST 中的一个 node，通过栈的形式记录当前节点的父节点，以此修改 AST node 的 parent 和 children

解析文本内容则直接生成文本类型的 node，加入到 AST 中

解析结束标签，需要弹出栈顶，表明该元素解析完成，后面不会再出现这个元素的子元素

## 生成 render 函数

这一块主要是细活。将传入的 AST 进行字符串的拼接

属性按照常见属性的形式进行拼接

子元素则全部遍历，根据其元素类型进行不同处理

处理完之后通过 new Function 让其可执行，通过 with 关键字方便直接读取 vm 上的变量

## 执行 render 函数，实现组件挂载

生成 render 函数后，封装一个 mountComponent 方法用于执行 render 函数。

对 render 内部使用到的\_c、\_v、\_s 函数进一步封装。

\_render 函数调用 render 产生虚拟节点

\_update 函数用于将 vnode 转换成真实 dom

其中\_update 中调用 patch 函数用于对组件进行挂载及更新

解析 vnode 的属性，使用提供的 dom api 创建真实 dom

在元素替换时，需要插入到当前替换元素的下一个位置，再把当前元素删除，以此保证元素顺序的一致性。

## 依赖收集

只有在模板中使用到的变量才会做依赖收集

### 概念

watcher：一个 watcher 对应一个组件

dep：一个属性对应一个 dep，用于收集 watcher

dep 与 watcher 的关系：

- 多对多
- n 个 dep 对应 1 个 watcher（n 个属性对应一个组件）
- 1 个 dep 对应多个 watcher（1 个属性对应多个组件）

### 过程

每一个属性都有一个收集器 dep

页面渲染的时候，将渲染逻辑封装到 watcher 中 （作为回调传入）

渲染逻辑：vm.\_update(vm.\_render())

Dep 静态变量全局记录当前 watcher，之后再去调用 getter，去做取值操作

取值时自动调用 defineProperty 的 get 方法

通过 depend 方法，将当前 watcher 存放到 dep 的队列中，同时也让 watcher 记住 dep，实现去重 + 双向收集

当给变量重新赋值时，会自动触发 set 方法，这时候通知这个变量对应 dep 中存放的所有 watcher 进行视图的重新渲染

## 异步更新

就目前上述实现的功能来看，可以实现数据驱动视图了

但是如果多次触发组件内变量的修改，每一个变量的 dep 都会通知其绑定的 watcher 去做视图的重新渲染，造成性能的浪费(改几次值就触发几次重新渲染)

所以采用如下方式进行修改：

当 watcher 被通知要 update 时，只做异步队列的添加

通过对象属性的方式，对 watcher 是否重复做判断，通过 pending 变量的值控制刷新函数只执行一次

开启异步任务，让同步的变量更新都执行完后，最后再做视图的刷新

### nextTick

异步更新后就会出现一个问题，当你更新某个数据，修改了 dom 后，你直接获取 dom，拿到的还是原来没更新的 dom

vue 提供了 nextTick 函数，让底层调用异步更新视图和用户获取异步后的结果用同一套异步逻辑

vue 中使用异步队列的形式保存接受到的全部 cb

不需要每次调用 nextTick 都开启一个异步任务，收集到所有 cb 后，做一次批处理（只开启一次异步，遍历所有 cb，依次执行）即可

nextTick 中使用优雅降级的方式开启异步任务
降级顺序：Promise(ie 不兼容)->MutationObserver(h5 的 api)->setImmediate(ie 专享)->setTimeout

## mixin(混入)

什么是混入？包含一系列混入的选项，使用 mixin 将当前选项混入到当前组件的实例中

开始时 Vue.options 为空对象{}

在 Vue 构造函数上绑定 mixin 方法，调用 mixin 时 实质上是在做 Vue.options 和当前 mixin 配置对象的合并（注意策略中的 key 需要特殊处理，生命周期等需要处理成数组形式，而不是简单的覆盖）

parent 为 Vue.options，child 为 当前 mixin 的配置对象

同时，组件实例身上的配置对象也需要和 Vue.options 进行合并

在初始化组件实例时 将 mergeOptions 函数的返回结果（也就是合并后的结果）作为"新的"组件实例的配置项

## 数组更新实现原理

由于响应式监听是只针对属性的，而属性对应的数组或对象本身是无法做到响应式监听的

所以我们需要给数组或对象本身也加上 dep，当数组新增了某一项，可以触发 dep 更新。当对象新增了属性，可以触发 dep 更新

在构造函数 Observer 中，给每一个 Observer 实例对象都增加 dep 属性，在 getter 中给 Observer 实例对象上的 dep 绑定依赖，在触发数组中重写的原型方法时，通知 watcher 触发更新

但是到此为止只能做到单层的数组更新，通过以下方式让嵌套的数组也能实现视图更新：

在 getter 中如果发现值是数组，则调用 dependArray 方法，该方法对数组中的每一项（如果是数组或对象）添加依赖的收集。如果里面还有数组，则递归调用 dependArray 方法
