
let startIndex = 0;
let addButton = document.getElementById('add-icon');
let addedItemsUL = document.getElementById('list-ul');
let tasks = [];

export default class Task {
  constructor() {
    this.description = document.getElementById('to-do-input').value;
    this.completed = false;
    //this.index = tasks.length == 0 ? 1 : tasks[tasks.length-1].index + 1;
    this.index = startIndex++;
  }

  display = () => {
    console.log(this.completed, this.description, this.index)
    document.getElementById('list-ul').innerHTML += `
      
      <li id=${this.index}>
        <input type="checkbox">
          <span class="list-text">${this.description}</span> 
          <span class="spacer"></span>
          <span class="drag-icon"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></span>
      </li>
        
      `;
  }

  static add = () => {
    let task = new Task();
    task.display();
    tasks.push(task);
    this.createClickEventListner();
    return tasks;
  }

  static createAddButtonEventListner = () => {
    addButton.addEventListener('click', (e) => {
      this.add();
    })
  }

  static createClickEventListner = () => {
    let descriptions = addedItemsUL.querySelectorAll('.list-text');
    
    descriptions.forEach(desc => {
      desc.addEventListener('click', e => {
        e.preventDefault();
        const parent = e.target.parentNode;
        desc.outerHTML = `<input type="text" id="input-${parent.id}" value=${desc.textContent}>`
        
        this.createKeyUpEventListenerForEdit(parent.id);
        this.createBlurEventListener(parent.id);
      })
    })
  }

  static createKeyUpEventListenerForEdit = (inputId) => {
    let editBox = document.getElementById(`input-${inputId}`);
    editBox.addEventListener('keyup', e => {
      e.preventDefault();
      console.log(e.target.value)
      tasks.find(t => t.index == inputId).description = e.target.value;
      
    })
  }

  static createBlurEventListener = (inputId) => {
    let editBox = document.getElementById(`input-${inputId}`);

    editBox.addEventListener('blur', e => {
      e.preventDefault();
      addedItemsUL.innerHTML = '';
      tasks.forEach(t => {
        t.display()
        this.createClickEventListner();
      })
      
    })
  }
}

