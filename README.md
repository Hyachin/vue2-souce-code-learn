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
