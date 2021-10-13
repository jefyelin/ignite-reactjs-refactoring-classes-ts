import { useEffect, useState } from 'react'

import { Header } from '../../components/Header'
import { api } from '../../services/api'
import { Food as FoodComponent, FoodInfo } from '../../components/Food'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'

type Food = {
  image: string
  name: string
  price: string
  description: string
}

export const Dashboard = () => {
  const [foods, setFoods] = useState<FoodInfo[]>([])
  const [editingFood, setEditingFood] = useState<FoodInfo>({
    available: false,
    description: '',
    id: '',
    image: '',
    name: '',
    price: 0,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    const handleSetFoods = async () => {
      const response = await api.get('/foods')

      setFoods(response.data)
    }

    handleSetFoods()
  }, [])

  const handleAddFood = async (food: Food) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods(prevState => [...prevState, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateFood = async (food: Food) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      )

      const foodsUpdated: FoodInfo[] = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = async (id: string) => {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)

    setFoods(foodsFiltered)
  }

  const handleEditFood = (foodInfo: FoodInfo) => {
    setEditingFood(foodInfo)
    setEditModalOpen(true)
  }

  const toggleModal = () => {
    setModalOpen(prevState => !prevState)
  }

  const toggleEditModal = () => {
    setEditModalOpen(prevState => !prevState)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <FoodComponent
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
