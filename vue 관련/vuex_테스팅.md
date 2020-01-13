# 테스팅

Vuex에서 단위 테스트를 할때 주로 mutations, actions 를 진행한다.

## mutaions 테스팅

mutations 는 전달인자에 완전히 의존하는 함수이기 때문에 테스트가 쉽다.  
ES2015 모듈을 사용하고 store.js 파일에 변이를 넣는다면  
export를 사용하여 

```js
const state = { ... }

// export를 이용하여 mutations를 내보낸다.
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

```js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```

```js
// mutations.spec.js
import { expect } from 'test'
import { mutations } from './store'

// mutations 가져오기
cons { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock state
    const state = { count:0 }

    // mutations 작용
    increment(state)

    // 결과 확인
    expect(state.count).to.equal(1)
  })
})
```

## Actions 테스팅

actions는 비동기 및 외부 API를 호출할 수 있기 때문에 까다롭다.  
API 호출을 서비스로 추상화하고 테스트 내에서 해당 서비스를 조작한다.  
> 의존성을 쉽게 모방하기 위해 webpack과 [inject-loader](https://github.com/plasticine/inject-loader)를 사용하여 테스트 파일을 묶을 수 있다.

```js
// actions.js
import shop from '../api/shop'

// 객체를 인자로 받는 함수
export const getAllProducts = ({ commit }) => {
  commit('REQUEST_PRODUCTS')

  shop.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}
```

```js
// actions.spec.js

// 인라인 로더에는 require 구문을 사용하십시오.
// inject-loader를 사용하면 조작된 의존성을
// 주입 할 수있는 모듈 팩토리가 반환됩니다.
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// 조작된 모의 응답과 함께 모듈 생성
const actions = actionsInjector({
  '../api/shop': {

    getProducts (cb) {
      setTimeout(() => {
        cb([ /* 모의 응답 */ ])
      }, 100)
    }
  }
})

// 예상되는 변이와 함께 테스팅 액션을 도와주는 헬퍼
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // 모의 커밋
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(type).to.equal(mutation.type)
      if (payload) {
        expect(payload).to.deep.equal(mutation.payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // 모의 저장소와 전달인자로 액션을 부릅니다.
  action({ commit, state }, payload)

  // 디스패치된 변이가 없는지 확인
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {

    // { type: 'REQUEST_PRODUCTS' },
    // { type: 'RECEIVE_PRODUCTS', payload: { /* 모의 응답 */ }
    // 이 둘의 actions 결과 같은지 확인
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* 모의 응답 */ } }
    ], done)
  })
})
```

사용하는 테스팅 환경에서 스파이를 사용할 수 있다면 (예를 들어 [Sinon.JS](https://sinonjs.org/)같은)  
testAction 헬퍼 대신에 스파이를 사용할 수 있다.

```js
describe('actions', () => {
  it('getAllProducts', () => {
    // sinon 의 spy 사용
    const commit = sinon.spy()
    const state = {}

    actions.getAllProducts({ commit, state })

    expect(commit.args).to.deep.equal([
      ['REQUEST_PRODUCTS'],
      ['RECEIVE_PRODUCTS', { /* 모의 응답 */ }]
    ])
  })
})
```

## Getter 테스팅

Getter는  mutation과 같이 테스트하는 것이 매우 간단하다.

```js
// getters.js
// 필터 카테고리에 맞는 물품 반환
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```

```js
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // mock state
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // 모의 getter
    const filterCategory = 'fruit'

    // getter로 부터 결과를 받는다.
    const result = getters.filteredProducts(state, { filterCategory })

    // 결과 테스트
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```