function renderHomePage(){
  var app = $('#app').html( html`
    <div id="nav">
      <!-- <div id="go-to-add-poi">+</div> -->
      <div style="display: flex; justify-content: center; align-items: center; margin-left: 50px;">
        <img style="width: 50px; height: 50px; object-fit: cover;" src="/img/rural_icon.png"></img>
        <span style="font-size: 1.8em; margin-left: 20px;">Rural Tours</span>
      </div>
    </div>
    <div id="divide-home">
      <div id="side-bar"></div>
      <div id="map"></div>
    </div>
    <div id="poi-detail-modal-bkg" class="hide-me">
      <div id="poi-detail-modal-content" style="width">
        <h4> Introducir link</h4>
      </div>
    </div>
  `)
  app.find('#go-to-add-poi').click(()=>{
    Router.go('add-poi')
  })
   
  var ctc = {lat: 18.860430, lng: -70.169053}
  var map = new google.maps.Map(app.find('#map')[0], {
    zoom: 9,
    minZoom: 9,
    center: ctc,
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"off"},{"hue":"#ffb800"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"labels.icon","stylers":[{"hue":"#ff0000"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}],
    disableDefaultUI: true
  });

  var strictBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(17.696531, -72.984063),
    new google.maps.LatLng(20.068997, -68.007257)
  )
  
  google.maps.event.addListener(map, 'bounds_changed', function () {
    var bounds = map.getBounds(),
        newNE = {
          lat: bounds.getNorthEast().lat(), 
          lng: bounds.getNorthEast().lng()
        },
        newSW = {
          lat: bounds.getSouthWest().lat(), 
          lng: bounds.getSouthWest().lng()
        },
        strictNE = {
          lat: strictBounds.getNorthEast().lat(), 
          lng: strictBounds.getNorthEast().lng()
        },
        strictSW = {
          lat: strictBounds.getSouthWest().lat(), 
          lng: strictBounds.getSouthWest().lng()
        }
      
      if(!strictBounds.contains(newNE) || !strictBounds.contains(newSW)){
        if(newNE.lat < strictNE.lat) newNE.lat = strictNE.lat
        if(newNE.lng < strictNE.lng) newNE.lng = strictNE.lng
        if(newSW.lat > strictSW.lat) newSW.lat = strictSW.lat
        if(newSW.lng > strictSW.lng) newSW.lng = strictSW.lng
        map.fitBounds(new google.maps.LatLngBounds(newSW, newNE))
      }

  });
  
  let markers = []
  axios.get('http://api.ruraltours.online/api/pois').then((response) =>{
    console.log("response", response.data)
    response.data.reverse().forEach(poi =>{
      let marker = new google.maps.Marker({
        position: poi.location,
        map: map,
        icon: '/img/rural_icon.png'
      })
      marker.addListener('click', ()=>{swal("Has seleccionado: " + poi.name)})
      markers.push(marker)
      $('#side-bar').append(poiSide(poi))
    })
  });

  let key = {}
  function keypress(event){
    key[event.keyCode] = event.type == 'keydown';
    var center = {
          lat: map.getCenter().lat(), 
          lng: map.getCenter().lng()
        },
        movement = 0.008,
        UP = 87, 
        DOWN = 83, 
        LEFT = 65,
        RIGHT = 68,
        ZOOM_IN = 73,
        ZOOM_OUT = 79

    if(key[ZOOM_IN] && map.getZoom() < 14){
      map.setZoom(map.getZoom() + 1)
    } else if(key[ZOOM_OUT]){
      map.setZoom(map.getZoom() - 1)
    } else if(key[UP] && key[LEFT]){
      center.lat += movement
      center.lng -= movement
      map.setCenter(center)
    } else if(key[UP] && key[RIGHT]){
      center.lat += movement
      center.lng += movement
      map.setCenter(center)
    } else if(key[RIGHT] && key[DOWN]){
      center.lng += movement
      center.lat -= movement
      map.setCenter(center)
    } else if(key[DOWN] && key[LEFT]){
      center.lat -= movement
      center.lng -= marginas
      map.setCenter(center)
    } else if(key[UP]) { 
      center.lat += movement; 
      map.setCenter(center) 
    } else if(key[DOWN]){
      center.lat -= movement
      map.setCenter(center)
    } else if(key[LEFT]){
      center.lng -= movement
      map.setCenter(center)
    } else if(key[RIGHT]){
      center.lng += movement
      map.setCenter(center)
    }
    console.log(event.keyCode)

  }

  document.addEventListener('keydown', keypress);
  document.addEventListener('keyup', keypress);

  function poiSide(poi){
    return html`
      <div class="poi-side">
        <img src='${poi.photos[0]}'/>
        <span>${poi.name}</span>n
        <!-- <span>${poi.description}</span> -->
      </div>
    `
  }
}