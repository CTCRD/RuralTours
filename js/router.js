var Router = (() =>{
  let callbacks = {
    'home': renderHomePage,
    'add-poi': renderPoiPage,
  }

  function reload(args){
    let hash = window.location.pathname.substr(1).split('/')
    if (callbacks[hash[0]]) callbacks[hash[0]](args)
    else {
      window.location.hash = ''
      callbacks['home'](args)
    }
  }

  $(document).ready(()=>{
    reload()
  })

  function params(){
    let hash = window.location.pathname.substr(1).split('/')
    if(hash.length > 1) return hash.slice(1)
    else return []
  }

  function go(hash, ...args){
    history.pushState(null, null, (hash == 'home' || !hash ? '/' : hash));
    reload(args)
  }
  
  window.onpopstate = ()=>{
    Router.reload()
  }

  return {
    reload, go, params
  }

})()