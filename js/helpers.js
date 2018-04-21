var html = (s, ...k)=> s.map((d,i)=> d + (k[i] || '')).join('');

var Loading = (()=>{
  function show(){
    $("#loading").removeClass('hide-me')
  }
  function hide(){
    $("#loading").addClass('hide-me')
  }
  
  return {
    show, hide
  }
})()