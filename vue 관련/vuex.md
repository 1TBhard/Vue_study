# Vuex

Vue에서 컴포넌트를 분리하면 각 컴포넌트끼리 데이터 바인딩이 어렵다.  
**Vuex**는 이런 문제를 해결해주는 **상태 관리를 위한 라이브러리** 이다.

> **상태 관리**: 여러 컴포넌트 사이에 전달되는 데이터 및 이벤트 통신을 관리하는 패턴을 의미한다.

Vuex를 사용하면 아래와 같은 이점이 있다.

- 컴포넌트간의 통신을 한곳에서 제어
- 컴포넌트 간 데이터 흐름을 파악

Vuex의 전체 흐름도는 아래와 같다.
<img max-width="800px" src="./pic/vuex.png"/>

## 설치

- 직접 다운로드  

    [https://unpkg.com/vuex](https://unpkg.com/vuex) 이 링크는 항상 NPM의 최신 릴리스를 가리킴

    ```html
    <script src="/path/to/vue.js"></script>
    <script src="/path/to/vuex.js"></script>
    ```

- npm

    ```cmd
    npm install vuex --save
    ```

- yarn

    ```cmd
    yarn add vuex
    ```

모듈 시스템과 함께 사용하면 Vue.use()를 통해 Vuex를 명시적으로 추가

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

<br/>

## 사용법

### 1. Vuex 등록

```javascript
// main.js
import Vue from "vue";
import App from "./App.vue";

// store.js를 불러오는 코드
import { store } from "./store";
```

### 2. state 등록

state(바인딩되는 변수)를 추가한다.

```javascript
// store.js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  // counter라는 state 속성을 추가
  state: {
    counter: 0
  }
});
```

### 3. state 접근

state에 등록한 counter속성은 컴포넌트의 템플릿 코드에서 **this.$store**.state.counter로 접근할 수 있다.
> **this.$store**를 호출할때는 **반드시 화살표 함수가 아닌 일반 함수로 해야한다.**   
화살표 함수와 일반함수는 작동방식이 다르므로 서로 다른 this를 호출한디.

```html
<!-- App.vue(Parent) -->
<div id="app">
  Parent counter : {{ $store.state.counter }} <br />
  <button @click="addCounter">+</button>
  <button @click="subCounter">-</button>

  <!-- 기존 코드 -->
  <!-- <child v-bind:num="counter"></child> -->
  <child></child>
</div>
```

```javascript
// App.vue(부모 컴포넌트)
import Child from "./Child.vue";

export default {
  components: {
    child: Child
  },
  // 기존 코드
  // data () {
  //   return {
  //     counter: 0
  //   }
  // },
  methods: {
    addCounter() {
      // store.js를 store로 등록하였기 때문에
      // this.$store 로 접근가능
      // 아래는 state의 counter를 1 증가시킴
      this.$store.state.counter++;
    },
    subCounter() {
      this.$store.state.counter--;
    }
  }
};
```

위의 코드에서 기존 코드와 다른 점

- 부모가 data를 child로 전달하지 않음
- child 에서 data를 명시 하지 않음(data() 함수에 등록 안함)
- 부모, 자식 컴포넌트가 Vuex의 Store의 state의 변수를 참조
- 부모, 자식 컴포넌트 뿐만 아니라 **다른 컴포넌트들도 변수 참조 가능**

```html
// child 컴포넌트
<div>
  <hr />
  Child counter : {{ $store.state.counter }} <br />
  <button>+</button>
  <button>-</button>
</div>
```

```javascript
export default {
  // 기존 코드
  // props: ['passedCounter']
};
```

<br/>

## Getter

중앙 데이터 관리식 구조에서 발생하는 문제점 중 하나는 각 컴포넌트에서 Vuex 의 데이터를 접근할 때 중복된 코드를 반복호출하는 것이다.

```js
// App.vue
computed: {
  doubleCounter() {
    return this.$store.state.counter * 2;
  }
},

// Child.vue
computed: {
  doubleCounter() {
    return this.$store.state.counter * 2;
  }
},
```

따라서 Vuex에서 수행하도록 Getter을 사용하여 아래와 같이 바꿀 수 있다.

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
    ]
  },

  getters: {
    // todo 에서 done == true 인것 반환
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    },

    // todo에서 done == true 인 것의 개수 반환
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },

    // todo의 id로 todo의 요소 반환
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
});

