var Router = (() =>{
  let callbacks = {
    'home':()=>{ renderPoiPage() },
    'add-poi':()=>{ renderPoiPage() },
  }

  function reload(){
    let hash = window.location.hash.substr(1).split('/')
    if (callbacks[hash[0]]) callbacks[hash[0]]()
    else {
      window.location.hash = ''
      callbacks['home']()
    }
  }

  reload()

  function params(){
    let hash = window.location.hash.substr(1).split('/')
    if(hash.length > 1) return hash.slice(1)
    else return []
  }

  function go(hash){
    history.pushState(null, null, '#' + (hash == 'home'? '' : hash));
    reload()
  }
  
  window.onhashchange = ()=>{
    Router.reload()
  }

  return {
    reload, go, params
  }

})()