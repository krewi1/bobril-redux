import { Action } from "redux";

export interface CounterShape {
    count: number;
    plusClicked: number;
    minusClicked: number;
}

export interface StateShape {
    counter: CounterShape;
    counterTwo: CounterShape;
}

export enum CounterActionType {
    PLUS = "plus",
    MINUS = "minus",
    PLUSTWO = "plusTWO",
}

function createDefaultState(): CounterShape {
    return {
        count: 0,
        plusClicked: 0,
        minusClicked: 0
    };
}

export const counter = (
    state: CounterShape = createDefaultState(),
    action: Action
) => {
    switch (action.type) {
        case CounterActionType.PLUS:
            return {
                ...state,
                count: state.count + 1,
                plusClicked: state.plusClicked + 1
            };
        case CounterActionType.MINUS:
            return {
                ...state,
                count: state.count - 1,
                minusClicked: state.minusClicked + 1
            };
        default:
            return state;
    }
};

export const counterTwo = (
    state: CounterShape = createDefaultState(),
    action: Action
) => {
    switch (action.type) {
        case CounterActionType.PLUSTWO:
            return {
                ...state,
                count: state.count + 1,
                plusClicked: state.plusClicked + 1
            };
        default:
            return state;
    }
};
