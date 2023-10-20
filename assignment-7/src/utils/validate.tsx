import { Topic } from '../_generated/model/topic'

export const validateBookForm = (
  bookName: string,
  authorName: string,
  bookTopic?: Topic,
) => {
  const errors = {
    name: '',
    author: '',
    topic: '',
  }

  // Book name validation
  if (bookName.trim().length < 5) {
    errors.name = 'Book name must be at least 5 characters long.'
  }

  // Author name validation
  if (!/^[a-zA-Z\s]+$/.test(authorName)) {
    errors.author = 'Author name must contain only letters and spaces.'
  }

  // Book topic validation
  if (!bookTopic?.name) {
    errors.topic = 'Book topic is required.'
  }

  return errors
}

export const validateLoginForm = (email: string, password: string) => {
  const errors = { email: '', password: '' }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    errors.email = 'Invalid email address.'
  }

  // Password validation
  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.'
  }
  if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter.'
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.password = 'Password must contain at least one symbol (!@#$%^&*).'
  }

  return errors
}
