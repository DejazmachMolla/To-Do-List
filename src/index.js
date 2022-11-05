import './style.css';
import Task from './task';

const task = new Task();

task.createAddButtonEventListner();
// task.createClickEventListner();
task.populateTasks();