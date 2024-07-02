import { useEffect, useState } from 'react'


function App() {
 const [products, setProducts] = useState([]);
 const [cart, setCart] = useState([]);
 const [total, setTotal] = useState(0);
 const [amount, setAmount] = useState('')
 const [change, setChange] = useState(null)

 useEffect(() => {
  const fetchData = async() => {
    const res = await fetch('http://localhost:3000/products');
    const data = await res.json();
    setProducts(data)
  }
  fetchData()
 },[])

 useEffect(() => {
  getTotal()
}, [cart])

const getTotal = () => {
  const totalPrice = cart.reduce((total, item) => total + item.totalAmount, 0);
  setTotal(totalPrice)
}

const findProductIncart = (productId) => cart.find(item => item.id === productId)
const orderedItem = (product, op) => {
  const item = findProductIncart(product.id);
    if(op === "inc") {
      item.quantity += 1;
    }
    if(op === "dec") {
      if(item.quantity === 1) return;
      item.quantity -= 1;
    }
    item.totalAmount = item.quantity * item.price;
    setCart([...cart])
} 

const addToCart = (product) => {
    if(findProductIncart(product.id)) {
      orderedItem(product, "inc")
    } else {
      let addProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price
      }
      setCart([...cart, addProduct])
    }
}

const removeItem = (product) => {
  if(confirm('Delete item?')) {
    const filteredArr = cart.filter(item => item.id !== product.id);
    setCart(filteredArr)
  }
}
const handleChange = (e) => {
setAmount(e.target.value)
}
const handleSubmit = (e) => {
  e.preventDefault();
  const remaining = Number(amount) - total;
  setChange(remaining)
}

  return (
    <main className='my-5'>
      <div className='row mx-3'>
        <div className='col-lg-8'>
          <div className='auto-fill gap-2 mb-3'>
            {products.map(product => (                
              <div class="card text-center pt-3" role='button' key={product.id} onClick={() => addToCart(product)}>
                <img class="card-img-top img-fluid mx-auto d-block w-50 h-50 text-center" src={product.img} alt={product.title}/>
                <div class="card-body">
                  <h4 class="card-title">{product.title}</h4>
                  <p class="card-text">price: {product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='col-lg-4'>
        <div className='table-responsive bg-dark'>
        <table className='table table-responsive table-dark table-hover'>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(product => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td><button className='border-0 bg-transparent text-white' role='button' onClick={() => orderedItem(product,"dec")}>-</button>{product.quantity}<button className='border-0 bg-transparent text-white' role='button' onClick={() => orderedItem(product,"inc")}>+</button></td>
                  <td>{product.totalAmount}</td>
                  <td><button className='btn btn-danger' onClick={() =>removeItem(product)}>Delete</button></td>
              </tr>
              ))}             
            </tbody>
          </table>
        </div>
         <p className='mt-2'>Total item: {cart.length}</p>
         <h3 className='py-2'>Total Price: {total}</h3>
         <form onSubmit={handleSubmit}>
          <div className='d-flex flex-row'>
            <label>Amount Received:</label>
            <input type="text" className='form-control' value={amount} onChange={handleChange}/>
            <button type='submit' className='btn btn-primary'>Enter</button>
          </div>
         </form>  
         <h5 className='pt-3'>Change: {change}</h5>
        </div>
      </div>
    </main>
  )
}

export default App
