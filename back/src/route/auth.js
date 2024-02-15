// Підключаємо технологію express до бек-енду сервера
const express = require('express')
// Створюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const Notification = require('../class/notification')

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

// ====================================================
router.get('/signin', function (req, res) {
  res.render('signin', {
    name: 'signin',

    data: {},
  })
})

router.post('/signin', function (req, res) {
  console.log('signin  req.body', req.body)
  const { email, password } = req.body
  console.log('signin email, password: ', email, password)

  if (!email || !password) {
    console.log('3- pass: !email || !password')
    return res
      .status(400)
      .json({ error: 'Email and password are required' })
  } else {
    console.log('email and Password', email.password)
    const user = User.getUserByEmail(email)
    console.log(user)

    if (!user) {
      return res.status(409).json({
        error: "A user with this email isn't exists",
      })
    } else if (user.password !== password) {
      return res.status(409).json({
        error: 'Wrong password',
      })
    } else {
      user.isLogged = true

      user.notifications.push(
        new Notification('New login', 'Warning'),
      )

      res.status(201).json({
        message: 'User is logged successfully',
        user: {
          isLogged: user.isLogged,
          isConfirmed: user.isConfirmed,
          token: user.token,
          email: user.email,
        },
      })
    }
  }
})
// ====================================================

// Експортуємо глобальний роутер
module.exports = router
