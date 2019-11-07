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

export function wireUp<T>() {
    function StoreProvider({store, children}: IProviderProps<Store<T>>) {
        b.useProvideContext(StoreContext, {store});
        return {children};
    }
    function useDispatch() {
        const store = b.useContext(StoreContext).store;
        if (!store) throw new Error("Dispatching action is only allowed in redux context");
        return b.useMemo(() => (action: Action) => store!.dispatch(action), []);
    }
    function useSelector<TReturn>(selector: (state: T) => TReturn, eqFnc: (previous: TReturn, current: TReturn) => boolean = referentialEquality) {
        const store = b.useContext(StoreContext).store;
        if (!store) throw new Error("State provider have to be defined");
        const initialState = b.useMemo(() => getStateWithSelector(store.getState(), selector), []);
        const [localState, setLocalState] = b.useState(initialState);
        const currentState = b.useRef(initialState);
        b.useEffect(() => {
            const handler = () => {
                const state = getStateWithSelector(store.getState(), selector);
                if (!eqFnc(currentState.current, state)) {
                    currentState.current = state;
                    setLocalState(state);
                }
            };
            return store.subscribe(handler);
        }, []);

        return localState;
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
