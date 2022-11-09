import './style.css';
import Task from './task';

Task.addButton = document.getElementById('add-icon');
Task.tasks = JSON.parse(localStorage.getItem('tasksLocalStorage')) || [];
Task.addedItemsUL = document.getElementById('list-ul');
Task.toDoInput = document.getElementById('to-do-input');
Task.completedIndexes = JSON.parse(localStorage.getItem('completedItems')) || [];
Task.createAddButtonEventListner();
Task.populateTasks();
Task.createCompleteRemovalListener();