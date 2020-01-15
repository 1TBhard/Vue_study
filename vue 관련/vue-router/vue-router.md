# Vue-router

새로고침을 하지 않은채 화면을 변경하게 하는  
SPA(Single Page Application) 과 같은 효과를 낼 수 있다.
[링크](https://router.vuejs.org/kr/guide/#javascript)

vue cli 의 예제는 아래와 같다.

```js
// ./router/index.js
import Vue from 'vue'

// vue-router 가져오기
import Router from 'vue-router'

// 외부에서 컴포넌트 가져오기
import HomePage from '@/components/Home'
import BodyCheckPage from '@/components/NaviItems/BodyCheckPage'
import LoginPage from '@/components/NaviItems/LoginPage'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/body-check', /
      name: 'BodyCheckPage',
      props: true,
      component: BodyCheckPage
    },
    {
      path: '/login-page',
      name: 'LoginPage',
      component: LoginPage
    },
  ]
})
```

```js
// ./main.js
import Vue from 'vue'
import App from './App'
import router from './router'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```

```html
<!-- ./App.vue -->
<template>
  <div id="app">
    <div id="screen" >
      <!-- 이 부분만 화면이 바뀌게 됨 -->
      <router-view/>
    </div>
  </div>
</template>
```

\<router-link>는 현재 라우트와 일치할 때 자동으로 .router-link-active 클래스가 추가된다.

<br/>

## 동적 라우트 매칭

주어진 패턴을 가진 라우트를 동일한 컴포넌트에 매핑할 수 있다.  
vue-router는 라우트 매칭 엔진으로 [path-to-regexp](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) 를 사용한다. [예제](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js)

심볼| 설명| $route.params
:--:|:--|:--:|
:string| 해당 string이 필요| /user/:username  
:string?| 해당 string 있어도 없어도 됨| /user/:username?
:string(정규식)| 정규식에 해당하는 것 매칭| /params-with-regex/:id(\\d+)
\*| 모든 것과 매칭| /asterisk/*
(component/)?| 괄호를 씌워 ?를 사용하면 <br/>해당 path 있어도 없어도 됨 | '/optional-group/(foo/)?bar

### 매칭 우선순위

동일한 URL이 여러 라우트와 일치하는 경우에는 경로가 더 먼저 정의 될수록 우선 순위가 높다.

<br/>

## 중첩 라우트

라우트에서 다음과 같이 경로가 중간까지 동일한 것이 있을 수 있다.

```cmd
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

vue-router를 이용하여 