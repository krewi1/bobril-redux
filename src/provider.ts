import * as b from "bobril";
import { Action, Store } from "redux";

(<any>window).process = {env: {NODE_ENV: "Development"}};

export const StoreContext = b.createContext({
    store: null
});

interface IProviderProps<T> {
    store: T,
    children: b.IBobrilChildren
}

function referentialEquality(previous: unknown, current: unknown) {
    return previous === current;
}

export function createReduxSpace<T>() {
    function StoreProvider({store, children}: IProviderProps<Store<T>>) {
        b.useProvideContext(StoreContext, {store});
        return {children};
    }
    function useDispatch() {
        const store = b.useContext(StoreContext).store;
        if (!store) throw new Error("Dispatching action is only allowed in redux context");
        return (action: Action) => store!.dispatch(action);
    }
    function useSelector<TReturn>(selector: (state: T) => TReturn, eqFnc: (previous: TReturn, current: TReturn) => boolean = referentialEquality) {
        const store = b.useContext(StoreContext).store;
        if (!store) throw new Error("State provider have to be defined");
        const stateProp = b.useState(() => selector(store.getState()));
        b.useEffect(() => {
            const handler = () => {
                const state = selector(store.getState());
                if (!eqFnc(stateProp(), state)) {
                    stateProp(state);
                }
            };
            return store.subscribe(handler);
        }, []);

        return stateProp();
    }
    return {
        StoreProvider,
        useDispatch,
        useSelector
    }
}

function getStateWithSelector<TState, TLocal>(state: TState, selector: (state: TState) => TLocal): TLocal {
    return selector(state);
}
