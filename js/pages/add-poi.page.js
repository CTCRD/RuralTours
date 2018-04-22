function renderPoiPage(){
  var app = $('#app').html( html`
    <div id='content'>
      <div id="go-to-home">&#215;</div>
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

  app.find('#go-to-home').click(()=>{
    Router.go()
  })


  app.find('#poi-modal-content button').click(()=>{
    let input = modal.find('input')
    let src = input.val()
    if(src == '') return
    sources.push(src)
    modal.addClass('hide-me')
    input.val('')
    try{
      app.find('#photo-list').append(photo(src))
      app.find('#photo-list .photo-square:last-child').click( e =>{
        swal({
          title: "Borrar esta foto?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then( res =>{
          if(res){
            let find = $(e.target).find('img').attr('src')
            sources.splice(sources.indexOf(find),1)
            e.currentTarget.remove()
          }
        })
      })
    } catch {
      app.find('#photo-list .photo-square:last-child').remove()
    }

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

    let newPOI = {}
    form.forEach(field => newPOI[field.name] = field.value)
    newPOI.photos = sources;
    newPOI.location = { lat: newPOI.lat, lng: newPOI.lng }
    delete newPOI.lat
    delete newPOI.lng

    Loading.show()
    axios.post('http://api.ruraltours.online/api/pois', newPOI).then(()=>{
      Loading.hide()
      swal("Sitio agregado!", "", "success").then( res =>{
        res && Router.reload()
      })
    })
  })

  function photo(src){
    return html`
      <div class="photo-square">
        ${ src ? 
        `
          <div id="delete-photo">&#215;</div>
          <img src="${src}"/>
        ` : 
        `<div id="photo-add">+</div>` }
      </div>
    `
  }
}