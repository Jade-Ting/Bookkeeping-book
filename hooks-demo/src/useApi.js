/**
 * 自定义hook
 */
import { useEffect, useState } from 'react'

// 模拟接口数据
const getList = (query) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([6, 7, 8, 9, 10])
    }, 3000)
  })
}

function useApi() {
  const [data, setData] = useState([1, 2, 3, 4, 5])
  const [query, setQuery] = useState('')

  /**
   * useEffect接收两个参数
   * 第一个参数是个回调函数，函数组件默认会执行这个回调函数
   * 第二个参数，是一个数组，数组内接收回调函数内使用的状态参数(我理解就是useState的变量)，
   *    一旦在组件内改变了状态参数，就会触发副作用useEffect的执行
   *    如果传入 [] 空数组，只会在组件渲染时执行一次
   */
  useEffect(() => {
    (async () => {
      const data = await getList(query)
      setData([...data])
      // setData执行后，组件会刷新，刷新后会再次执行useEffect的回调函数
      // 此时useEffect第二个参数是空数组，所以只会执行一次，如果useEffect没有参数，就会变成循环调用
      // 【注意】这里会执行两次，是react18的新特性，仅在开发环境触发，生产环境和原来一样，只执行一次
      console.log(data)
    })()
  }, [query])

  return [{data}, setQuery]
}

export default useApi
