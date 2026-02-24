import { createElement } from "../functions/dom.js"
import { CloneTemplate } from "../functions/dom.js"


/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */
export class TodoList  {
    
    /**
     * @type {HTMLUListElement}
     */
    #listElement = []

    /**
     * @type {Todo[]}
     */
    #todos = []

    /**
     * 
     * @param {Todo[]} todos 
     */
    constructor (todos)  {
        this.#todos = todos 
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    appendTo (element) {

        element.append(CloneTemplate('todolist-layout'))
        
        this.#listElement = element.querySelector('.task-group')
        for (let todo of this.#todos){
            const t = new TodoListItem(todo)
            this.#listElement.append(t.element)
        }
        
         element.querySelector('form').addEventListener('submit', e => this.onSubmit(e))
         element.querySelectorAll('.btn-group button').forEach(button => button.addEventListener('click', e => this.toggleFilter(e)))

         this.#listElement.addEventListener('taskDeleted', ({detail : todo}) => {
            this.#todos = this.#todos.filter(task => task !== todo)
             this.onUpdate()
         })

         this.#listElement.addEventListener('toggleTask', ({detail : todo}) => {
            todo.completed = !todo.completed
             this.onUpdate()
         })


    }

    /**
     * 
     * @param {SubmitEvent} e 
     */
    onSubmit (e){
        e.preventDefault()
        const form = e.currentTarget
        const title = new FormData(form).get('task').toString().trim()
        if ( title === ''){
            return
        }

        const todo = {
            id : Date.now(),
            title,
            completed : false
        }

        const newTask = new TodoListItem(todo)
        this.#listElement.prepend(newTask.element)
        form.reset()

        this.#todos.push(todo)
        this.onUpdate()
        console.log(this.#todos)
    }


    /**
     * 
     * @param {PointerEvent} e 
     */
    toggleFilter(e){
        e.preventDefault()
        const filter = e.currentTarget.getAttribute('data-filter')
        e.currentTarget.parentElement.querySelector('.active').classList.remove('active')
        e.currentTarget.classList.add('active')

        if (filter === 'todo') {
            this.#listElement.classList.add('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        } else if (filter === 'done') {
            this.#listElement.classList.add('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        } else {
            this.#listElement.classList.remove('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        }
        
    }

    onUpdate (){
        localStorage.setItem('todos', JSON.stringify(this.#todos))
        // le localStorage et le sessionStorage ne peuvent
        // contenir que 5 Mo maximum
    }

}


class TodoListItem {

    #element
    /** @type {Todo[]}*/
    #todo = []

    /**
     * 
     * @param {Todo[]} todo 
     */
    constructor(todo) {

        this.#todo = todo
        const id = `todo-${todo.id}`
        const li = CloneTemplate('todolist-item').firstElementChild
        this.#element = li

        const checkbox = li.querySelector('input')
        checkbox.setAttribute('id', id)
        if (todo.completed) {
            checkbox.setAttribute('checked', '')
        }
        const label = li.querySelector('.task-details')
        label.setAttribute('for', id)
        label.innerText = this.#todo.title

        const deleteBtn = li.querySelector('.btn-delete')
        deleteBtn.setAttribute('for', id)
        
        this.toggleTask(checkbox)
        
        deleteBtn.addEventListener('click', e => this.removeTask(e))
        checkbox.addEventListener('change', e => this.toggleTask(e.currentTarget))
       
        
    }

    /**
     * 
     * @returns {HTMLElement} element 
     */
    get element (){
        return this.#element
    }

    /**@param {PointerEvent} e  */
    removeTask (e) {
        e.preventDefault()
        const event = new CustomEvent('taskDeleted', {
            detail : this.#todo,
            bubbles : true,
            cancelable : true
        })
        this.#element.dispatchEvent(event)
        this.#element.remove()
    }

    toggleTask (checkbox) {
        if (checkbox.checked)  {
            this.#element.classList.add('is-completed')
        } else {
            this.#element.classList.remove('is-completed')
        }

        const event = new CustomEvent('toggleTask', {
            detail : this.#todo,
            bubbles : true
        })
        this.#element.dispatchEvent(event)
    }
}