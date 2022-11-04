
let addButton = document.getElementById('add-icon');
let addedItemsUL = document.getElementById('list-ul');


export default class Task {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasksLocalStorage')) || [];
    this.description = document.getElementById('to-do-input').value;
    this.completed = false;
    this.index = this.tasks.length + 1;
    console.log(this.index);
    this.inputId = null;
    this.editBox = document.getElementById(`input-${this.inputId}`);
    this.deleteBtn = document.getElementById('delete-icon');
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

  add = () => {
    let task = new Task();
    console.log('in add '+task.completed, task.description, task.index)
    task.display();
    this.tasks.push(task);
    this.updateLocalStorage();
    document.getElementById('to-do-input').value = '';
    task.createClickEventListner();
    return this.tasks;
  }

  createAddButtonEventListner = () => {
    addButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.add();
    })
  }

  createClickEventListner = () => {
    let descriptions = addedItemsUL.querySelectorAll('.list-text');
    let dragIcons = addedItemsUL.querySelectorAll('.drag-icon');
    
    descriptions.forEach((desc, index) => {
      desc.addEventListener('click', e => {
        e.preventDefault();
        const parent = e.target.parentNode;
        desc.outerHTML = `
          <input type="text" id="input-${parent.id}" value=${desc.textContent}>
        `
        dragIcons[index].outerHTML = `
          <button class="delete-icon" id="delete-icon"><i class="fa fa-trash" aria-hidden="true"></i></button>
        `
        this.inputId = parent.id;
        console.log('inputId '+this.inputId)
        this.editBox = document.getElementById(`input-${this.inputId}`);
        this.deleteBtn = document.getElementById('delete-icon');
        

        document.getElementById(`input-${parent.id}`).focus();
        let value = document.getElementById(`input-${parent.id}`).value;
        document.getElementById(`input-${parent.id}`).value = '';
        document.getElementById(`input-${parent.id}`).value = value;
        
        this.createKeyUpEventListenerForEdit();
        this.createBlurEventListener();
        this.createDeleteEventListener();
      })
    })
  }

  createKeyUpEventListenerForEdit = () => {
    this.editBox.addEventListener('keyup', e => {
      e.preventDefault();
      console.log('in keyup inputId'+ this.inputId)
      const foundTasks = this.tasks.find(t => t.index == this.inputId);
      console.log('found tasks '+foundTasks.length)
      this.tasks.find(t => t.index == this.inputId).description = e.target.value;
      this.description = e.target.value;
      this.updateLocalStorage();
      console.log(this.tasks)
    })
  }

  createBlurEventListener = () => {
    this.editBox.addEventListener('blur', this.respondBlurAndDelete)
  }

  respondBlurAndDelete = () => {
    addedItemsUL.innerHTML = '';
    this.populateTasks();
  }

  createDeleteEventListener = () => {
    this.createRemoveBlurListenerWhenMouseOverDelete();
    this.createAddBlurListenerWhenMouseLeaveDelete();
    console.log('deleteBtn '+this.deleteBtn);
    this.deleteBtn.addEventListener('click', e => {
      let liParent = e.target.parentNode.parentNode;
      console.log('deleting '+liParent.id);
      console.log('this.tasks '+this.tasks);

      this.tasks = this.tasks.filter(t => t.index != liParent.id);
      console.log('this.tasks filtered '+this.tasks)
      this.tasks.map(t=> {
        if(t.index > Number.parseInt(liParent.id)){
          t.index = t.index-1
        }
      })
      this.updateLocalStorage();
      this.respondBlurAndDelete();
      console.log(this.tasks)

    })
  }

  createRemoveBlurListenerWhenMouseOverDelete = () => {
    this.deleteBtn.addEventListener('mouseover', e => {
      e.preventDefault();
      console.log('mouseover');
      this.editBox.removeEventListener('blur', this.respondBlurAndDelete);
    })
  }

  createAddBlurListenerWhenMouseLeaveDelete = () => {
    this.deleteBtn.addEventListener('mouseleave', e => {
      e.preventDefault();
      console.log('mouseleave');
      this.editBox.addEventListener('blur', this.respondBlurAndDelete);
    })
  }

  populateTasks() {
    this.tasks.forEach(t => {
      const ta = new Task();
      ta.completed = t.completed;
      ta.description = t.description;
      ta.index = t.index;
      ta.display();
    })
    if(this.tasks.length > 0)
      this.createClickEventListner();
  }

  updateLocalStorage() {
    localStorage.setItem('tasksLocalStorage', JSON.stringify(this.tasks));
  }
}

