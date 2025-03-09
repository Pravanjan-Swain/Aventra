var map;
function initMap1() {
  map = new mappls.Map("map", {});
  map.addListener('load', function() {
    Marker1 = new mappls.Marker({
        map: map,
        position: {
            "lat": coordinates[1],
            "lng": coordinates[0]
        },
        fitbounds: true,
        draggable: true,
        html: '<div><img class="bouncing bounce" src="https://apis.mapmyindia.com/map_v3/1.png"></div>',
        popupHtml: '<div>Exact location will be provided after booking</div>'
    });
  });
}