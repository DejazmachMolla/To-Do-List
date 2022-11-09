export default class Task {
  constructor() {
    this.description = document.getElementById('to-do-input').value;
    this.completed = false;
    this.index = Task.tasks.length + 1;
    this.inputId = null;
    this.editBox = this.inputId ? document.getElementById(`input-${this.inputId}`) : null;
    this.deleteBtn = document.getElementById('delete-icon');
  }

  createKeyUpEventListenerForEdit = () => {
    this.editBox.addEventListener('keyup', (e) => {
      e.preventDefault();
      Task.tasks.find((t) => t.index === Number.parseInt(this.inputId, 10))
        .description = e.target.value;
      this.description = e.target.value;
      Task.updateLocalStorage();
    });
  }

  static createClickEventListner = () => {
    const descriptions = Task.addedItemsUL.querySelectorAll('.list-text');
    const dragIcons = Task.addedItemsUL.querySelectorAll('.drag-icon');

    descriptions.forEach((desc, index) => {
      desc.addEventListener('click', (e) => {
        e.preventDefault();

        const parent = e.target.parentNode;
        desc.outerHTML = `
          <input type="text" id="input-${parent.id}" value="">
        `;
        document.getElementById(`input-${parent.id}`).value = desc.textContent;
        dragIcons[index].outerHTML = `
          <button class="delete-icon" id="delete-icon"><i class="fa fa-trash" aria-hidden="true"></i></button>
        `;
        const task = new Task();
        task.inputId = parent.id;
        task.editBox = document.getElementById(`input-${task.inputId}`);
        task.deleteBtn = document.getElementById('delete-icon');

        task.editBox.focus();
        const { value } = task.editBox;
        task.editBox.value = '';
        task.editBox.value = value;

        task.createKeyUpEventListenerForEdit();
        task.createBlurEventListener();
        task.createDeleteEventListener();
      });
    });
  }

  static createCheckEventlisteners = () => {
    const checks = document.querySelectorAll('.complete-check');
    checks.forEach((check, index) => {
      check.addEventListener('change', (e) => {
        e.preventDefault();
        if (Task.completedIndexes.includes(index)) {
          Task.completedIndexes = Task.completedIndexes.filter((i) => i !== index);
          document.getElementById(`${index}`).querySelector('.list-text').style.textDecoration = 'none';
        } else {
          Task.completedIndexes.push(index);
          document.getElementById(`${index}`).querySelector('.list-text').style.textDecoration = 'line-through';
        }
        localStorage.setItem('completedItems', JSON.stringify(Task.completedIndexes));
      });
    });
  }

  static createCompleteRemovalListener = () => {
    const removeBtn = document.getElementById('remove-complete');
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Task.completedIndexes.forEach((i) => {
        Task.tasks = Task.tasks.filter((t) => t.index !== i);
      });
      Task.addedItemsUL.innerHTML = '';
      Task.updateIdsAfterRemoval();
      Task.populateTasks();
      Task.updateLocalStorage();
    });
  }

  static updateIdsAfterRemoval = () => {
    let count = 1;

    Task.tasks.forEach((t) => {
      t.index = count;
      count += 1;
    });
    Task.completedIndexes = [];
    localStorage.setItem('completedItems', JSON.stringify([]));
  }

  static updateLocalStorage = () => {
    localStorage.setItem('tasksLocalStorage', JSON.stringify(Task.tasks));
  }

  display = () => {
    document.getElementById('list-ul').innerHTML += `
      
      <li id=${this.index}>
        <input ${Task.completedIndexes.includes(this.index) ? 'checked' : ''} type="checkbox" id="check-${this.index}" class="complete-check">
        <span style="text-decoration:${Task.completedIndexes.includes(this.index) ? 'line-through' : 'none'}" class="list-text">${this.description}</span> 
        <span class="spacer"></span>
        <span class="drag-icon"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></span>
      </li>
        
      `;
  }

  add = () => {
    this.display();
    Task.tasks.push(this);
    Task.updateLocalStorage();
    Task.toDoInput.value = '';
    Task.createClickEventListner();
    Task.createCheckEventlisteners();
  }

  static createAddButtonEventListner = () => {
    Task.addButton.addEventListener('click', (e) => {
      e.preventDefault();
      const task = new Task();
      task.add();
    });
  }

  static populateTasks() {
    Task.tasks.forEach((t) => {
      const ta = new Task();
      ta.completed = t.completed;
      ta.description = t.description;
      ta.index = t.index;
      ta.display();
    });
    if (Task.tasks.length > 0) {
      Task.createClickEventListner();
      Task.createCheckEventlisteners();
    }
  }

  static respondBlurAndDelete = () => {
    Task.addedItemsUL.innerHTML = '';
    Task.populateTasks();
  }

  createBlurEventListener = () => {
    this.editBox.addEventListener('blur', Task.respondBlurAndDelete);
  }

  createDeleteEventListener = () => {
    this.createRemoveBlurListenerWhenMouseOverDelete();
    this.createAddBlurListenerWhenMouseLeaveDelete();
    this.deleteBtn.addEventListener('click', (e) => {
      const liParent = e.target.parentNode.parentNode;
      Task.tasks = Task.tasks.filter((t) => t.index !== Number.parseInt(liParent.id, 10));
      Task.tasks.map((t) => {
        if (t.index > Number.parseInt(liParent.id, 10)) {
          t.index -= 1;
        }
        return t;
      });
      Task.updateLocalStorage();
      Task.respondBlurAndDelete();
    });
  }

  createRemoveBlurListenerWhenMouseOverDelete = () => {
    this.deleteBtn.addEventListener('mouseover', (e) => {
      e.preventDefault();
      this.editBox.removeEventListener('blur', Task.respondBlurAndDelete);
    });
  }

  createAddBlurListenerWhenMouseLeaveDelete = () => {
    this.deleteBtn.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      this.editBox.addEventListener('blur', Task.respondBlurAndDelete);
    });
  }
}
