import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducer'

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);

export default function create(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState)

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducer', () => {
            const nextReducer = require('./reducer').default
            store.replaceReducer(nextReducer)
        })
    }

    return store
}
