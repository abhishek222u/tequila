'use client'
import { ReactNode } from 'react'

interface ButtonProps {
  text: string
  extraClasses?: string
  onClick: () => void
}

const Button = ({ text, extraClasses, onClick }: ButtonProps) => {
  return (
    <button
      type={'button'}
      className={`tq__button ${extraClasses ? extraClasses : ''}`}
      onClick={onClick}
    >
      <span className="tq__button__text">{text}</span>
      <span className="tq__button__fill-bg"></span>
    </button>
  )
}

export default Button
