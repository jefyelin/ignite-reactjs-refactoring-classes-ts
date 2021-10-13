import { useCallback, useEffect, useState } from 'react'
import { FiEdit3, FiTrash } from 'react-icons/fi'

import { Container } from './styles'
import { api } from '../../services/api'

export type FoodInfo = {
  available: boolean
  id: string
  name: string
  image: string
  description: string
  price: number
}

interface FoodProps {
  food: FoodInfo
  handleEditFood: (food: FoodInfo) => void
  handleDelete: (foodId: string) => void
}

export const Food = ({
  food,
  handleEditFood,
  handleDelete
}: FoodProps) => {
  const [isAvailable, setIsAvaliable] = useState(false)

  const {
    available,
    id,
    name,
    image,
    description,
    price
  } = food

  const handleSetIsAvaliable = useCallback((available: boolean) => {
    setIsAvaliable(available)
  }, [])

  const toggleAvailable = async () => {
    await api.put(`/foods/${food.id}`, {
      ...food,
      available: !isAvailable,
    })

    handleSetIsAvaliable(!isAvailable)
  }

  const setEditingFood = () => {
    handleEditFood(food)
  }

  useEffect(() => {
    handleSetIsAvaliable(available)
  }, [available, handleSetIsAvaliable])

  return (
    <Container available={isAvailable}>
      <header>
        <img src={image} alt={name} />
      </header>
      <section className="body">
        <h2>{name}</h2>
        <p>{description}</p>
        <p className="price">
          R$ <b>{price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(id)}
            data-testid={`remove-food-${id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${id}`} className="switch">
            <input
              id={`available-switch-${id}`}
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  )
}
