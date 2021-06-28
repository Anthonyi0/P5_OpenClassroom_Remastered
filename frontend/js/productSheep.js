let panier = getpanier()
let params = (new URL(document.location)).searchParams;
    console.log(params.get('id'));
let id = params.get('id');
fetch('http://localhost:3000/api/produits/'+ id, {method: 'GET'})
.then(response => { 
    if(response.status === 200) {
        return response.json()
    }
}).catch(error => {
    document.querySelector('body').innerHTML = "Désolez une erreur avec le serveur s'est produite";
    console.log(error)
}).then( product  => {
    console.log(product);

    productNode = document.querySelector('#product');
    let name = productNode.querySelector('h4').innerText = product.name;
    let description = productNode.querySelector('.description').innerText = product.description;
    let image = productNode.querySelector('img').attributes.src.value = product.imageUrl;
    let price = productNode.querySelector('.price').innerText = product.price;
    let select = productNode.querySelector('select');
    product.options.forEach(element => {
        let option = document.createElement('option')
        option.text = element
        select.appendChild(option)
    }); 
    productNode.querySelector("a").addEventListener('click', event =>{
        event.preventDefault()
        let quantity =  parseInt(productNode.querySelector('#quantity').value);
        let productExist = false
        panier.products.forEach(element =>{
            //Vérifie si un produit à le même id et les options
            if(element.id === id && element.option === select.value){
                element.quantity += quantity;
                productExist = true
            }
        })
        if (productExist === false){
            panier.products.push({
                id: id,
                name: name,
                description: description,
                image: image,
                option: select.value,
                quantity: quantity,
                unitPrice: price,
            })
        }
        if (window.confirm("Validation de l'article")){
            localStorage.setItem('panier',JSON.stringify(panier))
            window.location.replace('panier.html')
        }else{
            window.location.replace('index.html')
        }
        })
}).catch(error => {
    document.querySelector('#product').innerHTML = 'Le produit n\'existe pas';
    console.log(error)
})