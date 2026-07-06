import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const res = await api.get('/cart')
      setItems(res.data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart', { product_id: productId, quantity })
      await fetchCart()
      return res.data
    } catch (err) {
      throw err
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    await api.put(`/cart/${itemId}`, { quantity })
    await fetchCart()
  }

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await api.delete('/cart')
    setItems([])
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price
    return sum + Number(price) * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
