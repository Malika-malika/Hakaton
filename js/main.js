let API = 'http://localhost:8009/document'
let btnAdd = $('.btnAdd');
let titleInp = $('.title');
let imageInp = $('.image');
let descriptionInp = $('.description');
let addBtn = $('.add-btn')

let editedId = null;
let searchText = '';
let pageCount = 1;
let page = 1;
let idToEdit = '';

$('.main_title').fadeOut(2000).delay(3000).fadeIn(2000)

renderDocumBtn();

$('.search-inp').on('input', function (e) {
    searchText = e.target.value;
    renderDocumBtn();
})


btnAdd.on('click', function () {
    $('.main-modal').css('display', 'block')
})

$('.add-btn').on("click", function () {
    if (!titleInp.val() && !imageInp.val() && !descriptionInp.val().trim()) {
        alert("Заполните поле");
        titleInp.val("")
        imageInp.val("")
        descriptionInp.val("")
        return
    }
    let newDocumBtn = {
        title: $('.title').val(),
        image: $('.image').val(),
        description: $('.description').val()
    }
    console.log(newDocumBtn)

    postNewTask(newDocumBtn);
    titleInp.val("");
    imageInp.val("")
    descriptionInp.val("")
})

function postNewTask(newDocumBtn) {
    fetch(API, {
            method: 'POST',
            body: JSON.stringify(newDocumBtn),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(() => renderDocumBtn())
}

$('.btn-close').on('click', function () {
    $('.main-modal').css('display', 'none');
})

$('.btn-close').on('click', function () {
    $('.main-modal2').css('display', 'none');
})

renderDocumBtn();


async function renderDocumBtn() {
    let res = await fetch(`${API}?q=${searchText}&_page=${page}&_limit=3`);
    let data = await res.json();

    list.html("");
    getPagination();
    data.forEach(item => {
        
        list.append(`
            <li id=${item.id} class="list-item">
            ${item.task}
            ${item.task2}
            ${item.task3}
            <button class="btn-delete">Delete</button>
            <button class="btn-edit">Edit</button>
            </li>
        `)
    })
}

function renderDocumBtn(){
    fetch(API)
        .then(res => res.json())
        .then(boxData => {
            console.log(boxData)
            $('.box__items').html('')
            boxData.forEach(item => {
                $('.box__items').append(`
                <div id = "${item.id}">
                <button class="doc-btn">${item.title}</button>
                <button class="btn-delete">Delete</button>
                <button id="${item.id}" class="btn-edit">Edit</button>
                </div>
                    
                `)
                })
                $(`#${item.id}`).on('click', function(){
                    idToEdit = item.id;
            });
        }) 
}



$('.box__items').on('click', '.btn-delete', function (e) {
    let id = e.target.parentNode.id;
    console.log(id)
    fetch(`${API}/${id}/`, {
            method: 'DELETE',
        })
        .then(() => renderDocumBtn())
})



$('.box__items').on('click', '.btn-edit', function (e) {
    editedId = e.target.parentNode.id;
    console.log('asdasd')

    fetch(`${API}/${editedId}/`)
        .then(res => res.json())
        .then(btnToEdit => {
            $('.edit-inp-title').val(btnToEdit.task),
                $('edit-image-inp').val(btnToEdit.task2),
                $('edit-description-inp').val(btnToEdit.task3),
                $('.main-modal2').css('display', 'block')
        })
})




$('.btn-save').on('click', async function (e) {
    console.log('save')
    console.log(idToEdit)
    if (!$('.edit-inp-title').val() && $('edit-image-inp').val() && $('edit-description-inp').val().trim()) {
        alert('Заполните поле')
        $('.edit-inp-title').val('')
        $('edit-image-inp').val('')
        $('edit-description-inp').val('')
        return
    }

    let editedDocBtn = {
        title: await $(".edit-inp-title").val(),
        image:  await $('.edit-image-inp').val(),
        description:  await $('.edit-description-inp').val()
    }

    console.log(editedDocBtn)

    fetch(`${API}/${idToEdit}`, {
            method: 'PATCH',
            body: JSON.stringify(editedDocBtn),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        .then(() => {
            renderDocumBtn()
            $('.main-modal2').css('display', 'none')
        })
});


getPagination();

function getPagination() {
    fetch(`${API}?q=${searchText}`)
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 5);
            $('.pagination-page').remove();

            for (let i = pageCount; i >= 1; i--) {
                $('.previous-btn').after(`
            <span class="pagination-page">
                <a href="#">${i}</a>
            </span>
            `)
            }
        })
}


$('.next-btn').on('click', function () {
    if (page >= pageCount) return
    console.log('click next')
    page++
    render()
})

$('.previous-btn').on('click', function () {
    if (page <= 1) return
    console.log('click next')
    page--
    render()
})

$('body').on('click', '.pagination-page', function (e) {
    page = e.target.innerText;
    render()
});