const itemForm = document.getElementById("item-form")
const itemInput = document.getElementById("item-input")
const itemList = document.getElementById("item-list")

function addItem(e){
    e.preventDefault();
    const newItem = itemInput.value;
    // check empty value
    if(newItem === ""){
        alert('Please add an item')
        return;
    }
    console.log("success")

    // create new list item
    const li = document.createElement('li')
    li.append(document.createTextNode(newItem))
    console.log(li)
    const button = createButton('remove-item btn-link text-red')
    console.log(button)
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

function addEventListener(){
    itemForm.addEventListener('submit', addItem);
}
addEventListener();