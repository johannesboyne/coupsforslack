'use strict';
const https = require('https')
const gju   = require('geojson-utils')

console.log('starting function')
exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  // get coups
  https.get('https://app.joincoup.com/api/v1/scooters.json', res => {
    let json = ''
    res.on('data', d => { json += ''+d; })
    res.on('end', _ => {
      // process json
      const scooters    = JSON.parse(json)
      const refPoint    = {type: 'Point', coordinates:[13.4074892, 52.5233866]};
      const pin         = 'pin-m-bicycle+8cc'
      const mapstyle    = 'mapbox.streets'
      const mapboxURL1  = 'https://api.tiles.mapbox.com/v4/'+mapstyle+'/'
      let mapboxURLk    = 'pin-m-star+88c(13.4074892,52.5233866),'
      let mapboxURLg    = '/' + refPoint.coordinates.join(',') + ',16'
      const mapboxURLn  = '/800x800@2x.png?access_token=' + process.env.MAPBOX_TOKEN

      // map, sort, slice scooters
      scooters.data.scooters = scooters.data.scooters.map(s => {
        s.distance = gju.pointDistance({type: 'Point', coordinates:[s.location.lng, s.location.lat]}, refPoint)
        return s
      }).sort((a,b) => {
        return a.distance <= b.distance ? -1 : 1
      }).slice(0,6)

      // build mapbox URL parts
      mapboxURLk += scooters.data.scooters.map(s => {
        return pin + '('+s.location.lng+','+s.location.lat+')'
      }).join(',')

      console.log(mapboxURL1+mapboxURLk+mapboxURLg+mapboxURLn)
      cb(null, { location: mapboxURL1+mapboxURLk+mapboxURLg+mapboxURLn })
    });
  })
}
