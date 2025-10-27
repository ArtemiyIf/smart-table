import './fonts/ys-display/fonts.css'
import './style.css'

// import {data as sourceData} from "./data/dataset_1.js";
import {initFiltering} from './components/filtering.js';
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initSearching} from './components/searching.js';
import {initTable} from "./components/table.js";
import {initPagination} from './components/pagination.js';
import {initSorting} from './components/sorting.js';
// @todo: подключение


// Исходные данные используемые в render()
const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerRage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerRage, 
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let query = {}; // здесь будут формироваться параметры запроса
    // другие apply*
     query = applySearching(query, state, action);
     query = applyFiltering(query, state, action); // result заменяем на query
     query = applySorting(query, state, action);
     query = applyPagination(query, state, action); // обновляем query

    const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрами

    updatePagination(total, query); // перерисовываем пагинатор
    sampleTable.render(items);
} 

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация
const {applyPagination, updatePagination} = initPagination(
    sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySearching = initSearching(
    sampleTable.search.elements.search.name);

const {applyFiltering, updateIndexes} = initFiltering(
    sampleTable.filter.elements
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
} 

init().then(() => {
    return render();
});
