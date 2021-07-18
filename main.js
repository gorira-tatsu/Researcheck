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

const db = firebase.firestore();

const word = {
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
    "良い":"悪い",
    "悪い":"良い"
}

var search = {

}

async function addSearchWord(search_word) {

    const res = await db.collection('Search').add({
        Search_Word:search_word
    });

}

async function access(href, text){

    const res = await db.collection('access').add({
        text: text,
        url: href
    });

}

function getSearchbox() {
    return document.getElementById("q")
}

function getClickResult(result) {
    for (c=0;c!==result.length;c++) {
        result[c].addEventListener('click', function () {
            access(event.target.href,event.target.textContent)
        })
    }
}

function  getResult() {
    Result = []
    for(c=1;c!==11;c++){
        Result.push(document.querySelector(`#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(${c}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a`))
    }
    return Result
}

function return_opposite(target_array) {
    for (x in word) {
        target_found = target_array.indexOf(x)
        if (target_found !== -1) {
            return word[x];
        }
        else {
            return '';
        }
    }
}

function return_split_space(target) {
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
    console.log(AndOrInsert(getSearchbox().value) + target_found + exclusion);
    addSearchWord(getSearchbox().value + target_found + exclusion)
    document.getElementsByClassName('gsc-input')[2].value = AndOrInsert(getSearchbox().value) + target_found + exclusion;
    document.querySelector('#___gcse_0 > div > div > form > table > tbody > tr > td.gsc-search-button > button').click();
    window.setTimeout(function () {getClickResult(getResult())}, 2*1000);
}

function pushSearch() {
    Search(return_opposite(return_split_space(getSearchbox().value)), return_exclusion())
}

function create_exclusion_form() {
    document.getElementById('exclusion-group').insertAdjacentHTML('beforeend','<input type="text" class="form-control search-input exclusion search-group AddExclusion">')
}

function AndOrInsert(SearchWord) {
    let target = document.getElementsByClassName('option-check')[0]
    let split_word = return_split_space(SearchWord)
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

function formClear() {
    target = document.getElementsByClassName('search-group')
    for (x in target){
        target[x].value = ""
    }
}

function addSearchData() {
    let search_group = document.getElementsByClassName('search-group')
    let SearchWord_list = []
    for (let c=0;c!==search_group.length;c++){
        SearchWord_list.push(search_group[c].value)
    }
    return SearchWord_list
}

function addStorageHistory() {
    let SearchWord = addSearchData()
    localStorage.setItem(Storage.length+1, SearchWord)
}

function ReadStorage() {
    for (let c=0;c!==localStorage.length;c++){
        console.log(localStorage.getItem(c))
    }
}

function addFormHistory(SearchWord, exclusion) {
    getSearchbox().value = SearchWord
    for (let c=0;c!==exclusion.length;c++){
        if (document.getElementsByClassName('exclusion')[c]){
            document.getElementsByClassName('exclusion')[c].value = exclusion[c]
        }
        else{
            create_exclusion_form()
            document.getElementsByClassName('exclusion')[c].value = exclusion[c]
        }
    }
}

function RemoveExclusion() {
    let target = document.getElementsByClassName('AddExclusion')
    target[0].remove()
}