let theme
let todo_list = []
let bgcolor
var formdata = new FormData()



let Token = localStorage.getItem('Session_Token')
if( Token !== null ){
    $(async function () {
        const response = await fetch(`/token/${Token}`)
        const data = await response.json()
        if(response.status != 201){
            Token = data.token
            userdata(data)
        }else{
            localStorage.removeItem("Session_Token")
        }
    });

    $('#menu-btn').css('display', 'block')
}


$( async function() {
    const response = await fetch('/theme')
    const data = await response.json()
    bgcolor = data
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
})


$('body').on('click', '.background-option div', async function(){
    let colorid = $(this).attr('id')
    let dict
    bgcolor.forEach((e) => {
        if(e['id'] === colorid){
            $(':root').css('--background-color', e['colorcode'])
            dict = {
                id: colorid,
                colorcode: e['colorcode']
            }
            // localStorage.setItem("theme", JSON.stringify(dict))
            
        }
    })
    $('.background-option').find('.activetheme').removeClass('activetheme')
    $(this).addClass('activetheme')

    await $.post(`/token/${Token}/setting`, dict, function (data, status) {
        if (data == 'Not Found') return 0
    }, 'html')

    
    // console.log(dict)
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
$('body').on('click', '#profile-edit',async function(){
    if($('.profile-info').css('display') == 'none'){
        $('.profile-info').css('display', 'flex')
        $('#username').attr('contentEditable', 'true')
        $('#edit_email').attr('contentEditable', 'true')
        $('.upload-image').css('display', 'grid')
    }else{
        $('.profile-info').css('display', 'none')
        $('#username').attr('contentEditable', 'false')
        $('#edit_email').attr('contentEditable', 'false')
        $('.upload-image').css('display', 'none')
        const response = await fetch(`/token/${Token}`)
        const data = await response.json()
        if (response.status != 201) {
            userdata(data)
        } else {
            localStorage.removeItem("Session_Token")
        }
    }

});

$('body').on('click', '#sign-out', function(){
    $('.auth-section').css('display', 'block')
    $('.profile-section').hide()
    $('#profile-photo-img').remove()
    $('#username').text('name')
    $('#edit_email').text('email')
    localStorage.removeItem("Session_Token")
    window.location.replace("/")
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
    todoInput.val('').focus()

}

function LoadTodo(todo_list = []) {
    if (todo_list.length != 0){
        todo_list.forEach(element => {
            $('.todo-list').append(templete(element.task, element.status))
        });
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
    var logindata = {
        email: login.find('#login-email').val(),
        password: login.find('#login-password').val(),
        remeber_me: login.find('#remember-me').is(':checked')
    }

    const response = await fetch(
        `/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(logindata)
        }
    );

    if(!response.ok){
        console.log('Not Found')
        animation(false)
        return
    }
    const data = await response.json()
    Token = data.token  //saving temp token
    userdata(data)
    todofetch(data.token)

    if (logindata.remeber_me) localStorage.setItem("Session_Token", Token) // storing token for sessions
    $('#menu-btn').css('display', 'block')

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

async function todofetch(token=Token) {
    const response = await fetch(
        `/token/${token}/todo`,
        {
            method: 'GET',
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            }
        }
    );
    const data = await response.json();

    // localStorage.setItem("todo", JSON.stringify(data))
    todo_list = data;
    // console.log(data)
    LoadTodo(data)
}

async function todosync() {
    const response = await fetch(
        `/token/${Token}/todo`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(todo_list)
        }
    );
    // const data = await response.json();
    console.log(await response)
}

function userdata(data) {
    const { name, email, photo, settings} = data
    $('.auth-section').hide()
    if (name != undefined) {
        $('#username').text(name)
    }
    if (photo != undefined) {
        $('#profile-photo-img').remove()
        $('.profile-photo').append(`<img src="${photo}" id="profile-photo-img" alt="profile-photo">`)

    }

    if (settings != undefined) {
        $(':root').css('--background-color', settings['colorcode'])
        $('.background-option').find('.activetheme').removeClass('activetheme')
        let id = settings['id']
        $('#'+id).addClass('activetheme')

    }


    $('#edit_email').text(email)


    $('.profile-section').css('display', 'flex')

    
}

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

async function saveprofile() {
    let dict = {
        name: $('#username').text(),
        email: $('#edit_email').text()
    }

    const response = await fetch(
        `/token/${Token}/`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(dict)
        }
    );
    const data = await response
    if(response.ok) console.log(response)


    $('.profile-info').css('display', 'none')
    $('#username').attr('contentEditable', 'false')
    $('#edit_email').attr('contentEditable', 'false')
    $('.upload-image').css('display', 'none')

    // if (profile_img != undefined) await profileupload(profile_img.files[0])

  }


$("#btn-upload-image").on('click', function () {
    alert('Feature is coming soon...')
});