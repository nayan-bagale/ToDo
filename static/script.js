let theme
let todo_list = []
let bgcolor


let Token = localStorage.getItem('Session_Token')
if( Token !== null ){
    $(async function () {
        const response = await fetch(`/token/${Token}`)
        const data = await response.json()
        if(response.status != 401){
            Token = data.token
            userdata(data)
            todofetch()
            $('#menu-btn').css('display', 'block')

        }else{
            localStorage.removeItem("Session_Token")
            window.location.replace("/")
        }
    });


}

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

//theme
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
            
        }
    })
    $('.background-option').find('.activetheme').removeClass('activetheme')
    $(this).addClass('activetheme')

    await $.post(`/token/${Token}/setting`, dict, function (data, status) {
        if (data == 'Not Found') return 0
    }, 'html')

})

$(async function () {
    const response = await fetch('/theme')
    const data = await response.json()
    bgcolor = data

    data.forEach((e , i) => {
        $('.background-option').append(`<div id="${e.id}" style="background: ${e.colorcode};"><span>${e.name}</span></div>`)
    })
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

// Authenticate Section
$('#login-button').click( async function(event){
    event.preventDefault(); //Prevent form from submitting
    animation(true)
    var login = $('.login-block')
    var logindata = {
        email: login.find('#login-email').val(),
        password: login.find('#login-password').val(),
        remeber_me: login.find('#remember-me').is(':checked')
    }

    if(!ValidateEmail(logindata.email)) {
        animation(false)
        return
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

    const data = await response.json()
    if(data.error){
        animation(false)
        ErrorPopUp(data.message, 'login')
        return
    }
    
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
    
    let obj = {
        name: sign_up.find('#sign-up-name').val(),
        email: sign_up.find('#sign-up-email').val(),
        password: sign_up.find('#sign-up-password').val()
    }

    if (!ValidateEmail(obj.email)) {
        animation(false)
        return
    }
    if(!ValidatePassword(obj.password)){
        animation(false)
        return
    }

    const response = await fetch(
        `/auth/sign-up`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
        }
    )

    data = await response.json()
    if (data.error) {
        animation(false)
        ErrorPopUp(data.message, 'sign-up')
        return
    }


   animation(false)
});

function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if( inputText == ''){
        ErrorPopUp('Email is required', 'email')
        return false;
    }
    else if (inputText.match(mailformat)) {
        return true;
    }
    else {
        ErrorPopUp('Invalid Email Address', 'email')
        return false;
    }
}

function ValidatePassword(inputText) {
    if( inputText == ''){
        ErrorPopUp('Password is required','password')
        return false
    }else if( inputText.length <= 8){
        ErrorPopUp('Password length must be atleast 8 characters', 'password')
        return false
    }else{
        return true
    }
}

async function ErrorPopUp(error, section) {
    let errorpopup = $('.auth-section-error')
    errorpopup.css('animation', 'none')
    errorpopup.text(error)
    errorpopup.css('display', 'block')
    errorpopup.css('animation', 'errorup 0.5s linear')
    await sleep(4000)
    errorpopup.css('animation', 'errordown 0.5s linear')
    await sleep(500)
    errorpopup.css('display', 'none')
    errorpopup.text('')
    console.log(error, section)
}

// End Authenticate Section

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

    // response_popup_section('Todo Fetched', 'succeed')
    
    todo_list = data;
    if (todo_list.length != 0) {
        todo_list.forEach(element => {
            $('.todo-list').append(templete(element.task, element.status))
        });
    }
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
    const data = await response.json();
    
    if(data.error){
        response_popup_section(data.message, 'failed')
    }else{
        response_popup_section(data.message, 'succeed')
    }

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
    const data = await response.json()
    console.log(data)
    if (data.error) {
        response_popup_section(data.message, 'failed')
    } else {
        response_popup_section(data.message, 'succeed')
    }


    $('.profile-info').css('display', 'none')
    $('#username').attr('contentEditable', 'false')
    $('#edit_email').attr('contentEditable', 'false')
    $('.upload-image').css('display', 'none')

    // if (profile_img != undefined) await profileupload(profile_img.files[0])

}

async function response_popup_section(error, status){
    let popup = $('.section-error')
    if(status == 'failed'){
        popup.css('background-color', 'var(--color-light-red)')
    }else{
        popup.css('background-color', 'var(--color-light-green)')
    }
    popup.css('animation', 'none')
    popup.text(error)
    popup.css('display', 'block')
    popup.css('animation', 'section-errorup 0.5s linear')
    await sleep(4000)
    popup.css('animation', 'section-errordown 0.5s linear')
    await sleep(500)
    popup.css('display', 'none')
    popup.text('')
    console.log(error)
}

// 
$('body').on('click', '#profile-edit', async function () {
    if ($('.profile-info').css('display') == 'none') {
        $('.profile-info').css('display', 'flex')
        $('#username').attr('contentEditable', 'true')
        $('#edit_email').attr('contentEditable', 'true')
        $('.upload-image').css('display', 'grid')
    } else {
        $('.profile-info').css('display', 'none')
        $('#username').attr('contentEditable', 'false')
        $('#edit_email').attr('contentEditable', 'false')
        $('.upload-image').css('display', 'none')
    }

});

$('body').on('click', '#sign-out', function () {
    $('.auth-section').css('display', 'block')
    $('.profile-section').hide()
    $('#profile-photo-img').remove()
    $('#username').text('name')
    $('#edit_email').text('email')
    localStorage.removeItem("Session_Token")
    window.location.replace("/")
})

$("#btn-upload-image").on('click', function () {
    alert('Feature is coming soon...')
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