new Vue({
  el: '#app',
  store,
  data: {
  },

  // conputed 속성으로 vuex의 store 참조가능
  // 등록된 getters 를 각 컴포넌트에서 사용하려면 this.$store 를 이용
  // 아래는 getter의 doneTodosCount 메서드를 실행
  computed: {
    doneTodosCount () {
      return this.$store.getters.doneTodosCount
    }
  }
});
```

```html
<html>
  <head>
    <link rel="stylesheet" href="index.css">
  </head>
  <body>
    <div id="app">
      <!-- computed 의 doneToDosCount가 반환하는 것을 출력 -->
      Completed Todos: {{ doneTodosCount }}
    </div>
    <script src="index.pack.js"></script>
  </body>
</html>
```

### **mapGetters** 헬퍼

getter를 로컬 계산된 속성에 매핑하여 코드를 직관적으로 작성할 수 있다.
그러나 **컴포넌트 자체에서 사용할 computed 속성과 함께 사용할 수 없다.**  
해결방안은 ES6 의 문법 ... 을 사용

```js
// 이를 사용해야 mapGetter 사용 가능
import { mapGetters } from 'vuex';

new Vue({ 
  el: '#app',
  store,
  data: {
  },
  computed: mapGetters([
    'doneTodos', 'doneTodosCount', 'getTodoById'
  ])
  // 컴포넌트 자체에서 사용하기
  // ES6 문법의 ... 사용
  // computed: {
  //     ...mapGetters([
  //         'doneTodos', 'doneTodosCount', 'getTodoById'
  //     ])
  // }
});
```

mapGetters 의 매개변수로 리스트가 아닌 객체를 사용가능

```js
// 이를 사용해야 mapGetter 사용 가능
import { mapGetters } from 'vuex';

new Vue({ 
  el: '#app',
  store,
  data: {
  },

  // 리스트가 아닌 object가 매개변수로
  // 이를 사용하면 doneTodos 대신 cnt1 이런식으로 사용가능
  computed: mapGetters({
    cnt1: 'doneTodos',
    cnt2: 'doneTodosCount',
    cnt3: 'getTodoById'
  })
});
```

```html
<html>
  <head>
    <link rel="stylesheet" href="index.css">
  </head>
  <body>
    <div id="app">
      <!-- computed 의 doneToDosCount가 반환하는 것을 출력 -->
      {{ cnt1 }}         <!-- [ { "id": 1, "text": "...", "done": true } ] -->
      {{ cnt2 }}         <!-- 1 -->
      {{ cnt3(1) }}      <!-- { "id": 1, "text": "...", "done": true } -->
    </div>
    <script src="index.pack.js"></script>
  </body>
</html>
```

<br/>

## Mutations

Vuex store 에서 실제로 state를 변경하는 유일한 방법이다. 즉, **State를 관리**  
Getter과 차이점은 아래와 같다.

- **Getters** 는 값에 접근만 가능, **Mutation** 은 값을 변경
- 인자를 받아 Vuex 에 넘길 수 있다.
- computed 가 아닌 methods에 등록한다.
- 상태 변화를 명시적으로 수행함으로서 **테스팅, 디버깅, Vue의 Reactive 성질을 준수**

    예 - Mutation 이 아닌 직접 접근방식

    ```js
    return this.$store.state.counter++;
    return this.$store.state.counter;
    ```

  - 위는 컴포넌트에서 직접 state에 접근하였으나 [Vue 의 Reactivity 체계](https://kr.vuejs.org/v2/guide/reactivity.html)와 상태관리 패턴에 맞지 않은 구현방식
  - state 값을 동시에 제어하면 어느 컴포넌트의 호출로 인한 변경인 것인지 추적 어려움

사용예

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },

  mutations: {
    increment (state) {
      // 상태 변이
      state.count++
    },

    // 페이로드(추가 전달인자)를 가진 커밋
    amount_increment (state, n) {
        state.count += n
    },

    // 페이로드를 객체로 사용가능
    obj_increment (state, payload) {
        state.count += payload.amount
    }
  }
})
```

