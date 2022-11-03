
let index = 0;
let addButton = document.getElementById('add-icon');
let tasks = [];

export default class Task {
  constructor() {
    this.description = document.getElementById('to-do-input').value;
    this.completed = false;
    this.index = index++;
  }

  display = () => {
    document.getElementById('list-ul').innerHTML += `
      
      <li id=${this.id}>
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
    return tasks;
  }

  static createAddButtonEventListner = () => {
    addButton.addEventListener('click', (e) => {
      console.log(this.add());
    })
  }
}

