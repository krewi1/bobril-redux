import * as b from "bobril";
import { renderHook, clean, renderHookInsideParent } from "bobril-hook-testing/src/index"
import { wireUp } from "../src/provider";
import { Action, applyMiddleware, combineReducers, createStore } from "redux";
import { counter, CounterActionType, CounterShape, counterTwo, StateShape } from "./bindingData";

const bufferMiddleware = arr => _ => next => action => {
    arr.push(action);
    return next(action);
};

describe("bindings", () => {
    const {StoreProvider, useDispatch, useSelector} = wireUp<StateShape>();
    describe("not valid use", () => {
        it("dispatch throws when not inside Provider context", () => {
            expect(() => renderHook(useDispatch)).toThrow();
        });

        it("useSelector throws when not inside Provider context", () => {
            expect(() => renderHook(useSelector, (state) => state.counter)).toThrow();
        });
    });

    describe("valid use", () => {
        describe("useDispatch", () => {
            let ProviderComponent: b.IComponentFactory<any>;
            let actionBuffer: Action[];
            beforeEach(() => {
                const reducer = combineReducers({counter, counterTwo: counterTwo});
                actionBuffer = [];
                const store = createStore(reducer, applyMiddleware(bufferMiddleware(actionBuffer)));
                ProviderComponent = ({children}) => {
                    return <StoreProvider store={store}>{children}</StoreProvider>
                }
            });

            it("can dispatch actions", () => {
                const {currentValue: {value: dispatch}} = renderHookInsideParent(useDispatch, ProviderComponent);
                dispatch({type: "type"});

                expect(actionBuffer[0]).toEqual({type: "type"})
            });
        });

        describe("useSelector", function () {
            let ProviderComponent: b.IComponentFactory<any>;
            let timerRendered: number;
            let dispatch: (action: Action) => void;
            beforeEach(() => {
                timerRendered = 0;
                const reducer = combineReducers({counter, counterTwo: counterTwo});
                const store = createStore(reducer);
                ProviderComponent = ({children}) => {
                    const Wrapper = ({children}) => {
                        dispatch = useDispatch();
                        return children;
                    };
                    return <StoreProvider store={store}><Wrapper>{children}</Wrapper></StoreProvider>
                }
            });
            it("rerenders automaticaly", () => {
                const { currentValue, timesRerendered } = renderHookInsideParent(useSelector, ProviderComponent, (state) => state.counter);
                dispatch({type: CounterActionType.PLUS});
                b.syncUpdate();
                expect(currentValue.count).toBe(1);
                expect(timesRerendered()).toBe(2);
            });

            it("do not rerender when reference are same", () => {
                const { currentValue, timesRerendered } = renderHookInsideParent(useSelector, ProviderComponent, (state) => state.counter);
                dispatch({type: CounterActionType.PLUSTWO});
                b.syncUpdate();
                expect(currentValue.count).toBe(0);
                expect(timesRerendered()).toBe(1);
            });

            it("do not rerender when eq function is same", () => {
                const { currentValue, timesRerendered } = renderHookInsideParent(useSelector, ProviderComponent, (state) => state.counter, (prevCounter: CounterShape, currCounter: CounterShape) => prevCounter.minusClicked === currCounter.minusClicked);
                dispatch({type: CounterActionType.PLUS});
                b.syncUpdate();
                expect(currentValue.count).toBe(0);
                expect(timesRerendered()).toBe(1);
            });
        });
    });


    afterEach(() => {
        clean();
    });
});
