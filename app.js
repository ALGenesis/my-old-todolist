import { createElement } from "./functions/dom.js";
import { fetchJSON } from "./functions/api.js";
import { TodoList } from "./components/TodoList.js";


async function main (){
        try {
            // TODOO : Décommenter la ligne ci-dessous pour utiliser l'API
            // Puis commenter la ligne suivante
            
            // const todos = await fetchJSON('../data/data.json')
            const todosInStorage = localStorage.getItem('todos')?.toString()
            let todos = []
            if (todosInStorage) {
                todos = JSON.parse(todosInStorage)
            }
            const List = new TodoList(todos)
            List.appendTo(document.querySelector('#todolist'))
            } 
        catch(e) {
            const alertServeur = createElement('div', {
                class : 'alert-serveur',
                role : 'alert'
            })

            alertServeur.innerText = 'Impossible de charger les taches'
            document.body.append(alertServeur)
            console.error(e)
            
         
        }

}

main()