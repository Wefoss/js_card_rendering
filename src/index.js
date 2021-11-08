const parent = document.querySelector('.list')
parent.addEventListener('click', listHandler)

fetch('./data.json').then((data) => data.json()).then((data) => {
   return data.forEach((el) => createItem(el))
}  )

    

function createItem(el) { 
    socialWrap = createOne('div', {className:['soсials']})
    fNamelName = createOne('p', {className:['list-item_name']}, document.createTextNode(`${el.firstName || 'unknow'} ${el.lastName || 'unknow'}`))
    img = createOne('img', {className:['list-item_image'], obj:el})
    pImg = createOne('p', {})
    imageWrapper = createOne('div', {className:['list-item_image-wrapper']}, pImg, img)
    li = createOne('li', {className:['list-item']}, imageWrapper, fNamelName, socialWrap)

    parent.append(li)

   el.contacts.forEach(elem => {
       let maps = new Map()
       maps.set(new URL(elem).hostname)
        if(maps.has('www.facebook.com')) {
            maps.set('www.facebook.com', 'fa-facebook-f')
        } else if (maps.has('twitter.com')) {
            maps.set('twitter.com', 'fa-twitter')
        } else maps.set('www.instagram.com', 'fa-instagram')
                               
     icon = createOne('i', {className : [maps.get(new URL(elem).hostname), 'fab']})
        link = createOne('a', {className:['soсial'], href:[elem]}, icon)   
        
           socialWrap.append(link)
 })
}

 function createOne(type, {className=[], href=[], obj =[]}, ...children) {
 const elem = document.createElement(type)
  if(className.length) {
     elem.classList.add(...className)
 }
  if(href.length) {
      elem.href = href
  }
 if(type === 'img') {
    elem.src = obj.profilePicture
     elem.addEventListener('error', (e) => {
         e.target.previousElementSibling.style.backgroundColor = stringToColour(obj.firstName || obj.lastName || 'unknow')
        e.target.previousElementSibling.classList.add(className)
        e.target.previousElementSibling.append(document.createTextNode(firstLetter(`${obj.firstName || 'unknow'} ${obj.lastName}`))) 
        e.target.remove()
    })
   }
   
 elem.append(...children)
 return elem
 }
let celebrityNames = []

 function listHandler (e) {
     if(!e.target.closest('.list-item')) {
         return
     }
     let items = e.target.closest('.list-item').children
         for (const el of items) {
        if(el.classList.contains('list-item_name') && !celebrityNames.includes(el.textContent))  {
            celebrityNames.push(el.textContent)
            let li = document.createElement('li')
            li.textContent = el.textContent
            e.target.closest('.list-item').parentNode.nextElementSibling.append(li)
        }
     }
   }

 function stringToColour(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

function firstLetter(str) {
    
    return str.split(' ').reduce((acc, el) => {
        acc+=el.slice(0, 1)
        return acc.toUpperCase()
    }, '')
 }