변이 핸들러를 직접 호출 할 수는 없으며 **store.commit()** 으로 호출한다.

```js
// this.$store.mutations.increment 처럼 접근 불가
// 기본형
store.commit('increment')

// 페이로드를 가진 커밋
store.commit('amount_increment', 2)

// 혹은 객체 스타일로 다음과 같이 가능
store.commit({
    type: 'obj_increment',
    amount: 10
})

```

### 변이 타입에 상수 사용

모든 상수를 단일 파일에 저장하는 방법이다. 이는 아래와 같다.

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // ES2015에서 계산 된 프로퍼티 이름 기능을 사용하여
    // 상수를 함수 이름으로 사용할 수 있습니다
    [SOME_MUTATION] (state) {
      // 변이 상태
    }
  }
})
```

### MapMutation

mapGetter과 마찬가지로 이를 사용하여 코드의 가독성을 높일 수 있다.

```js
import { mapMutations } from 'vuex'

  methods: {
    // Vuex 의 Mutations 메서드 명과 App.vue 메서드 명이 동일할 때 [] 사용
    ...mapMutations([
      'increment',
      'amount_increment',
      'obj_increment'
    ]),
  }
```

```html
<html>
  <head>
      <link rel="stylesheet" href="index.css">
  </head>
  <body>
    <div id="app">
      {{count}}
      <button @click='increment'>+</button>

      <!-- 추가 인자 들어가는 것은 () 처리해서 매개변수 처럼 넣어줌 -->
      <button @click='amount_increment(2)'>-</button>
    </div>
    <script src="index.pack.js"></script>
  </body>
</html>
```

<br/>

## Action

Mutation 과 비슷하며 차이점은 아래와 같다.

- Mutations 는 **동기적** 로직을 정의
- Actions 는 **비동기적** 로직을 정의

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  ...

  // 비동기 로직이 들어감
  actions: {
    incrementAsync ({ commit }) {
      setTimeout(() => {
        // Mutation 과는 달리 store 에서 commit 사용
        // Mutation 은 store 밖에서 store.commit('increment')로 호출
        commit('increment')
      }, 1000)
    }
  }
})
```

- Atcion은 dispatch() 를 사용하여 호출한다.
- store.dispatch() 에 트리거 된 액션 핸들러(함수)에 의해 반환된 Promise를 처리 할 수 있다.
- store.dispatch() Promise를 반환한다

아래는 컴포넌트 내부에서 dispatch() 액션을 사용하는 예이다.

```js
import { mapState, mapMutations } from 'vuex';

new Vue({ 
  el: '#app',
  store,
  data: {
  },
  computed: mapState([ 'count' ]),
  methods: {
    increment () {
      // dispatch를 사용하여 store의 actions의 increment를 commit 하는 효과를 냄
      this.$store.dispatch('incrementAsync');
    },
    decrement () {
      this.$store.commit('decrement');
    },
  }
});
```

좀 더 어려운 예

```js
import { mapState, mapMutations } from 'vuex';

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    },
    decrement (state) {
      state.count--
    }
  },
  actions: {
    actionA ({ commit }) {
      // action은 프로미스를 반환 및 promise를 반환하는 액션 핸들러 처리가능
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mutation의 메서드를 호출하는 경우 commit() 사용
          commit('someMutation')
          resolve()
        }, 1000)
      })
    },

    // action에서 action 호출 가능(dispatch() 사용)
    actionB ({ dispatch, commit }) {
      return dispatch('actionA').then(() => {
        commit('someOtherMutation')
      })
    },

    async actionC ({ commit }) {
      // await getData()를 payload 로 사용
      // getData() 가 Promise 를 반환!!!!
      // 그 데이터를 gotData의 파라매터로 넘김
      commit('gotData', await getData())
    },

    async actionD ({ dispatch, commit} ) {
      await dispatch('actionC')

      // 액션은 동일한 페이로드 타입과 객체 스타일의 dispatch()를 지원
      // 이또한 getOtherData() 가 Promise 를 반환
      commit('gotOtherData', await getOtherData())
    }
  }
});
```

