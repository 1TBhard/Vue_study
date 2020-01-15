# 핫 리로딩

Vuex는 webpack 의 핫 모듈 변경 API를 사용해 핫 리로드 mutation, module, action, getter를 지원한다.  

## mutaion, module

이 경우 **store.hotUpdate()** API 메서드가 필요하다.
예제는 아래와 같다. [링크](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot)

```js
// ./app.js
import Vue from 'vue'
import store from './store'
import CounterControls from './CounterControls.vue'

new Vue({
  el: '#app',
  store,
  render: h => h(CounterControls)
})
```

```js
// ./store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  count: 0,
  history: []
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

if (module.hot) {
  // 액션과 변이를 핫 모듈로 받아 들인다.
  module.hot.accept([
    // 업데이트 된 모듈은 babel 6 모듈 출력으로 인해
    // .default를 여기에 추가
    './getters',
    './actions',
    './mutations'
 ], () => {

  // store.hotUpdate() 사용!!
  // 새로운 액션과 변이로 바꾼다.
  store.hotUpdate({
    getters: require('./getters'),
    actions: require('./actions'),
    mutations: require('./mutations')
  })
  })
}

export default store
```

```js
// ./store/actions.js
export const increment = ({ commit }) => {
  commit('increment')
}
export const decrement = ({ commit }) => {
  commit('decrement')
}

export const incrementIfOdd = ({ commit, state }) => {
  if ((state.count + 1) % 2 === 0) {
    commit('increment')
  }
}

export const incrementAsync = ({ commit }) => {
  setTimeout(() => {
    commit('increment')
  }, 1000)
}
```

```js
// ./store/getters.js
export const count = state => state.count

const limit = 5

export const recentHistory = state => {
  const end = state.history.length
  const begin = end - limit < 0 ? 0 : end - limit
  return state.history
    .slice(begin, end)
    .join(', ')
}
```

```js
// ./store/mutations.js
export const increment = state => {
  state.count++
  state.history.push('increment')
}

export const decrement = state => {
  state.count--
  state.history.push('decrement')
}
```