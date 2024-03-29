// Підключаємо технологію express до бек-енду сервера
const express = require('express')
// Створюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')

const { Confirm } = require('../class/confirm')

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
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Помилка. Такий користувач вже існує',
      })
    }

    const newUser = User.create({ email, password })

    const session = Session.create(newUser)
    Confirm.create(newUser.email)
    return res.status(200).json({
      message: 'The user is successfully registered',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error creating user',
    })
  }
})

// ====================================================
// router.get Створює шлях (PATH) до сторінки
router.get('/signupConfirm', function (req, res) {
  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('signupConfirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Signup confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signupConfirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message:
          'Error. You are not signed in to your account',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Code does not exist',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Code is not valid',
      })
    }

    const user = User.getByEmail(session.user.email)

    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'You have confirmed your email',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
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
  const { email, password } = req.body
  console.log(req.body)
  // console.log('signin email, password: ', email, password)

  const user = User.getUserByEmail(email)
  if (!email || !password) {
    return res.status(400).json({
      message: 'Error. There are no required fields',
    })
  }
  try {
    User.create({ email, password })
    return res.status(200).json({
      message: 'The user is successfully registered',
      user: {
        isLogged: user.isLogged,
        isConfirmed: user.isConfirmed,
        token: user.token,
        email: user.email,
      },
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error creating user',
    })
  }
  // if (!user) {
  //   // Check if a user with the same email already exists

  //   return res.status(409).json({
  //     error: "A user with this email isn't exists",
  //   })
  // } else if (user.password !== password) {
  //   return res.status(409).json({
  //     error: 'Wrong password',
  //   })
  // } else {
  //   user.isLogged = true

  //   user.notifications.push(
  //     new Notification('New login', 'Warning'),
  //   )
  // res.status(200).json({
  //   message: 'User is logged successfully',
  //   user: {
  //     isLogged: user.isLogged,
  //     isConfirmed: user.isConfirmed,
  //     token: user.token,
  //     email: user.email,
  //   },
  // })
  // console.log('signin  req.body', req.body)
  // const { email, password } = req.body
  // // console.log('signin email, password: ', email, password)

  // if (!email || !password) {
  //   // Check if email or password are missing
  //   console.log('3- pass: !email || !password')
  //   return res.status(400).json({
  //     message: 'Error. There are no required fields',
  //   })
  // } else {
  //   console.log('email and Password', email.password)
  //   const user = User.getUserByEmail(email)
  //   console.log(user)

  //   if (!user) {
  //     // Check if a user with the same email already exists

  //     return res.status(409).json({
  //       error: "A user with this email isn't exists",
  //     })
  //   } else if (user.password !== password) {
  //     return res.status(409).json({
  //       error: 'Wrong password',
  //     })
  //   } else {
  //     user.isLogged = true

  //     user.notifications.push(
  //       new Notification('New login', 'Warning'),
  //     )

  //     res.status(200).json({
  //       message: 'User is logged successfully',
  //       user: {
  //         isLogged: user.isLogged,
  //         isConfirmed: user.isConfirmed,
  //         token: user.token,
  //         email: user.email,
  //       },
  //     })
  //   }
  // }
})

// router.post('/signin', function (req, res) {
//   const { email, password } = req.body
//   console.log(email, password)
//   console.log(req.body)
//   if (!email || !password) {
//     console.log('3- pass: !email || !password')
//     return res
//       .status(400)
//       .json({ error: 'Email and password are required' })
//   } else {
//     console.log('email and password', email, password)
//     const user = User.getUserByEmail(email)
//     console.log(user)

//     if (!user) {
//       return res.status(409).json({
//         error: "A user with this email isn't exists",
//       })
//     } else if (user.password !== password) {
//       return res.status(409).json({
//         error: 'Wrong password',
//       })
//     } else {
//       user.isLogged = true

//       user.notifications.push(
//         new Notification('New login', 'Warning'),
//       )

//       res.status(201).json({
//         message: 'User is logged successfully',
//         user: {
//           isLogged: user.isLogged,
//           isConfirmed: user.isConfirmed,
//           token: user.token,
//           email: user.email,
//         },
//       })
//     }
//   }
// })
// // router.post('/signin', function (req, res) {
// //   const { email, password } = req.body
// //   console.log(email, password)
// //   let token = ''

// //   if (!email || !password) {
// //     return res.status(400).json({
// //       message: "Помилка. Обов'язкові поля відсутні",
// //     })
// //   }

// //   try {
// //     const user = User.getByEmail(email)

// //     if (!user) {
// //       return res.status(400).json({
// //         message:
// //           'Такий email не зареєстрований. Для реєстрації натисніть Sign Up.',
// //       })
// //     }

// //     if (user.password !== password) {
// //       return res.status(400).json({
// //         message:
// //           'Невірний пароль. Для відновлення паролю натисніть Restore.',
// //       })
// //     }

// //     const session = Session.create(user)
// //     token = session.token

// //     Confirm.create(user.email)

// //     Notification.create(session, {
// //       operation: 'SIGNIN',
// //       status: 'SUCCESS',
// //       message: 'Користувач успішно зайшов в систему',
// //     })

// //     return res.status(200).json({
// //       message: 'Користувач успішно зайшов в систему',
// //       session,
// //     })
// //   } catch (err) {
// //     Notification.create(
// //       { token: token, user: { email: email } },
// //       {
// //         operation: 'SIGNIN',
// //         status: 'ERROR',
// //         message: err.message,
// //       },
// //     )

// //     return res.status(400).json({
// //       message: 'Помилка входу в систему',
// //     })
// //   }
// // })

// router.post('/signin', function (req, res) {
//   const { email, password } = req.body
//   if (!email || !password) {
//     return res.status(400).json({
//       message: "Помилка. Обов'язкові поля відсутні",
//     })
//   }

//   try {
//     const user = User.getByEmail(email)

//     if (!user) {
//       return res.status(400).json({
//         message:
//           'Помилка. Користувач з таким email не існує',
//       })
//     }

//     if (user.password !== password) {
//       return res.status(400).json({
//         message: 'Помилка. Пароль не підходить',
//       })
//     }

//     const session = Session.create(user)

//     return res.status(200).json({
//       message: 'Ви увійшли',
//       session,
//     })
//   } catch (err) {
//     return res.status(400).json({
//       message: err.message,
//     })
//   }
// })
// ====================================================

// Експортуємо глобальний роутер
module.exports = router
