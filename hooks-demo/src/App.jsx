import { useCallback, useEffect, useMemo, useState } from 'react'
import useApi from './useApi'
import './App.css'

function Child({data, callback}) {
  useEffect(() => {
    console.log('查询条件：', data)
  }, [data])

  useEffect(() => {
    callback()
  }, [callback])

  return (
    <div>我是子组件</div>
  )
}


function App() {
  // 使用自定义hook
  const [{data}, setQuery] = useApi([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [kw, setKw] = useState('')
  const [count, setCount] = useState(0)

  // 这里没有传递 kw 给子组件，，因此子组件并没有监听kw，但是在下面触发setKw修改kw的值后，data的值和没有修改kw之前的值已经不一样了
  // 但是这里触发setKw修改kw的值后，data的值并没有改变，为什么说已经不一样了呢？据说后面会说，那我们先放在这好了
  // TODO: 待解答：为什么说data值不一样了，但是我们看到的值又没有改变

  // 这里我们可以用useMemo将data1包装下，告诉他监听哪些值
  // useMemo相当于把父组件需要传递的值做了标记，无论父组件其他状态更新任何值，都不会影响要传递给子组件的对象
  const data1 = useMemo(() => ({
    name,
    phone
  }), [name, phone])

  // 没有添加useCallback之前，组件更新其他状态参数都会触发子组件的回调函数执行
  // 包裹一层useCallback，无论修改其他任何属性，都不会触发子组件的副作用
  const callback = useCallback(() => {
    console.log('我是callback')
  }, [])

  // useEffect，useuseCallback，useuseMemo的第二个参数都是用于监听需要监听的变量
  // useuseCallback，useuseMemo都为避免重复渲染提供了帮助
// ---------------------------------------------------

  // 此时count快照记录的是在handleClick执行前的count+1
  const handleClick = () => {
    setTimeout(() => {
      console.log('点击次数: ' + count);
    }, 3000);
  }

  // 每次渲染函数时，useEffect都是新的，每次点击`点击次数：4`，都会重新执行useEffect内的回调，count也是当时点击的快照
  useEffect(() => {
    setTimeout(() => {
      console.log('使用useEffect更新点击次数: ' + count);
    }, 3000);
  })

  return (
    <div className='App'>
      <div className='useEffect-demo'>
        1. 学习useEffect
        <input onChange={(e) => setQuery(e.target.value)} type="text" placeholder='请输入搜索值' />
        {
          data.map((item, index) => <span key={index}>{item}</span>)
        }
      </div>

      <div className='useMemo-useCallback-demo'>
      <hr/>
        2. 学习useMemo，useCallback
        <input onChange={(e) => setName(e.target.value)} type="text" placeholder='请输入姓名' />
        <input onChange={(e) => setPhone(e.target.value)} type="text" placeholder='请输入电话' />
        <input onChange={(e) => setKw(e.target.value)} type="text" placeholder='请输入关键词' />
        <Child data={data1} callback={callback}/>
      </div>

      <div className='useEffect-demo-plus'>
      <hr/>
        3. 重新认识useEffect
        <div>
          <p>我们作下列动作</p>
          <ul>
            <li>1、点击增加按钮两次，将 count 增加到 2。</li>
            <li>2、点击「展示点击次数」。</li>
            <li>3、在 console.log 执行之前，也就是 3 秒内，再次点击新增按钮 2 次，将 count 增加到 4。</li>
          </ul>
        </div>
        <button onClick={() => setCount(count + 1)}>点击{count}次</button>
        <button onClick={handleClick}>展示点击次数</button>
        <div>
          按照正常的思路，这时候浏览器应该打印出`点击次数：4`，但是我们可以看到3秒后，浏览器还是打印出 `点击次数：2`

          这是因为默认进来的时候，形成一个快照，此时count=0，当我们点击`点击X次`按钮时触发setCount，函数组件被刷新，此时的快照count=1，并且每次点击都+1
          当点击两次后再点击`展示点击次数`按钮时记录的是快照count=2，所以后面再怎么点击`点击X次`按钮都不会变
        </div>
      </div>
    </div>
  )
}

export default App
