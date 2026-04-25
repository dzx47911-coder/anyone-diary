import React from 'react'

const Icon = ({ name, size = 20 }) => {
  return (
    <svg className={`icon icon-${name}`} style={{ width: size, height: size }}>
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
  )
}

export default Icon