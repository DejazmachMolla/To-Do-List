export default class Task {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasksLocalStorage')) || [];
    this.description = document.getElementById('to-do-input').value;
    this.completed = false;
    this.index = this.tasks.length + 1;
    this.inputId = null;
    this.editBox = document.getElementById(`input-${this.inputId}`);
    this.deleteBtn = document.getElementById('delete-icon');
    this.addButton = document.getElementById('add-icon');
    this.addedItemsUL = document.getElementById('list-ul');
  }

  createClickEventListner = () => {
    const descriptions = this.addedItemsUL.querySelectorAll('.list-text');
    const dragIcons = this.addedItemsUL.querySelectorAll('.drag-icon');

    descriptions.forEach((desc, index) => {
      desc.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = e.target.parentNode;
        desc.outerHTML = `
          <input type="text" id="input-${parent.id}" value=${desc.textContent}>
        `;
        dragIcons[index].outerHTML = `
          <button class="delete-icon" id="delete-icon"><i class="fa fa-trash" aria-hidden="true"></i></button>
        `;
        this.inputId = parent.id;
        this.editBox = document.getElementById(`input-${this.inputId}`);
        this.deleteBtn = document.getElementById('delete-icon');

        document.getElementById(`input-${parent.id}`).focus();
        const { value } = document.getElementById(`input-${parent.id}`);
        document.getElementById(`input-${parent.id}`).value = '';
        document.getElementById(`input-${parent.id}`).value = value;

        this.createKeyUpEventListenerForEdit();
        this.createBlurEventListener();
        this.createDeleteEventListener();
      });
    });
  }

  updateLocalStorage() {
    localStorage.setItem('tasksLocalStorage', JSON.stringify(this.tasks));
  }

  display = () => {
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
    const task = new Task();
    task.tasks = null;
    task.display();
    this.tasks.push(task);
    this.updateLocalStorage();
    document.getElementById('to-do-input').value = '';
    this.createClickEventListner();
    return this.tasks;
  }

  createAddButtonEventListner = () => {
    this.addButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.add();
    });
  }

  createKeyUpEventListenerForEdit = () => {
    this.editBox.addEventListener('keyup', (e) => {
      e.preventDefault();
      this.tasks.find((t) => t.index === Number.parseInt(this.inputId, 10))
        .description = e.target.value;
      this.description = e.target.value;
      this.updateLocalStorage();
    });
  }

  populateTasks() {
    this.tasks.forEach((t) => {
      const ta = new Task();
      ta.tasks = null;
      ta.completed = t.completed;
      ta.description = t.description;
      ta.index = t.index;
      ta.display();
    });
    if (this.tasks.length > 0) this.createClickEventListner();
  }

  respondBlurAndDelete = () => {
    this.addedItemsUL.innerHTML = '';
    this.populateTasks();
  }

  createBlurEventListener = () => {
    this.editBox.addEventListener('blur', this.respondBlurAndDelete);
  }

  createDeleteEventListener = () => {
    this.createRemoveBlurListenerWhenMouseOverDelete();
    this.createAddBlurListenerWhenMouseLeaveDelete();
    this.deleteBtn.addEventListener('click', (e) => {
      const liParent = e.target.parentNode.parentNode;
      this.tasks = this.tasks.filter((t) => t.index !== Number.parseInt(liParent.id, 10));
      this.tasks.map((t) => {
        if (t.index > Number.parseInt(liParent.id, 10)) {
          t.index -= 1;
        }
        return t;
      });
      this.updateLocalStorage();
      this.respondBlurAndDelete();
    });
  }

  createRemoveBlurListenerWhenMouseOverDelete = () => {
    this.deleteBtn.addEventListener('mouseover', (e) => {
      e.preventDefault();
      this.editBox.removeEventListener('blur', this.respondBlurAndDelete);
    });
  }

  createAddBlurListenerWhenMouseLeaveDelete = () => {
    this.deleteBtn.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      this.editBox.addEventListener('blur', this.respondBlurAndDelete);
    });
  }
}
