let todo_list = localStorage.getItem("todo")
let theme = localStorage.getItem("theme")
try {
    theme = JSON.parse(theme)
} catch (error) {
    console.log(error)
}
todo_list = JSON.parse(todo_list)
if (todo_list === null) todo_list = []
LoadTodo()
let bgcolor

$.ajax({ 
    type: 'GET', 
    url: '/theme', 
    data: { get_param: 'value' }, 
    success: function (data) { 
        bgcolor = data
    }
})


//Direct Action
$('body').on('click', '.fa-trash', function () {
    let tempvalue = $(this).prev().prev().text()
    todo_list = $.grep(todo_list, function (element) {
        return element['task'] != tempvalue
    })
    localStorage.setItem("todo", JSON.stringify(todo_list))
    $(this).parent().addClass('fall')
    $(this).parent().one('transitionend', function () {
        $(this).remove()
    })
    return false
})

$('body').on('click', '#done', function () {
    if ($(this).parent().attr('id') == 'completed') {
        $(this).parent().attr('id', 'not-completed')
        let task = $(this).prev().text()
        let taskidx = todo_list.findIndex(obj => {
            return obj['task'] == task
        })
        todo_list[taskidx].status = "not-completed"
    } else {
        $(this).parent().attr('id', 'completed')
        let task = $(this).prev().text()
        let taskidx = todo_list.findIndex(obj => {
            return obj['task'] == task
        })
        // console.log(todo_list[taskidx])
        todo_list[taskidx]['status'] = "completed"
    }
    localStorage.setItem("todo", JSON.stringify(todo_list))
})

$('body').on('click', '#menu-btn', function(){
    if($('#setting').css('display') == 'none'){
        $('#setting').css('display', 'flex')
        $('#menu-btn button').text('close')
    }else{
        $('#setting').css('display', 'none')
        $('#menu-btn button').text('menu')
    }
})

//Themes Section
$('body').on('click', '.background-option div', function(){
    let colorid = $(this).attr('id')
    bgcolor.forEach((e) => {
        if(e['id'] === colorid){
            $(':root').css('--background-color', e['colorcode'])
            let dict = {
                id: colorid,
                colorcode: e['colorcode']
            }
            localStorage.setItem("theme", JSON.stringify(dict))
        }
    })
    $('.background-option').find('.activetheme').removeClass('activetheme')
    $(this).addClass('activetheme')
    // console.log($(this).find('img'))
})

$('body').on('click', '#profile-btn', function(){
    if($('#profile').css('display') == 'none'){
        $('#profile').css('display', 'block')
    }else{
        $('#profile').css('display', 'none')
    }
});

//Selectors
const todoInput = $(".todo-input")
const todoButton = $(".todo-button")
const todoList = $(".todo-list")

//Event Listeners
todoButton.click(addTodo)

//Functions
function addTodo(event) {
    event.preventDefault(); //Prevent form from submitting
    if (todoInput.val() === '') return
    $('.todo-list').append(templete(todoInput.val(), 'not-completed'))
    let dict = {
        'task': todoInput.val(),
        'status': 'not-completed'
    }
    todo_list.push(dict)
    localStorage.setItem("todo", JSON.stringify(todo_list))
    // console.log(todo_list)
    todoInput.val('')
}

function LoadTodo() {
    if (todo_list.length === 0){
        if(theme !== null) {
            $(':root').css('--background-color', theme['colorcode'])
            $('.background-option').find('.activetheme').removeClass('activetheme')
            let id = theme['id']
            $('#'+id).addClass('activetheme')
        
        }
        else {
            localStorage.setItem("theme", $('body').css('background'))
        }
    }
    else{
        todo_list.forEach(element => {
            $('.todo-list').append(templete(element.task, element.status))
        });
        // console.log(theme)
        if(theme !== null) {
            $(':root').css('--background-color', theme['colorcode'])
            $('.background-option').find('.activetheme').removeClass('activetheme')
            let id = theme['id']
            $('#'+id).addClass('activetheme')
        
        }
        else {
            localStorage.setItem("theme", $('body').css('background'))
        }
    }

}

function templete(input, id) {
    return `<div class="todo" id="${id}">
                <li>${input}</li>
            <button class="fa-done" id="done"><span class="material-symbols-outlined">
                done
                </span></button>
            <button class="fa-trash" id="trash"><span class="material-symbols-outlined">
                delete
                </span></button>
            </div>`
}


