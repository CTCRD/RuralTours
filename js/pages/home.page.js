function renderHomePage(){
  var app = $('#app').html( html`
    <div id="nav">
      <div id="go-to-add-poi">+</div>
    </div>
    <div id="map"></div>
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
    if (strictBounds.contains(map.getCenter())) return;

    var c = map.getCenter(),
        x = c.lng(),
        y = c.lat(),
        maxX = strictBounds.getNorthEast().lng(),
        maxY = strictBounds.getNorthEast().lat(),
        minX = strictBounds.getSouthWest().lng(),
        minY = strictBounds.getSouthWest().lat();

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    map.setCenter(new google.maps.LatLng(y, x));
  });
  
  let markers = []
  axios.get('http://api.ruraltours.online/api/pois').then((response) =>{
    console.log("response", response.data)
    response.data.forEach(poi =>{
      let marker = new google.maps.Marker({
        position: poi.location,
        map: map
      })
      marker.addListener('click', ()=>{swal("Has seleccionado: " + poi.name)})
      markers.push(marker)
    })
  });
}