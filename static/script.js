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

$( function() {
    $( "#sortable" ).sortable({
        axis:'y',
        scrollSensitivity: 100,
        scrollSpeed: 40,
        start: function(event, ui) {
            ui.item.addClass('active-todo')
        },
        stop: function(event, ui){
            ui.item.attr('class', 'todo')
        } 
    });
    $("#sortable").disableSelection();
});

$(window).on('load', function () {
    function loader_remove() {
        $('.loader-container').css('animation','slider 1s linear')
        $('#loading').on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(){
            $(this).remove()
            $('body').css('overflow','auto')
        })
    }
    window.setTimeout(loader_remove, 2000)
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

//Themes Section

$('body').on('click', '#menu-btn', function(){
    if($('#setting').css('display') == 'none'){
        $('#setting').css('display', 'flex')
        $('#menu-btn button').text('close')
        $('.profile-btn').css('z-index', 1)
    }else{
        $('#setting').css('display', 'none')
        $('#menu-btn button').text('menu')
        $('.profile-btn').css('z-index', 4)
    }
})

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

//Profile Section

$('body').on('click', '#profile-btn', function(){
    if($('#profile').css('display') == 'none'){
        $('#profile').css('display', 'flex')
        $('.menu-btn').css('z-index', 1)
    }else{
        $('#profile').css('display', 'none')
        $('.menu-btn').css('z-index', 4)
    }
});

$('body').on('click', '#login', function(){
    $('.login-block').show()
    $('#login').css({
        'background-color': 'transparent',
        'box-shadow': 'none'
    })
    $('#sign-up').css({ 
        'background-color': 'var(--section-skeleton)',
        'box-shadow': 'inset 4px -4px 10px -5px #333',
        'border-radius': '0px 10px 0px 10px'
    })
    $('.sign-up-block').hide();
});

$('body').on('click', '#sign-up', function () {
    $('.sign-up-block').show();
    $('#sign-up').css({
        'background-color': 'transparent',
        'box-shadow': 'none'
    })
    $('#login').css({
        'background-color': 'var(--section-skeleton)',
        'box-shadow': 'inset -5px -5px 5px -5px #333',
        'border-radius': '10px 0px 10px 0px'
    })
    $('.login-block').hide();
});

// 
$('body').on('click', '#profile-edit', function(){
    if($('.profile-info').css('display') == 'none'){
        $('.profile-info').css('display', 'flex')
        $('#username').attr('contentEditable', 'true')
        $('#edit_email').attr('contentEditable', 'true')
    }else{
        $('.profile-info').css('display', 'none')
        $('#username').attr('contentEditable', 'false')
        $('#edit_email').attr('contentEditable', 'false')
    }
});

$('body').on('click', '#sign-out', function(){
    $('.auth-section').css('display', 'block')
    $('.profile-section').hide()
    $('#profile-photo-img').remove()
    $('#username').text('name')
    $('#edit_email').text('email')
    
})

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
    todoInput.val('').focus()

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

$('#profile').mouseup(function (e) {
    var container = $('.auth-section').css('display') == 'none' ? $('.profile-section') : $('.auth-section')
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('#profile-btn').click()
    }
})


$('#login-button').click( async function(event){
    event.preventDefault(); //Prevent form from submitting
    animation(true)
    var login = $('.login-block')
    var data = {
        email: login.find('#login-email').val(),
        password: login.find('#login-password').val(),
        remeber_me: login.find('#remember-me').is(':checked')
    }

    await $.post('/auth/login', data, function (data, status) {

        if (data == 'Not Found') return 0

        const { name , email, photo } = JSON.parse(data)
        $('.auth-section').hide()
        if(name != undefined){
            $('#username').text(name)
        }
        if (photo != undefined){
            $('.profile-photo').append(`<img src="${ photo }" id="profile-photo-img" alt="profile-photo">`)
        }

        $('#edit_email').text(email)

        $('.profile-section').css('display','flex')

    }, 'html')

    animation(false)

});

$('#sign-up-button').click(async function (event) {
    event.preventDefault(); //Prevent form from submitting
    animation(true)
    var sign_up = $('.sign-up-block')
    let email = sign_up.find('#sign-up-email').val()
    let pass = sign_up.find('#sign-up-password').val()
    await $.post('/auth/sign-up', { email: email, password: pass },function(data, status){
        alert(status)
    },'html')

   animation(false)
});



function animation(bool){
    if(bool){
        $('.lds-ellipsis').css('display', 'inline-flex');
        $('.login-signup').css('visibility', 'hidden');
        $('.sign-up-block').css('visibility', 'hidden');
        $('.login-block').css('visibility', 'hidden');
    }else{
        $('.login-signup').css('visibility', 'visible');
        $('.sign-up-block').css('visibility', 'visible');
        $('.login-block').css('visibility', 'visible');
        $('.lds-ellipsis').css('display', 'none');
    }
}

