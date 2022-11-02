import './style.css';

class Task {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }

  display = () => {
    document.getElementById('list-ul').innerHTML += `
      
      <li id=${this.id}>
        <input type="checkbox">
          <span class="list-text">${this.description}</span> 
          <span class="spacer"></span>
          <span class="drag-icon"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></span>
      </li>
        
      `
  }
}


let tasks = [
  new Task('Go to gym', false, 0),
  new Task('Cook food', false, 1),
  new Task('Meet friend', false, 2)
];

tasks.forEach(t => t.display());
