import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор

    return (query, state, action) => {
        // @todo: #5.2 — применить компаратор
         return state[searchField]
         ? Object.assign({}, query, {search: state[searchField]})
         : query
    }
}