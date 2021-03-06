function renderPoiPage(poi){
  var app = $('#app').html( html`
    <div id='content'>
      <div id="go-to-home">&#215;</div>
      <h2>Rural Tours - ${poi ? "Actualizar" : "Agregar"} sitio</h2>
      <form action="javascript:void(0)">
        <div class="row three">
          <div class="input-group">
            <label for="poi-name"> Nombre </label>
            <input name="name" id="poi-name" value="${poi ? poi.name : ''}"/>
          </div>
          <div class="input-group">
            <label for="poi-lat"> Latitud </label>
            <input name="lat" id="poi-lat" value="${poi ? poi.location.lat : ''}"/>
          </div>
          <div class="input-group">
            <label for="poi-lng"> Longitud </label>
            <input name="lng" id="poi-lng" value="${poi ? poi.location.lng : ''}"/>
          </div>
        </div>
        <div class="row">
          <div class="input-group full">
            <label for="poi-description"> Descripción </label>
            <textarea name="description" rows="8" id="poi-description">${poi ? poi.description : ''}</textarea>
          </div>
        </div>
      </form>
      <div class="row">
        <div class="input-group full">
          <label> Link de foto </label>
          <div id="photo-list">
            <div class="photo-square">
              <div id="photo-add">+</div>
            </div>
          </div>
        </div>
      </div>
      <button id="poi-add">${poi ? "Actualizar" : "Agregar"}</button>
      <div id="poi-modal-bkg" class="hide-me">
        <div id="poi-modal-content">
          <h4> Introducir link</h4>
          <input name="photo-link" id="photo-link"/>
          <button>Ok</button>
        </div>
      </div>
    </div>
  `)
  let sources = poi ? poi.photos : []
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
  
  function addPhoto(src){
    sources.push(src)
    modal.addClass('hide-me')
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
            let find = $(e.currentTarget).find('img').attr('src')
            sources.splice(sources.indexOf(find),1)
            
            e.currentTarget.remove()
          }
        })
      })
    } catch(error) {
      app.find('#photo-list .photo-square:last-child').remove()
    }
  }
  
  if(poi) sources.forEach( el => addPhoto(el))

  app.find('#poi-modal-content button').click(() =>{
    let input = modal.find('input')
    let src = input.val()
    if(src == '' ) return
    addPhoto(src)
    input.val('')
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
    axios.put('http://api.ruraltours.online/api/pois', newPOI).then(()=>{
      Loading.hide()
      swal("Sitio " + (poi ? "actualizado!" : "agregado!"), "", "success").then( res =>{
        res && Router.reload()
      })
    }).catch(()=>{
      Loading.hide()
      swal("Error de red, intentar luego", "", "error")
    })
  })

  function photo(src){
    return html`
      <div class="photo-square">
          <div id="delete-photo">&#215;</div>
          <img src="${src}"/>
      </div>
    `
  }
}