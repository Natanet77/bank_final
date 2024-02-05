// // Підключаємо роутер до бек-енду
// const express = require('express')
// const router = express.Router()

// // Підключіть файли роутів
// // const test = require('./test')
// // Підключіть інші файли роутів, якщо є

// // Об'єднайте файли роутів за потреби
// // router.use('/', test)
// // Використовуйте інші файли роутів, якщо є

// const auth = require('./auth')

// router.use('/', auth)

// router.get('/', (req, res) => {
//   res.status(200).json('Hello World')
// })

// // Експортуємо глобальний роутер
// module.exports = router
// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()


// Підключіть файли роутів
// const test = require('./test')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// router.use('/', test)
// Використовуйте інші файли роутів, якщо є
const users = {}

function createUser(email, password) {
  const JWT_SECRET_KEY = 'your_secret_key_here'
  const token = jwt.sign({ email }, JWT_SECRET_KEY, {
    expiresIn: '1h',
  })
  const confirmationCode = Math.floor(
    1000 + Math.random() * 9000,
  ).toString()
  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    confirmationCode,
    token,
  }
  users[email] = newUser
  console.log('Новий користувач створений:', newUser)

  return newUser
}

async function checkUserExists(email) {
  return users[email]
}

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})

router.post('/signup', async (req, res) => {
  const { email, password, token } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    })
  }

  try {
    if (await checkUserExists(email)) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      })
    }

    const newUser = createUser(email, password, token)

    res.status(200).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: newUser,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
})

router.post('/signupConfirm', (req, res) => {
  const { email, confirmationCode } = req.body
  console.log(
    'Запит на підтвердження реєстрації:',
    email,
    confirmationCode,
  ) // Логування даних запиту

  if (!email || !confirmationCode) {
    return res.status(400).json({
      success: false,
      message: 'Email and confirmation code are required.',
    })
  }

  const user = users[email]
  if (user && user.confirmationCode === confirmationCode) {
    res.json({
      success: true,
      message: 'User confirmed',
      redirect: '/balance-page',
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid confirmation code',
    })
  }
})

router.get('/get-confirmation-code', (req, res) => {
  const userEmail = req.query.email
  console.log(
    'Запит на отримання коду підтвердження для:',
    userEmail,
  )

  if (!userEmail) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    })
  }

  const user = users[userEmail]
  console.log('Користувач для коду підтвердження:', user)

  if (user && user.confirmationCode) {
    res.json({
      success: true,
      confirmationCode: user.confirmationCode,
    })
  } else {
    res.status(404).json({
      success: false,
      message:
        'User not found or confirmation code is missing',
    })
  }
})

router.post('/signin', async (req, res) => {
  const { email, token } = req.body
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token is required',
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
    )
    if (
      !users[email] ||
      users[email].id !== decoded.userId
    ) {
      throw new Error(
        'Invalid token or user does not exist',
      )
    }
    // Якщо токен валідний і користувач існує
    res.status(200).json({
      success: true,
      message: 'User logged in successfully.',
    })
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid token.' })
  }
})

router.post('/change-email', async (req, res) => {
  const { email, newEmail } = req.body
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header is missing',
    })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Token is missing' })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
    )
    const user = users[decoded.userId]

    if (!user || user.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'Current email does not match!',
      })
    }
    console.log('user', user)
    user.email = newEmail
    res.status(200).json({
      success: true,
      message: 'Email updated successfully.',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
})

router.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword, token } =
    req.body

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token is required',
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
    )
    const user = users[decoded.userId]

    if (
      !user ||
      user.email !== email ||
      user.password !== oldPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials.',
      })
    }

    user.password = newPassword
    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
})
// Ендпойнт для виходу з системи
router.post('/logout', (req, res) => {
  // Виход з системи не потребує серверної обробки, якщо ви просто видаляєте токен на клієнті
  res
    .status(200)
    .json({ success: true, message: 'Logout successful.' })
})

function generateConfirmationCode() {
  return Math.floor(
    100000 + Math.random() * 900000,
  ).toString() // 6-значний код
}

// Ендпоінт для ініціалізації процесу відновлення паролю
router.post('/recovery', async (req, res) => {
  const { email } = req.body
  // Assume the function sendRecoveryCode handles email sending
  const user = await checkUserExists(email)
  if (user) {
    user.confirmationCode = generateConfirmationCode()
    await sendRecoveryCode(email, user.confirmationCode)
    res.status(200).json({
      success: true,
      message: 'Recovery code sent.',
    })
  } else {
    res
      .status(404)
      .json({ success: false, message: 'User not found.' })
  }
})

// Endpoint to confirm recovery and update the password
router.post('/recovery-confirm', async (req, res) => {
  const { email, confirmationCode, password } = req.body
  const user = await checkUserExists(email)
  if (user && user.confirmationCode === confirmationCode) {
    // Update user's password and clear the confirmation code
    user.password = password
    user.confirmationCode = null
    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid confirmation code or email.',
    })
  }
})

module.exports = router
