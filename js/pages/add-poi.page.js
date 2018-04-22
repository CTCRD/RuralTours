function renderPoiPage(){
  var app = $('#app').html( html`
    <div id='content'>
      <h2>Rural Tours - Agregar sitio</h2>
      <form action="javascript:void(0)">
        <div class="row three">
          <div class="input-group">
            <label for="poi-name"> Nombre </label>
            <input name="name" id="poi-name"/>
          </div>
          <div class="input-group">
            <label for="poi-lat"> Latitud </label>
            <input name="lat" id="poi-lat"/>
          </div>
          <div class="input-group">
            <label for="poi-lng"> Longitud </label>
            <input name="lng" id="poi-lng"/>
          </div>
        </div>
        <div class="row">
          <div class="input-group full">
            <label for="poi-description"> Descripción </label>
            <textarea name="description" rows="8" id="poi-description"></textarea>
          </div>
        </div>
      </form>
      <div class="row">
        <div class="input-group full">
          <label> Link de foto </label>
          <div id="photo-list">
            ${photo()}          
          </div>
        </div>
      </div>
      <button id="poi-add">Agregar</button>
      <div id="poi-modal-bkg" class="hide-me">
        <div id="poi-modal-content">
          <h4> Introducir link</h4>
          <input name="photo-link" id="photo-link"/>
          <button>Ok</button>
        </div>
      </div>
    </div>
  `)
  let sources = []
  let modal = app.find('#poi-modal-bkg')

  modal.click(e =>{
    $(e.target).is(modal) && modal.addClass('hide-me')
  })

  app.find('#photo-add').click(()=>{
    modal.removeClass('hide-me')
  })


  app.find('#poi-modal-content button').click(()=>{
    let input = modal.find('input')
    let src = input.val()
    if(src == '') return
    sources.push(src)
    modal.addClass('hide-me')
    input.val('')
    app.find('#photo-list').append(photo(src))
  })

  app.find('#poi-add').click(()=>{
    let form = app.find("form").serializeArray()
    let valid = form.every(el => !!el.value)
    if(!valid){
      swal("Necesitamos todos los campos", "", "error");
      return;
    }
    if(!sources.length){
      swal("Necesitamos fotos!", "", "error");
      return;
    }
    Loading.show()
    setTimeout(()=>{
      Loading.hide()

      
      swal("Sitio agregado!", "", "success").then( res =>{
        res && Router.reload()
      })
    },1000)
  })

  function photo(src){
    return html`
      <div class="photo-square">
        ${ src ? 
        `<img src="${src}"/>` : 
        `<div id="photo-add">+</div>` }
      </div>
    `
  }
}