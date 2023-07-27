const itemForm = document.getElementById("item-form")
const itemInput = document.getElementById("item-input")
const itemList = document.getElementById("item-list")
const clearBtn = document.getElementById("clear")
const filterSection = document.getElementById("filter")



function addItem(e){
    e.preventDefault();
    const newItem = itemInput.value;
    // check empty value
    if(newItem === ""){
        alert('Please add an item')
        return;
    }

    // create new list item
    const li = document.createElement('li')
    li.append(document.createTextNode(newItem))
    console.log(li)
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
    itemList.appendChild(li)
    itemInput.value = ''

    checkListItems()
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

function removeItem(e){
    console.log(e.target)
    if(e.target.parentElement.classList.contains('remove-item')){
       if(confirm('Are you sure?')){
        e.target.parentElement.parentElement.remove()
       }
    }
    checkListItems();
}

function resetUI(e){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
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

function addEventListener(){
    itemForm.addEventListener('submit', addItem);
    // using event deligation for removing the item
    itemList.addEventListener('click', removeItem);
    clearBtn.addEventListener('click', resetUI)
}
addEventListener();


checkListItems();