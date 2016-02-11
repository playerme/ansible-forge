import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { syncHistory } from 'react-router-redux'
import rootReducer from './reducer'
import history from './utils/history'

const reduxRouterMiddleware = syncHistory(history)

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  reduxRouterMiddleware,
)(createStore);

export default function create(initialState) {
    const store = createStoreWithMiddleware(rootReducer)

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducer', () => {
            const nextReducer = require('./reducer').default
            store.replaceReducer(nextReducer)
        })
    }

    return store
}
