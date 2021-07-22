// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAc91klrsA-NXeWxGV_--FM2FB1pD_Oc1k",
    authDomain: "researcheck-c6439.firebaseapp.com",
    projectId: "researcheck-c6439",
    storageBucket: "researcheck-c6439.appspot.com",
    messagingSenderId: "86049752207",
    appId: "1:86049752207:web:80640fba82fc9b788e1cfa",
    measurementId: "G-ESLY2Q6641"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics()

const db = firebase.firestore();

const antonym_list = {
    "メリット":"デメリット",
    "デメリット":"メリット",
    "危険":"安全",
    "安全":"危険",
    "大きい":"小さい",
    "小さい":"大きい",
    "遅い":"早い",
    "早い":"遅い",
    "暑い":"寒い",
    "寒い":"暑い",
    "良い":"悪い",
    "悪い":"良い",
    "新しい":"古い",
    "古い":"新しい",
    "若い":"年寄り",
    "年寄り":"若い",
    "短い":"長い",
    "長い":"短い",
    "薄い":"厚い",
    "厚い":"薄い",
    "重い":"軽い",
    "軽い":"重い",
    "強い":"弱い",
    "弱い":"強い",
    "太い":"細い",
    "細い":"太い",
    "安い":"高い",
    "高い":"安い",
    "遠い":"近い",
    "近い":"遠い",
    "正しい":"間違い",
    "間違い":"正しい",
    "最高":"最悪",
    "最悪":"最高",
}

async function record_search_word_to_firebase(search_word) {

    const res = await db.collection('Search').add({
        Search_Word:search_word
    });

}

async function record_access_to_firebase(url, title){

    const res = await db.collection('access').add({
        title: title,
        url: url
    });

}

function get_search_word_form() {
    return document.getElementById("q")
}

function give_click_event_to_search_result(result) {
    for (c=0;c!==result.length;c++) {
        result[c].addEventListener('click', function () {
            record_access_to_firebase(event.target.href,event.target.textContent)
        })
    }
}

function  get_search_result() {
    Result = []
    for(c=1;c!==11;c++){
        Result.push(document.querySelector(`#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(${c}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a`))
    }
    return Result
}

function get_antonym(target_array) {
    for (x in antonym_list) {
        target_found = target_array.indexOf(x)
        if (target_found !== -1) {
            return antonym_list[x];
        }
        else {
            return '';
        }
    }
}

function split_space(target) {
    return target.split(/[\s\u3000]+/)
}

function return_exclusion() {
    let target_value = []
    let target = document.getElementsByClassName('exclusion')
    for (let c=0;c !== target.length;c++){
        if (target[c].value !== ""){
            target_value.push(' -' + target[c].value)
        }
    }
    return target_value.join('')
}

function Search(target_found, exclusion) {
    console.log(and_is_or_insert(get_search_word_form().value) + target_found + exclusion); // debug
    record_search_word_to_firebase(get_search_word_form().value + target_found + exclusion)
    record_history_to_local_storage()
    document.getElementsByClassName('gsc-input')[2].value = and_is_or_insert(get_search_word_form().value) + target_found + exclusion; // 代入
    document.querySelector('#___gcse_0 > div > div > form > table > tbody > tr > td.gsc-search-button > button').click();
    show_local_storage()
    window.setTimeout(function () {give_click_event_to_search_result(get_search_result())}, 2*1000); // click eventを付与
}

function pushSearch() {
    Search(get_antonym(split_space(get_search_word_form().value)), return_exclusion())
}

function increase_exclusion_form() {
    document.getElementById('exclusion-group').insertAdjacentHTML('beforeend','<input type="text" class="form-control search-input exclusion search-group AddExclusion">')
}

function and_is_or_insert(SearchWord) {
    let target = document.getElementsByClassName('option-check')[0]
    let split_word = split_space(SearchWord)
    if(target.checked){
        if(split_word.length !== 1){
            return split_word.join(' and ')
        }
        else{
            return SearchWord
        }
    }
    else{
        if(split_word.length !== 1){
            return split_word.join(' or ')
        }
        else{
            return SearchWord
        }
    }
}

function resetForm() {
    target = document.getElementsByClassName('search-group')
    for (x in target){
        target[x].value = ""
    }
}

function get_data_exists_in_form() {
    let search_group = document.getElementsByClassName('search-group')
    let SearchWord_list = []
    for (let c=0;c!==search_group.length;c++){
        SearchWord_list.push(search_group[c].value)
    }
    return SearchWord_list
}

function record_history_to_local_storage() {
    let SearchWord = get_data_exists_in_form()
    localStorage.setItem(localStorage.length, SearchWord)
}

function show_local_storage() {
    let element = document.getElementById("history");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    for (let c=0;c!==localStorage.length;c++){
        if(c!==5) {
            document.getElementById('history').insertAdjacentHTML('beforeend', `<p><button onclick="search_from_history(${c})" class="btn btn-link" id="localstorage${c}">${localStorage.getItem(c)}</button><p>`)
        }
        else {
            break
        }
    }
}

function assign_to_form(SearchWord, exclusion) {
    get_search_word_form().value = SearchWord
    for (let c=0;c!==exclusion.length;c++){
        if (document.getElementsByClassName('exclusion')[c]){
            document.getElementsByClassName('exclusion')[c].value = exclusion[c]
        }
        else{
            increase_exclusion_form()
            document.getElementsByClassName('exclusion')[c].value = exclusion[c]
        }
    }
}

function decrement_exclusion_form() {
    let target = document.getElementsByClassName('AddExclusion')
    target[0].remove()
}

function search_from_history(number) {
    let word = localStorage.getItem(number).split(',')
    resetForm()
    assign_to_form(word[0], word.slice(1))
    pushSearch()
}