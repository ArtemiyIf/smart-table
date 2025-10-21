import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules); 

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    const updateIndexes =  (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const optionElem = document.createElement('option');
                    optionElem.value = name;
                    optionElem.textContent = name;
                    return optionElem;
                })
            )
        })
    }
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
         if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const inputElem = parent.querySelector('input');
            const field = action.dataset.field;

            inputElem.value = '';
            state[field] = '';
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}