> **Promise** : 비동기 작업이 맞이할 미래의 완료 또는 실패와 그 결과 값

### mapActions

mapGetters, mapMutations 과 마찬가지로 mapActions 도 동일한 방식으로 사용

```js
import {mapActions} from 'vuex';

export default {
  methods: {
    ...mapActions([
      'example_action_1',
      'example_action_2'
    ])
  },
}
```

<br/>

## Module

단일 상태 트리를 사용하기 때문에 커다란 애플리 케이션은 store 가 아주 커질 수 있다.  
예를들어 아래와 같이 커질 수 있다.

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA'의 상태
store.state.b // -> moduleB'의 상태
```

따라서, state, getters, mutations, actions 를 store 안에 모듈로 나눈다.

### 지역 상태 모듈

모듈의 **mutations**, **getters** 의 핸들러의 첫 번째 전달인자는 모듈의 **local state** 가 된다.

```js
const moduleA = {
  state: { count: 0 },

  mutations: {
    increment (state) {
      // state는 지역 모듈의 state
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      // state는 지역 모듈의 state
      return state.count * 2
    }
  }
}
```

모듈의 **actions** 의 핸들러의 첫번째 인자는 **context** 이다.  
내부 모듈에서는 **context.state** 는 **로컬 state** 를 나타내며  **루트 state** 는 **contesxt.rootstate** 가 된다.

```js
const moduleA = {
  state: { count: 0 }
  // ...

  actions: {
    // 여기에서 state는 
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

**getter** 의 핸들러에서도 **루트 state** 를 접근할 수 있다.  
**getter** 의 핸들러의 세번째 인자는 **루트 state** 이다.

```js
const moduleA = {
  // ...
  getters: {
    // 3번째 인자인 rootState 가 루트 state가 됨
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }  12
  }
}
```

### namespace

**기본적으로 모듈 내의 액션, 변이 및 getter는 전역 네임 스페이스 아래에 등록**된다.  
이로 인해 여러 모듈이 뒤섞이는 오류가 발생할 수 있다.(같은 이름 전역 변수 문제처럼)  
따라서 해당 블록안에 **namespace: true** 를 설정하여 구분짓게 한다.

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 모듈 자산
      state: { ... }, // 모듈 상태는 이미 중첩되어 있고, 네임스페이스 옵션의 영향을 받지 않음
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 중첩 모듈
      modules: {
        // 부모 모듈로부터 네임스페이스를 상속받음
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 네임스페이스를 더 중첩
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

### 네임스페이스 모듈에서 전역 property 접근

- 전역 상태나 getter를 사용하기 위해 rootState와 rootGetters가 getter 함수의 3번째와 4번째 인자로 전달한다.

- 전역 네임스페이스의 **actions**을 dispatch 하거나 **mutations**를 commit 하려면  
dispatch와 commit에 3번째 인자로 **{ root: true }** 를 전달한다.

```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters`는 해당 모듈의 지역화된 getters
      // getters의 4번째 인자를 통해서 rootGetters 사용 가능
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 디스패치와 커밋도 해당 모듈의 지역화된 것
      // 전역 디스패치/커밋을 위한 `root` 옵션 설정 가능
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter            // -> 'foo/someGetter'
        rootGetters.someGetter        // -> 'someGetter'

        dispatch('someOtherAction')                       // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation')                       // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

- **전역 액션** 또한 네임스페이스 모듈에서 **root: true** 를 표시한다.

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          // 전역 액션 등록
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

### 헬퍼에서 네임스페이스 바인딩

mapState, mapGetters, mapActions 그리고 mapMutations 헬퍼를 모듈에 바인딩할 때  
아래와 같이 어려움

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    // 모듈 path를 다 적어줘야함
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

따라서, 모듈의 네임스페이스 문자열을 헬퍼의 첫 번째 인수로 전달하여  
해당 모듈을 컨텍스트로 사용하여 모든 바인딩한다.

```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  // 공통되는 path를 첫번째 인수로 전달
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

**createNamespacedHelpers** 를 사용하여 네임스페이스 헬퍼를 생성할 수도 있다.

```js
import { createNamespacedHelpers } from 'vuex'

// 네임스페이스 헬퍼 생성
const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 'some/nested/module' 에서 찾음
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 'some/nested/module' 에서 찾음
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

> **[플러그인 개발자를 위한 주의 사항](https://vuex.vuejs.org/kr/guide/modules.html)**  
>
> 플러그인을 개발할 때는 사용자의 Vues store와 namespace 오류를 주의해야한다.  
플러그인 사용자가 특정 모듈을 namespace 모듈 하위에 추가하면  
해당 모듈도 동일한 namespace스로 등록된다. 따라서 **플러그인 옵션**을 통해  
namespace 값을 전달받을 수 있어야한다.
>
> ```js
> // 플러그인 옵션을 통해 네임스페이스 값 전달
> // 그리고 Vuex 플러그인 함수를 반환
> export function createPlugin (options = {}) {
>   return function (store) {
>     // add namespace to plugin module's types
>     const namespace = options.namespace || ''
>     store.dispatch(namespace + 'pluginAction')
>   }
> }
> ```

### 동적 모듈 등록

동적 모듈 등록을 사용하면 다른 Vue 플러그인도 애플리케이션의 저장소에 모듈을 연결하여  
상태 관리에 Vuex를 활용할 수 있다. 예를 들어 [vuex-router-sync](https://github.com/vuejs/vuex-router-sync) 라이브러리는 동적으로 연결된 모듈에서  
애플리케이션의 라우트 상태를 관리해 vue-router와 vuex를 통합한다.

**store.registerModule 메소드**로 저장소가 생성 된 후에 모듈을 등록 할 수 있다.

```js
store.registerModule('myModule', {
  // ...
})

// `nested/myModule` 중첩 모듈 등록
store.registerModule(['nested', 'myModule'], {
  // ...
})

// 이때 모듈의 상태는
// store.state.myModule와
// store.state.nested.myModule로 노출
```

- **store.unregisterModule(moduleName)** 을 사용하여 동적으로 등록 된 모듈을 제거 가능  
( 이 방법으로는 정적 모듈(저장소 생성시 선언 됨)을 제거 할 수 없다. )

- 새 모듈을 등록할 때 이전 상태를 유지하고자 할 때는 **preserveState 옵션** 을 사용한다.

  ```js
  store.registerModule('a', module, { preserveState: true })
  ```

### 모듈 재사용

한 모듈에서 여러 인스턴스를 생성할 때 일반 객체를 사용하여 모듈의 상태를 선언하면  
상태 객체가 참조에 의해 공유되고 변이될 때 교차 저장소 혹은 모듈의 상태가 오염된다.

이의 예는 아래와 같다.  

- 동일 모듈을 사용하는 여러 저장소 생성 (예. [SSR 에서 싱글톤 상태 피하기](https://ssr.vuejs.org/guide/structure.html#avoid-stateful-singletons) 에서 runInNewContext 옵션이 false나 once일 때)
  > SSR(서버 사이드 렌더링)에서 싱글톤 객체를 만들어 들어오는 모든 요청간에 공유할 수 있다.

- 동일 모듈을 동일 저장소에 여러 번 등록

따라서, 이를 피하기 위해 data를 함수로 return 하듯이 **함수를 사용하여 모듈 상태를 선언**한다.

```js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // 변이, 액션, getters...
}
```
