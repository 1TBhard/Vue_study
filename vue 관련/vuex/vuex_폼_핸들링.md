# Vuex 폼 핸들링

strict 모드에서는 Vuex 변이 처리기 내부에서 변이가 수행되지 않는다.
> **strict 모드** :  디버깅 도구로 모든 상태 변이를 명시적으로 추적한다.  
> (Vuex 상태가 변이 핸들러 외부에서 변이 될 때 마다 오류가 발생)
>
> ```js
> const store = new Vuex.Store({
>   // ...
>   strict: true
>   // 배포시에는 이를 사용하면 안된다. 따라서, 아래와 같이 사용될 수 도 있다.
>   // strict: process.env.NODE_ENV !== 'production'
> })
> ```

따라서, 아래와 같이 **v-model** 을 사용하는 것은 힘들 수 있다.

```html
<!-- 
obj.message 를 v-model 이 직접 변경하려 하므로 strict 모드 때문에 에러가 발생!!
-->
...
<div id="app">
  {{message}}<br>
  <input v-model="obj.message">
</div>
```

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    message: 'Hello Vuex',
  },
  mutations: {
  }
})

import { mapState } from 'vuex';

new Vue({ 
  el: '#app',
  store,
  data: {
  },
  computed: {
    message () {
      return this.$store.state.message
    }
  },
  methods: {
  }
})
```

위의 예제로 v-model 인 \<input> 에 값을 입력하여 변경하는 경우 에러가 발생한다.  
이를 위한 해결법은 아래와 같다.

- \<input> 의 값을 바인딩하고 input 또는 change 이벤트에 대한 액션을 호출한다.

```html
<!-- input 값을 바인딩 -->
<input :value"msg" @input="updateMsg">
```

```js
computed: {
  ...mapState({
    msg: state => state.obj.msg
  })
},

methods: {
  // change 이벤트에 대한 액션
  updateMsg(e) {
    this.$store.commit('updateMsg', e.target.value)
  }
}
}
```

mutations 에 대한 핸들러

```js
// ...
mutations: {
  updateMessage (state, msg) {
    state.obj.msg = msg
  }
}
```

## 양방향 computed 속성

위의 해결 방법으로는 **v-model** 의 양방향 bind 을 활용하지 못한다.  
따라서, computed 속성에 get, set을 설정하여 state를 바꾸고 그에 맞춰 v-model이 변경을 감지하게 한다.

```html
<input v-model="message">
```

```js
// computed 의 msg의 get, set을 설정하여 값 출력, 변경하게 함
computed: {
  msg: {
    get () {
      return this.$store.state.obj.msg
    },
    set (value) {
      this.$store.commit('updateMsg', value)
    }
  }
}
```
