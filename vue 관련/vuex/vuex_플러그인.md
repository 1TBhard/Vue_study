# Vuex 플러그인

Vuex store는 각 mutation에 대학 훅을 노출하는 **plugins** 옵션을 설정할 수 있다.  
Vuex 에서 플러그인은 유일하개 전달인자로 받는다.

```js
const myPlugin = store => {
  // 저장소가 초기화 될 때 불립니다.
  store.subscribe((mutation, state) => {
    // 매 변이시마다 불립니다.
    // 변이는 { type, payload } 포맷으로 제공됩니다.
  })
}
```

위를 아래와 같이 사용할 수 있다.

```js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

## 플러그인 내부에서 Mutation 호출(Commit)

플러그인은 state 를 직접 Mutate 할 수 없다.  
따라서 컴포넌트처럼 mutations 를 commit 으로 호출하여 state 를 변경한다.

```js
export default function createWebSocketPlugin(socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if(mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

```js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

## 상태 스냅샷 가져오기

플러그인이 state 의 "스냅샷"을 얻을 수 있고 변이 이후 state 와 이전 state를 비교할 수 도 있다.  
이를 하기 위해서 객체의 **깊은 복사**가 필요하다.(이를 이용해 mutation 이전과 이후를 비교한다.)
> **스냅샷**: 과거의 한 때 존재하고 유지시킨 컴퓨터 파일과 디렉터리의 모임,  
여기에서는 state의 변경된 값을 뜻함

```js
const myPluginWithSnapshot = store => {
  // Mutation 전
  let prevState = _.cloneDeep(store.state)

  store.subscribe((mutation, state) => {
    // Mutation 후
    let nextState = _.cloneDeep(state)

    // prevState와 nextState를 비교하는 코드 ...

    // 다음 변이를 위한 상태 저장
    prevState = nextState
  })
}
```

상태 스냅 샷을 사용하는 플러그인은 개발 중에 만 사용한다.  
webpack 또는 Browserify를 사용하는 경우 빌드 도구가 이를 처리 할 수 있습니다.

```js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production' ? [myPluginWithSnapshot]
    : []
})
```

## 내장 로거 플러그인

vue-devtools 사용하면 필요 없다. [링크](https://vuex.vuejs.org/kr/guide/plugins.html)  
로거 플러그인은 상태 스냅샷을 사용하므로 개발용으로만 사용해야한다.
