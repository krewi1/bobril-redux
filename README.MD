# Redux binding for Bobril

This library contains bindings for redux state managment. Before using this i strongly recommend reading official [Redux doc](https://redux.js.org/introduction/getting-started)

## How to use
First of all reexport library functions enriched with typedefinitions somewhere in your project
```typescript
export type RootState = {
    todos: TodoItem[],
    filter: string
}

export type TodoItem = {
    done: boolean;
    title: string;
}
const { useDispatch, useSelector, StoreProvider} = createReduxSpace<RootState>();

export {
    useDispatch,
    useSelector,
    StoreProvider
};
```

Then in every component you will use theese reexported functions.

## Exposing state through context
Somewhere in application root define provide your application content as children to the Store provider
```typescript
<StoreProvider store={store}>
    ...aplication content
</StoreProvider>
```
 
 ## Getting state
 On component level you can just call useSelector with function returning state leaf you want to access.
```typescript
function Component() {
const state = useSelector(state => state.todos);
}
```
Behind the scene bindings will trigger component rerendering everytime.

## Action for state mutations
State is mutated via actions. Theese actions are dispatch with dispatcher which you get through useDispatch hook.
```typescript
const DispatchComponent() {
    const dispatch = useDispatch();
    dispatch(actionCreator());
}
```
actionCreator function here supplies real action creator which will crate Action.
