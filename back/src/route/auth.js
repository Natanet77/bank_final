// Підключаємо технологію express до бек-енду сервера
const express = require('express')
// Створюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')

User.create({
  email: 'test@mail.com',
  password: 123,
})

// ======================================================

// router.get Створює нам один ентпоїнт

router.get('/signup', (req, res) => {
  return res.render('signup', {
    name: 'signup',
    data: {},
  })
})

router.post('/signup', function (req, res) {
  const { email, password } = req.body
  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error. There are no required fields',
    })
  }

  try {
    User.create({ email, password })
    return res.status(200).json({
      message: 'The user is successfully registered',
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error creating user',
    })
  }
})

// Експортуємо глобальний роутер
module.exports = router
