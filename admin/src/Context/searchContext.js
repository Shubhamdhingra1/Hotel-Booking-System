import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = JSON.parse(localStorage.getItem("searchState")) || {
    destination: undefined,
    dates: [{
        endDate: new Date(),
        key: 'selection',
        startDate: new Date()
    }],
    options: {
        adults: undefined,
        children: undefined,
        rooms: undefined
    },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
    switch (action.type) {
        case "NEW_SEARCH":
            return action.payload;
        case "RESET_SEARCH":
            console.log("RESET_SEARCH");
            return INITIAL_STATE;
        default:
            return state;
    }
}

export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("searchState", JSON.stringify({
            destination: state.destination || undefined,

            dates: [{
                endDate: state.dates[0].endDate.toString() || new Date(),
                key: 'selection',
                startDate: state.dates[0].startDate.toString() || new Date()
            }],

            options: state.options || {},
        }));

    }, [state]);

    return (
        <SearchContext.Provider
            value={{
                destination: state.destination,
                dates: state.dates,
                options: state.options,
                dispatch
            }}>
            {children}
        </SearchContext.Provider>
    )
}



// JSON.parse(localStorage.getItem("searchState")) || 