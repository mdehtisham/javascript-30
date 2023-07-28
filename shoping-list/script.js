const itemForm = document.getElementById("item-form")
const itemInput = document.getElementById("item-input")
const itemList = document.getElementById("item-list")
const clearBtn = document.getElementById("clear")
const filterSection = document.getElementById("filter")



function onAddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value;
    // check empty value
    if(newItem === ""){
        alert('Please add an item')
        return;
    }

    addItemToDOM(newItem)
    addItemToStorage(newItem)
    

    checkListItems()
}

function addItemToStorage(item){
    let existingList = JSON.parse(localStorage.getItem('itemList'))
    if(!existingList){
        existingList = [];
    }
    existingList.push(item);
    localStorage.setItem('itemList', JSON.stringify(existingList))
}

function addItemToDOM(item){
    // create new list item
    const li = document.createElement('li')
    li.append(document.createTextNode(item))
    console.log(li)
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
    itemList.appendChild(li)
    itemInput.value = ''
}


function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon)
    return button
}

function createIcon(classes){
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}
function handleUpdateValue(e, previousValue){
    // check if enter is pressed to save
    if(e.keyCode === 13 || e.which === 13){
        console.log({previousValue, new: e.target.value})
        const items = JSON.parse(localStorage.getItem('itemList'))
        const index = items.indexOf(previousValue)
        items[index] = e.target.value;
        localStorage.setItem('itemList', JSON.stringify(items))
        clearItems()
        displayItemsFromStorage()
    }
}
function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
}

function onItemClick(e){
    console.log(e.target)
    if(e.target.parentElement.classList.contains('remove-item')){
       if(confirm('Are you sure?')){
        let items = JSON.parse(localStorage.getItem('itemList'))
        items = items.filter(v => v !== e.target.parentElement.parentElement.textContent)
        localStorage.setItem('itemList', JSON.stringify(items))
        e.target.parentElement.parentElement.remove();
       }
    }else{
        if(e?.target?.firstChild?.nodeType === 3){
            let content = e.target.firstChild.textContent;
            e.target.firstChild.remove()
            let inputEl = document.createElement('input');
            inputEl?.classList.add('input-edit')
            inputEl?.addEventListener("keypress", (e)=> handleUpdateValue(e, content))
            inputEl.value = content;
            e.target.insertBefore(inputEl, e.target.firstChild)
            // e.target
        }
    }
    checkListItems();
}

function resetUI(e){
    clearItems()
    const existingStorgeItems = localStorage.getItem('itemList')
    if(existingStorgeItems){
        localStorage.removeItem('itemList')
    }
    checkListItems();
}

function checkListItems(){
    const items = itemList.querySelectorAll('li')
    if(!items.length){
        clearBtn.classList.add('display-none')
        filterSection.classList.add('display-none')
    }else{
        clearBtn.classList.remove('display-none')
        filterSection.classList.remove('display-none')
    }
}

function filterList(e){
    const allItems = itemList.querySelectorAll('li')
    const searchStr = e.target.value;
    allItems.forEach(v => {
        if(v.textContent.toLowerCase().includes(searchStr.toLowerCase())){
            v.style.display = 'flex';
        }else{
            v.style.display = 'none'
        }
    })
    
}

function displayItemsFromStorage(){
    const existingItems = JSON.parse(localStorage.getItem('itemList'))
    if(existingItems){
        existingItems.forEach(item => {
            addItemToDOM(item)
        })
    }
    checkListItems();
}

function addEventListener(){
    itemForm.addEventListener('submit', onAddItemSubmit);
    // using event deligation for removing the item
    itemList.addEventListener('click', onItemClick);
    clearBtn.addEventListener('click', resetUI)
    filterSection.addEventListener('input', filterList)
}
addEventListener();
checkListItems();
displayItemsFromStorage();
