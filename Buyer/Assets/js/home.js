function print(data){
    console.log(data);
}

const query = window.location.search;
print(query);
const urlParams = new URLSearchParams(query);
const product = urlParams.get('type');
print(product);