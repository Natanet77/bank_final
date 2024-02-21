const User = require('./User')
const Transaction = require('./transaction')
const Notification = require('./notification')

class TransactionHandler {
  static processTransaction(
    senderEmail,
    receiverEmail,
    amount,
  ) {
    const senderUser = User.getUserByEmail(senderEmail)
    const receiverUser = User.getUserByEmail(receiverEmail)

    if (senderUser && receiverUser) {
      if (senderUser.balance >= amount) {
        new Transaction(senderEmail, receiverEmail, amount)
        senderUser.balance -= amount
        senderUser.transactions.push({
          id: senderUser.transactions.length + 1,
          correspondent: receiverEmail,
          timestamp: new Date(),
          type: 'Sending',
          amount,
        })
        senderUser.notifications.push(
          new Notification(
            `$${amount} sent to ${receiverEmail}`,
            'Announcement',
          ),
        )
        receiverUser.balance += amount
        receiverUser.transactions.push({
          id: receiverUser.transactions.length + 1,
          correspondent: senderEmail,
          timestamp: new Date(),
          type: 'Receipt',
          amount,
        })

        receiverUser.notifications.push(
          new Notification(
            `${senderEmail} sent to you $${amount}`,
            'Announcement',
          ),
        )
      } else {
        throw new Error('Insufficient balance')
      }
    } else {
      throw new Error(
        'Sender or receiver account not found',
      )
    }
  }
}

module.exports = { TransactionHandler }
