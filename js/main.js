let API = 'http://localhost:8009/document'
let btnAdd = $('.btnAdd');
let titleInp = $('.title');
let imageInp = $('.image');
let descriptionInp = $('.description');
let editedId = null;
let searchText = '';
let pageCount = 1;
let page = 1;
let idToEdit = '';


renderDocumBtn();

$('.search-inp').on('input', function(e){
    searchText = e.target.value;
    renderDocumBtn();
})


btnAdd.on('click', function(){
    $('.main-modal').css('display', 'block')
})


$('.add-btn').on('click', function(){
    
    let newDocumBtn = {
        title: $('.title').val(),
        image: $('.image').val(),
        description: $('.description').val()
    }
    
    fetch(API, {
        method: 'POST',
        body: JSON.stringify(newDocumBtn),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => renderDocumBtn())
})

$('.btn-close').on('click', function(){
    $('.main-modal').css('display', 'none');
})

$('.btn-close').on('click', function(){
    $('.main-modal2').css('display', 'none');
})

renderDocumBtn();


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

                
                $(`#${item.id}`).on('click', function(){
                    idToEdit = item.id;
                })
            });
        }) 
}


$('.box__items').on('click', '.btn-delete', function(e){
    let id = e.target.parentNode.id;
    console.log(id)
    fetch(`${API}/${id}/`,{
        method: 'DELETE',
    })
    .then(() => renderDocumBtn())
})



$('.box__items').on('click', '.btn-edit', function(e){
    editedId = e.target.parentNode.id;
    console.log('asdasd')
    fetch(`${API}/${editedId}/`)
        .then(res => res.json())
        .then(btnToEdit => {
            $('.edit-inp').val(btnToEdit.title);
            $('.main-modal2').css('display', 'block')
        })
})




$('.btn-save').on('click', async function(e){
    console.log('save')
    console.log(idToEdit)
    if(!$('.edit-inp').val().trim()){
        alert('Заполните поле')
        $('.edit-inp').val('')
        return
    }

    let editedDocBtn = {
        title: await $('.edit-inp').val()
    }

    console.log(editedDocBtn)

    console.log(`${API}/${idToEdit}`)

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

function getPagination(){
    fetch(`${API}?q=${searchText}`)
    .then(res => res.json())
    .then(data => {
        pageCount = Math.ceil(data.length / 5);
        $('.pagination-page').remove();

        for(let i = pageCount; i >= 1; i--){
            $('.previous-btn').after(`
            <span class="pagination-page">
                <a href="#">${i}</a>
            </span>
            `)
        }
    })
}


$('.next-btn').on('click', function(){
    if(page >= pageCount) return
    page++
    render()
})

$('.previous-btn').on('click', function(){
    if(page <= 1) return
    page--
    render()
})

$('body').on('click', '.pagination-page', function(e){
    page = e.target.innerText;
    render()
});


